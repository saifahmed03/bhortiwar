import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Avatar,
  CircularProgress,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import {
  School,
  Add,
  Delete,
  Person,
  Logout,
  CheckCircle,
  CloudUpload,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getProfile } from "../../services/studentService";
import { supabase } from "../../supabaseClient";

const EXAM_TYPES = ['SSC', 'HSC', 'O Level', 'A Level', 'Bachelor', 'Master'];

export default function AcademicInfo() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [academicRecords, setAcademicRecords] = useState([]); // Saved records from DB
  const [pendingRecords, setPendingRecords] = useState([]); // Temporary records not yet saved
  const [newRecord, setNewRecord] = useState({
    exam_type: 'SSC',
    board: '',
    institution: '',
    gpa: '',
    year: '',
    certificate_url: ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await getProfile(user.id);
      setProfile(profileData || null);

      const { data: records } = await supabase
        .from('academic_records')
        .select('*')
        .eq('student_id', user.id)
        .order('year', { ascending: false });

      setAcademicRecords(records || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!newRecord.exam_type || !newRecord.institution || !newRecord.gpa || !newRecord.year) {
      alert('Please fill in all required fields');
      return;
    }

    // Add to pending records (not saved to DB yet)
    setPendingRecords([...pendingRecords, { ...newRecord, tempId: Date.now() }]);

    // Reset form
    setNewRecord({
      exam_type: 'SSC',
      board: '',
      institution: '',
      gpa: '',
      year: '',
      certificate_url: ''
    });
  };

  const handleSaveAll = async () => {
    if (pendingRecords.length === 0) {
      alert('No new records to save');
      return;
    }

    setSaving(true);
    try {
      // Prepare records for database
      const recordsToInsert = pendingRecords.map(record => ({
        student_id: user.id,
        exam_type: record.exam_type,
        board: record.board,
        institution: record.institution,
        gpa: parseFloat(record.gpa),
        year: parseInt(record.year),
        certificate_url: record.certificate_url
      }));

      const { error } = await supabase
        .from('academic_records')
        .insert(recordsToInsert);

      if (error) throw error;

      setPendingRecords([]); // Clear pending records
      await loadData();
      alert(`${recordsToInsert.length} academic record(s) saved successfully!`);
    } catch (err) {
      console.error("Save error:", err);
      alert(`Failed to save records: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePending = (tempId) => {
    setPendingRecords(pendingRecords.filter(r => r.tempId !== tempId));
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error } = await supabase
        .from('academic_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
      alert('Failed to delete record');
    }
  };

  const getCompletionPercentage = () => {
    const hasSSC = academicRecords.some(r => r.exam_type === 'SSC');
    const hasHSC = academicRecords.some(r => r.exam_type === 'HSC');
    const hasOLevel = academicRecords.some(r => r.exam_type === 'O Level');
    const hasALevel = academicRecords.some(r => r.exam_type === 'A Level');

    const bdComplete = hasSSC && hasHSC;
    const cambridgeComplete = hasOLevel && hasALevel;

    if (bdComplete || cambridgeComplete) return 100;
    if (hasSSC || hasHSC || hasOLevel || hasALevel) return 50;
    return 0;
  };

  const completionPercentage = getCompletionPercentage();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#0E0E14">
        <CircularProgress sx={{ color: '#4F9CFF' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0E0E14', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/student/dashboard')}
          sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: '#4F9CFF' } }}
        >
          Go Back to Dashboard
        </Button>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={profile?.avatar_url}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#4F9CFF',
                fontSize: '1.5rem',
                border: '3px solid rgba(79, 156, 255, 0.3)',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/student/profile')}
            >
              {!profile?.avatar_url && (profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <Person />)}
            </Avatar>
            <Box>
              <Typography variant="h6" color="white" fontWeight="bold">
                {profile?.full_name || user?.email?.split('@')[0] || 'Student'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            {pendingRecords.length > 0 && (
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                onClick={handleSaveAll}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(45deg, #00E676, #00C853)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00C853, #00A843)'
                  },
                  position: 'relative'
                }}
              >
                {saving ? 'Saving...' : `Save (${pendingRecords.length})`}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderColor: 'rgba(255, 79, 210, 0.5)',
                color: '#FF4FD2',
                '&:hover': {
                  borderColor: '#FF4FD2',
                  bgcolor: 'rgba(255, 79, 210, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={1}
            sx={{
              background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Academic Records
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Manage your educational background
          </Typography>
        </motion.div>

        {/* Completion Progress */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: 'rgba(30, 30, 37, 0.95)',
            borderRadius: 3,
            border: '1px solid rgba(79, 156, 255, 0.2)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" color="white" fontWeight="bold">
              Profile Completion
            </Typography>
            <Typography variant="h4" color="#4F9CFF" fontWeight="bold">
              {completionPercentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #00E676, #00C853)',
                borderRadius: 5
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            {academicRecords.length} academic record(s) added
          </Typography>
        </Paper>

        {/* Add New Record Form */}
        <Card
          sx={{
            background: 'rgba(30, 30, 37, 0.95)',
            borderRadius: 3,
            border: '1px solid rgba(79, 156, 255, 0.2)',
            mb: 3
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
              Add Academic Record
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Exam Type *</InputLabel>
                  <Select
                    value={newRecord.exam_type}
                    label="Exam Type *"
                    onChange={(e) => setNewRecord({ ...newRecord, exam_type: e.target.value })}
                  >
                    {EXAM_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Board/University"
                  value={newRecord.board}
                  onChange={(e) => setNewRecord({ ...newRecord, board: e.target.value })}
                  placeholder="e.g., Dhaka Board, Cambridge"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Institution *"
                  value={newRecord.institution}
                  onChange={(e) => setNewRecord({ ...newRecord, institution: e.target.value })}
                  placeholder="e.g., Notre Dame College"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="GPA/CGPA *"
                  type="number"
                  inputProps={{ step: 0.01, min: 0, max: 5 }}
                  value={newRecord.gpa}
                  onChange={(e) => setNewRecord({ ...newRecord, gpa: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Passing Year *"
                  type="number"
                  value={newRecord.year}
                  onChange={(e) => setNewRecord({ ...newRecord, year: e.target.value })}
                  placeholder="e.g., 2020"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddItem}
                  sx={{
                    height: '56px',
                    background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #E63FB8, #3D84E5)'
                    }
                  }}
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Pending Records (Not Yet Saved) */}
        {pendingRecords.length > 0 && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold" color="#FFD700">
                Pending Records ({pendingRecords.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click "Save" button above to save these records
              </Typography>
            </Box>
            <Grid container spacing={3} mb={4}>
              {pendingRecords.map((record, index) => (
                <Grid item xs={12} md={6} key={record.tempId}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        borderRadius: 3,
                        border: '2px dashed #FFD700'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <School sx={{ color: '#FFD700', fontSize: 40 }} />
                            <Box>
                              <Typography variant="h6" fontWeight="bold" color="white">
                                {record.exam_type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.year} • Not saved yet
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" gap={1}>
                            <Chip
                              label={`GPA: ${record.gpa}`}
                              size="small"
                              sx={{ bgcolor: 'rgba(255, 215, 0, 0.2)', color: '#FFD700' }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemovePending(record.tempId)}
                              sx={{ color: '#FF4FD2' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: 'rgba(255, 215, 0, 0.05)',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body2" color="white" fontWeight="bold">
                            {record.institution}
                          </Typography>
                          {record.board && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Board: {record.board}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Academic Records List */}
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          Saved Academic Records
        </Typography>

        {academicRecords.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(30, 30, 37, 0.95)',
              borderRadius: 3
            }}
          >
            <School sx={{ fontSize: 64, color: '#4F9CFF', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No academic records yet. Add your first record above!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {academicRecords.map((record, index) => (
              <Grid item xs={12} md={6} key={record.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(30, 30, 37, 0.95)',
                      borderRadius: 3,
                      border: '2px solid rgba(0, 230, 118, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease',
                        borderColor: '#00E676'
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <School sx={{ color: '#4F9CFF', fontSize: 40 }} />
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color="white">
                              {record.exam_type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {record.year}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Chip
                            icon={<CheckCircle />}
                            label={`GPA: ${record.gpa}`}
                            color="success"
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRecord(record.id)}
                            sx={{ color: '#FF4FD2' }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'rgba(79, 156, 255, 0.05)',
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body2" color="white" fontWeight="bold">
                          {record.institution}
                        </Typography>
                        {record.board && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Board: {record.board}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {completionPercentage === 100 && (
          <Alert
            severity="success"
            sx={{
              mt: 4,
              bgcolor: 'rgba(0, 230, 118, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': { color: '#00E676' }
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              🎉 Academic profile completed!
            </Typography>
            <Typography variant="body2">
              You have added both SSC and HSC records (or O/A Level).
            </Typography>
          </Alert>
        )}
      </Container>
    </Box>
  );
}
