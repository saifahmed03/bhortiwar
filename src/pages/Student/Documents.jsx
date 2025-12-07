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
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Cancel,
  Delete,
  Visibility,
  Person,
  Logout,
  Description,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getDocuments, deleteDocument } from "../../services/studentService";
import { getProfile } from "../../services/studentService";
import { supabase } from "../../supabaseClient";

const REQUIRED_DOCUMENTS = [
  { id: 'ssc_certificate', label: 'SSC Certificate', icon: '📜' },
  { id: 'hsc_certificate', label: 'HSC Certificate', icon: '📜' },
  { id: 'national_id', label: 'National ID', icon: '🪪' },
  { id: 'passport_photo', label: 'Passport Photo', icon: '📸' }
];

export default function Documents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [profile, setProfile] = useState(null);

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
      const { data: docs } = await getDocuments(user.id);
      setDocuments(docs || []);

      const { data: profileData } = await getProfile(user.id);
      setProfile(profileData || null);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (docType, file) => {
    if (!file) return;

    setUploading(docType);
    try {
      const fileExt = file.name.split('.').pop();
      const customFileName = `${user.id}/${docType}-${Date.now()}.${fileExt}`;

      console.log('Uploading file:', customFileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(customFileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage error: ${uploadError.message}`);
      }

      console.log('File uploaded to storage, now saving to database...');

      const { data: dbData, error: dbError } = await supabase.from("documents").insert({
        student_id: user.id,
        file_url: customFileName,
        type: file.type,
        document_type: docType
      });

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('Document saved successfully!');
      await loadData();
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Failed to upload document: ${err.message}`);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await supabase.storage.from("documents").remove([doc.file_url]);
      await deleteDocument(doc.id);
      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document");
    }
  };

  const getPublicURL = (filePath) => {
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getDocumentByType = (type) => {
    return documents.find(doc => doc.document_type === type);
  };

  const completionPercentage = Math.round(
    (REQUIRED_DOCUMENTS.filter(doc => getDocumentByType(doc.id)).length / REQUIRED_DOCUMENTS.length) * 100
  );

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
            My Documents
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Upload and manage your application documents
          </Typography>
        </motion.div>

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
              Document Completion
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
            {REQUIRED_DOCUMENTS.filter(doc => getDocumentByType(doc.id)).length} of {REQUIRED_DOCUMENTS.length} required documents uploaded
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {REQUIRED_DOCUMENTS.map((docType, index) => {
            const uploadedDoc = getDocumentByType(docType.id);
            const isUploaded = !!uploadedDoc;

            return (
              <Grid item xs={12} md={6} key={docType.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(30, 30, 37, 0.95)',
                      borderRadius: 3,
                      border: isUploaded
                        ? '2px solid rgba(0, 230, 118, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              fontSize: '2rem',
                              width: 56,
                              height: 56,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: isUploaded ? 'rgba(0, 230, 118, 0.1)' : 'rgba(79, 156, 255, 0.1)',
                              borderRadius: 2
                            }}
                          >
                            {docType.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color="white">
                              {docType.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {isUploaded ? 'Uploaded' : 'Required'}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          icon={isUploaded ? <CheckCircle /> : <Cancel />}
                          label={isUploaded ? 'Complete' : 'Pending'}
                          color={isUploaded ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      {isUploaded ? (
                        <Box>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: 'rgba(0, 230, 118, 0.05)',
                              borderRadius: 2,
                              mb: 2
                            }}
                          >
                            <Typography variant="body2" color="white" noWrap>
                              {uploadedDoc.file_url.split('/').pop()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {uploadedDoc.type}
                            </Typography>
                          </Box>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              href={getPublicURL(uploadedDoc.file_url)}
                              target="_blank"
                              sx={{ color: '#4F9CFF' }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDelete(uploadedDoc)}
                              sx={{ color: '#FF4FD2' }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <input
                            type="file"
                            id={`upload-${docType.id}`}
                            style={{ display: 'none' }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleUpload(docType.id, file);
                            }}
                          />
                          <label htmlFor={`upload-${docType.id}`}>
                            <Button
                              component="span"
                              fullWidth
                              variant="contained"
                              startIcon={uploading === docType.id ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                              disabled={uploading === docType.id}
                              sx={{
                                background: 'linear-gradient(45deg, #00E676, #00C853)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #00C853, #00A843)'
                                }
                              }}
                            >
                              {uploading === docType.id ? 'Uploading...' : 'Upload'}
                            </Button>
                          </label>
                          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                            Accepted: PDF, JPG, PNG
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

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
              🎉 All required documents uploaded!
            </Typography>
            <Typography variant="body2">
              You're ready to submit your applications.
            </Typography>
          </Alert>
        )}
      </Container>
    </Box>
  );
}
