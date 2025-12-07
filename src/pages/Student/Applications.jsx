import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from "../../services/studentService";
import {
  getUniversities,
  getProgramsByUniversity,
  getAllPrograms
} from "../../services/universityService";
import Loading from "../../components/Loading";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormHelperText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  School,
  Description,
  Close,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Applications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [programsLookup, setProgramsLookup] = useState({}); // Lookup map for programs
  const [programs, setPrograms] = useState([]); // For dropdown in form

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    university_id: "",
    program_id: "",
    status: "Draft",
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: apps, error } = await getApplications(user.id);
      if (error) throw error;
      setApplications(apps || []);

      // Load universities
      const unis = await getUniversities();
      setUniversities(unis || []);

      // Load ALL programs to resolve names
      const allProgs = await getAllPrograms();
      // Create lookup map: id -> name
      const lookup = {};
      if (allProgs) {
        allProgs.forEach(p => {
          lookup[p.id] = p.name;
        });
      }
      setProgramsLookup(lookup);

    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // When university changes in form, load programs
  const handleUniversityChange = async (uniId) => {
    setForm(prev => ({ ...prev, university_id: uniId, program_id: "" }));
    if (uniId) {
      const progs = await getProgramsByUniversity(uniId);
      setPrograms(progs || []);
    } else {
      setPrograms([]);
    }
  };

  const openForm = async (app = null) => {
    if (app) {
      setEditId(app.id);
      // Pre-load programs if we are editing
      if (app.university_id) {
        const progs = await getProgramsByUniversity(app.university_id);
        setPrograms(progs || []);
      }
      setForm({
        university_id: app.university_id,
        program_id: app.program_id,
        status: app.status,
      });
    } else {
      setEditId(null);
      setPrograms([]);
      setForm({
        university_id: "",
        program_id: "",
        status: "Draft",
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student_id: user.id,
        university_id: form.university_id,
        program_id: form.program_id,
        status: form.status,
      };

      if (editId) {
        await updateApplication(editId, payload);
      } else {
        await createApplication(payload);
      }

      setFormOpen(false);
      loadData(); // Reload list
    } catch (err) {
      console.error("Error saving application:", err);
      alert("Failed to save application");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteApplication(id);
    loadData();
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'default',
      Submitted: 'info',
      'In Review': 'warning',
      Accepted: 'success',
      Rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getUniversityName = (uniId) => {
    const uni = universities.find(u => u.id === uniId);
    return uni ? uni.name : "Unknown University";
  };

  const getProgramName = (progId) => {
    return programsLookup[progId] || "Unknown Program";
  };

  if (loading) return <Loading />;

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              My Applications
            </Typography>
          </motion.div>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openForm()}
            sx={{
              background: 'linear-gradient(45deg, #00E676, #00C853)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00C853, #00A843)'
              }
            }}
          >
            New Application
          </Button>
        </Box>

        {applications.length === 0 ? (
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
              No applications yet. Start your journey today!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {applications.map((app, index) => (
              <Grid item xs={12} md={6} lg={4} key={app.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(30, 30, 37, 0.95)',
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <School sx={{ color: '#4F9CFF', fontSize: 32 }} />
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>
                        {getUniversityName(app.university_id)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {getProgramName(app.program_id)}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Description />}
                        href={`/student/essays/${app.id}`}
                        sx={{ color: '#00E676' }}
                      >
                        Essays
                      </Button>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => openForm(app)}
                          sx={{ color: '#4F9CFF' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(app.id)}
                          sx={{ color: '#FF4FD2' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(30, 30, 37, 0.98)',
              borderRadius: 3
            }
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                {editId ? 'Edit Application' : 'New Application'}
              </Typography>
              <IconButton onClick={() => setFormOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent>
              {/* University Dropdown */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>University</InputLabel>
                <Select
                  value={form.university_id}
                  label="University"
                  onChange={(e) => handleUniversityChange(e.target.value)}
                >
                  {universities.map((uni) => (
                    <MenuItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </MenuItem>
                  ))}
                </Select>
                {universities.length === 0 && (
                  <FormHelperText>No universities found. Please contact admin.</FormHelperText>
                )}
              </FormControl>

              {/* Program Dropdown */}
              <FormControl fullWidth margin="normal" required disabled={!form.university_id}>
                <InputLabel>Program</InputLabel>
                <Select
                  value={form.program_id}
                  label="Program"
                  onChange={(e) => setForm({ ...form, program_id: e.target.value })}
                >
                  {programs.map((prog) => (
                    <MenuItem key={prog.id} value={prog.id}>
                      {prog.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  label="Status"
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Submitted">Submitted</MenuItem>
                  <MenuItem value="In Review">In Review</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #E63FB8, #3D84E5)'
                  }
                }}
              >
                {editId ? 'Save Changes' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}
