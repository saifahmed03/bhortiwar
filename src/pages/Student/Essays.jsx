import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  getUniversities,
  getAllPrograms
} from "../../services/universityService";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  ArrowBack,
  Description,
  School,
  Save,
  Close,
  ContentCopy
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function Essays() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [essays, setEssays] = useState([]);

  // Names
  const [uniName, setUniName] = useState("");
  const [progName, setProgName] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      // 1) Load application info
      const { data: appData } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      setApplication(appData);

      if (appData) {
        // Fetch names manually since no join
        try {
          const unis = await getUniversities();
          const foundUni = unis?.find(u => u.id === appData.university_id);
          setUniName(foundUni ? foundUni.name : "Unknown University");

          const allProgs = await getAllPrograms();
          const foundProg = allProgs?.find(p => p.id === appData.program_id);
          setProgName(foundProg ? foundProg.name : "Unknown Program");
        } catch (err) {
          console.error("Error fetching names:", err);
        }
      }

      // 2) Load essays
      const { data: essayData } = await supabase
        .from("essays")
        .select("*")
        .eq("application_id", applicationId)
        .order("updated_at", { ascending: false });

      setEssays(essayData || []);
    } catch (err) {
      console.error("Error loading essays:", err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openForm = (essay = null) => {
    if (essay) {
      setEditId(essay.id);
      setForm({
        title: essay.essay_prompt || "",
        content: essay.content || "",
      });
    } else {
      setEditId(null);
      setForm({ title: "", content: "" });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let error;
      if (editId) {
        const { error: updateError } = await supabase.from("essays").update({
          essay_prompt: form.title,
          content: form.content,
          updated_at: new Date()
        }).eq("id", editId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("essays").insert({
          application_id: applicationId,
          essay_prompt: form.title,
          content: form.content,
          updated_at: new Date()
        });
        error = insertError;
      }

      if (error) throw error;

      setFormOpen(false);
      loadData();
    } catch (err) {
      console.error("Error saving essay:", err);
      alert("Failed to save essay: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteEssay = async (id) => {
    if (!window.confirm("Are you sure you want to delete this essay?")) return;
    try {
      await supabase.from("essays").delete().eq("id", id);
      loadData();
    } catch (err) {
      console.error("Error deleting essay:", err);
    }
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

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
        {/* Header */}
        <Box mb={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/student/dashboard')}
            sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
          >
            Go Back to Dashboard
          </Button>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/student/applications')}
            sx={{ color: 'text.secondary', mb: 2 }}
          >
            Back to Applications
          </Button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <School sx={{ fontSize: 40, color: '#4F9CFF' }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" color="white">
                  {uniName}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {progName}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Actions Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5" fontWeight="bold" color="white">
            Required Essays
          </Typography>
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
            Write New Essay
          </Button>
        </Box>

        {/* Essays List */}
        {essays.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(30, 30, 37, 0.95)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Description sx={{ fontSize: 64, color: '#4F9CFF', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No essays written yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start writing your personal statement or supplemental essays.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {essays.map((essay, index) => (
                <Grid item xs={12} key={essay.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(30, 30, 37, 0.95)',
                        borderRadius: 3,
                        border: '1px solid rgba(79, 156, 255, 0.2)',
                        transition: '0.3s',
                        '&:hover': {
                          borderColor: '#4F9CFF',
                          boxShadow: '0 4px 20px rgba(79, 156, 255, 0.1)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="bold" color="white">
                            {essay.essay_prompt || 'Untitled Essay'}
                          </Typography>
                          <Chip
                            label={`${getWordCount(essay.content || '')} words`}
                            size="small"
                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                          />
                        </Box>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            maxHeight: '150px',
                            overflow: 'hidden',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: '40px',
                              background: 'linear-gradient(to top, rgba(30, 30, 37, 0.95), transparent)'
                            }
                          }}
                        >
                          {essay.content}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          startIcon={<ContentCopy />}
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(essay.content || '');
                            alert("Copied to clipboard!");
                          }}
                          sx={{ color: '#4F9CFF' }}
                        >
                          Copy
                        </Button>
                        <Button
                          startIcon={<Edit />}
                          size="small"
                          onClick={() => openForm(essay)}
                          sx={{ color: '#FFD700' }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<Delete />}
                          size="small"
                          onClick={() => deleteEssay(essay.id)}
                          sx={{ color: '#FF4FD2' }}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}

        {/* Edit/Create Dialog */}
        <Dialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#1E1E24',
              color: 'white',
              borderRadius: 3,
              minHeight: '60vh'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                {editId ? 'Edit Essay' : 'New Essay'}
              </Typography>
              <IconButton onClick={() => setFormOpen(false)} sx={{ color: 'text.secondary' }}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, py: 3 }}>
              <TextField
                label="Essay Prompt / Title"
                placeholder="e.g., Personal Statement, Why This Major?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#4F9CFF' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary' }
                }}
              />
              <Box flex={1} position="relative" display="flex" flexDirection="column">
                <TextField
                  label="Content"
                  placeholder="Type your essay here..."
                  multiline
                  rows={15}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  fullWidth
                  required
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      alignItems: 'flex-start',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#4F9CFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'text.secondary' }
                  }}
                />
                <Box position="absolute" bottom={10} right={10}>
                  <Chip
                    label={`${getWordCount(form.content)} words`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
              <Button onClick={() => setFormOpen(false)} sx={{ color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  background: 'linear-gradient(45deg, #4F9CFF, #00E676)',
                  fontWeight: 'bold'
                }}
              >
                {saving ? 'Saving...' : 'Save Essay'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}
