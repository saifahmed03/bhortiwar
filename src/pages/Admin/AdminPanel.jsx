import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllStudents, deleteStudent,
  getAllUniversities, addUniversity, updateUniversity, deleteUniversity,
  getAllPrograms, addProgram, updateProgram, deleteProgram,
  getAllApplications, updateApplicationStatus
} from "../../services/adminService";
import Loading from "../../components/Loading";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import {
  People,
  School,
  MenuBook,
  Assignment,
  Edit,
  Delete,
  Add,
  Close,
  Email
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, count, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
        borderTop: `3px solid ${color}`,
        height: '100%'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color }}>
              {count}
            </Typography>
          </Box>
          <Box
            sx={{
              background: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex'
            }}
          >
            <Icon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (isAuth !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState("");

  const [form, setForm] = useState({});

  const loadData = async () => {
    setLoading(true);

    const { data: studentsData } = await getAllStudents();
    const { data: universitiesData } = await getAllUniversities();
    const { data: programsData } = await getAllPrograms();
    const { data: applicationsData } = await getAllApplications();

    setStudents(studentsData || []);
    setUniversities(universitiesData || []);
    setPrograms(programsData || []);
    setApplications(applicationsData || []);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;

    switch (type) {
      case "student": await deleteStudent(id); break;
      case "university": await deleteUniversity(id); break;
      case "program": await deleteProgram(id); break;
      default: return;
    }
    loadData();
  };

  const handleEdit = (type, item) => {
    setEditType(type);
    setEditItem(item);
    setForm({ ...item });
  };

  const handleAdd = (type) => {
    setEditType(`add-${type}`);
    setEditItem(null);
    if (type === "university") {
      setForm({ name: "", country: "" });
    } else if (type === "program") {
      setForm({ name: "", university_id: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editType.startsWith("add-")) {
      const addType = editType.replace("add-", "");
      switch (addType) {
        case "university": await addUniversity(form); break;
        case "program": await addProgram(form); break;
        default: break;
      }
    } else {
      switch (editType) {
        case "university": await updateUniversity(editItem.id, form); break;
        case "program": await updateProgram(editItem.id, form); break;
        default: break;
      }
    }

    setEditItem(null);
    setEditType("");
    setForm({});
    loadData();
  };

  // Email State
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });

  const handleApplicationStatusChange = async (app, status) => {
    console.log("Updating status to:", status, "for app:", app.id);
    await updateApplicationStatus(app.id, status);

    // Email Notification Logic
    if (status === 'Accepted') {
      const student = students.find(s => s.id === app.student_id);
      console.log("Found student:", student);

      const uni = universities.find(u => u.id === app.university_id);
      const prog = programs.find(p => p.id === app.program_id);

      if (student?.email) {
        console.log("Auto-Sending email to:", student.email);
        const subject = `Congratulations! Admission Accepted to ${uni?.name || 'University'}`;
        const body = `Dear ${student.full_name || 'Student'},\n\nWe are pleased to inform you that your application for ${prog?.name || 'the program'} at ${uni?.name || 'the university'} has been ACCEPTED!\n\nPlease log in to your dashboard to view the details.\n\nBest regards,\nBhortiJuddho Admin Team`;

        // Auto-open email preview or mailto
        // We will open the previews dialog instead of direct mailto for better UX
        setEmailData({
          to: student.email,
          subject: subject,
          body: body
        });
        setEmailOpen(true);

      } else {
        console.warn("No email found for student:", student?.id);
        alert(`Student email not found. Please ensure the student's profile has an email address.\nStudent ID: ${app.student_id}`);
      }
    }

    loadData();
  };

  const handleSendEmail = (app) => {
    const student = students.find(s => s.id === app.student_id);
    const uni = universities.find(u => u.id === app.university_id);
    const prog = programs.find(p => p.id === app.program_id);

    if (student?.email) {
      console.log("Manually Sending email to:", student.email);
      const subject = `Update regarding your application to ${uni?.name || 'University'}`;
      const body = `Dear ${student.full_name || 'Student'},\n\nThis is an update regarding your application for ${prog?.name || 'the program'}.\n\nBest regards,\nBhortiJuddho Admin Team`;

      setEmailData({
        to: student.email,
        subject: subject,
        body: body
      });
      setEmailOpen(true);
    } else {
      alert("Student email not found.");
    }
  };

  const handleLaunchMailClient = () => {
    window.location.href = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
  };

  const handleCopyEmail = () => {
    const text = `To: ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`;
    navigator.clipboard.writeText(text);
    alert("Email content copied to clipboard!");
  };

  if (loading) return <Loading />;

  return (
    <Box sx={{ bgcolor: '#0E0E14', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={4}
            sx={{
              background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Admin Dashboard
          </Typography>
        </motion.div>

        {/* Analytics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Students" count={students.length} icon={People} color="#4F9CFF" delay={0.1} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Universities" count={universities.length} icon={School} color="#FF4FD2" delay={0.2} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Programs" count={programs.length} icon={MenuBook} color="#00E676" delay={0.3} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard title="Applications" count={applications.length} icon={Assignment} color="#FFD700" delay={0.4} />
          </Grid>
        </Grid>

        {/* Students Table */}
        <Paper sx={{ mb: 4, background: 'rgba(30, 30, 37, 0.95)', borderRadius: 3, overflow: 'hidden' }}>
          <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#4F9CFF' }}>
              Students
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(79, 156, 255, 0.1)' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Country</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(s => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.full_name}</TableCell>
                    <TableCell>{s.email || <span style={{ color: 'red' }}>Missing</span>}</TableCell>
                    <TableCell>{s.country}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete("student", s.id)}
                        sx={{ color: '#FF4FD2' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Universities Table */}
        <Paper sx={{ mb: 4, background: 'rgba(30, 30, 37, 0.95)', borderRadius: 3, overflow: 'hidden' }}>
          <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#FF4FD2' }}>
              Universities
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAdd("university")}
              sx={{
                background: 'linear-gradient(45deg, #00E676, #00C853)',
                '&:hover': { background: 'linear-gradient(45deg, #00C853, #00A843)' }
              }}
            >
              Add University
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255, 79, 210, 0.1)' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Country</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {universities.map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("university", u)}
                        sx={{ color: '#4F9CFF' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete("university", u.id)}
                        sx={{ color: '#FF4FD2' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Programs Table */}
        <Paper sx={{ mb: 4, background: 'rgba(30, 30, 37, 0.95)', borderRadius: 3, overflow: 'hidden' }}>
          <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#00E676' }}>
              Programs
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAdd("program")}
              sx={{
                background: 'linear-gradient(45deg, #00E676, #00C853)',
                '&:hover': { background: 'linear-gradient(45deg, #00C853, #00A843)' }
              }}
            >
              Add Program
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0, 230, 118, 0.1)' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>University ID</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.university_id}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("program", p)}
                        sx={{ color: '#4F9CFF' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete("program", p.id)}
                        sx={{ color: '#FF4FD2' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Applications Table */}
        <Paper sx={{ mb: 4, background: 'rgba(30, 30, 37, 0.95)', borderRadius: 3, overflow: 'hidden' }}>
          <Box p={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFD700' }}>
              Applications
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255, 215, 0, 0.1)' }}>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>University</strong></TableCell>
                  <TableCell><strong>Program</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map(app => {
                  const student = students.find(s => s.id === app.student_id);
                  const uni = universities.find(u => u.id === app.university_id);
                  const prog = programs.find(p => p.id === app.program_id);

                  return (
                    <TableRow key={app.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {student?.full_name || "Unknown Student"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student?.email || "No Email"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{uni?.name || "Unknown University"}</TableCell>
                      <TableCell>{prog?.name || "Unknown Program"}</TableCell>
                      <TableCell>
                        <Select
                          value={app.status || 'Draft'}
                          onChange={(e) => handleApplicationStatusChange(app, e.target.value)}
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="Draft">Draft</MenuItem>
                          <MenuItem value="Submitted">Submitted</MenuItem>
                          <MenuItem value="In Review">In Review</MenuItem>
                          <MenuItem value="Accepted">Accepted</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        {app.status === 'Accepted' && (
                          <IconButton
                            size="small"
                            onClick={() => handleSendEmail(app)}
                            sx={{ color: '#4F9CFF', mr: 1 }}
                            title="Send Email"
                          >
                            <Email />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDelete("application", app.id)}
                          sx={{ color: '#FF4FD2' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Edit/Add Dialog */}
        <Dialog
          open={Boolean(editItem) || editType.startsWith("add-")}
          onClose={() => {
            setEditItem(null);
            setEditType("");
            setForm({});
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { background: 'rgba(30, 30, 37, 0.98)', borderRadius: 3 }
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                {editType.startsWith("add-")
                  ? `Add ${editType.replace("add-", "")}`
                  : `Edit ${editType}`}
              </Typography>
              <IconButton
                onClick={() => {
                  setEditItem(null);
                  setEditType("");
                  setForm({});
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent>
              {Object.keys(form).map((key) => (
                <TextField
                  key={key}
                  fullWidth
                  label={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  margin="normal"
                />
              ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => {
                  setEditItem(null);
                  setEditType("");
                  setForm({});
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                  '&:hover': { background: 'linear-gradient(45deg, #E63FB8, #3D84E5)' }
                }}
              >
                {editType.startsWith("add-") ? "Add" : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* EMAIL PREVIEW DIALOG */}
        <Dialog
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { background: '#1A1A24', borderRadius: 3, border: '1px solid rgba(79, 156, 255, 0.2)' }
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Email sx={{ color: '#4F9CFF' }} />
              <Typography variant="h6" fontWeight="bold" color="white">
                Send Content
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">To</Typography>
              <Paper sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.3)', color: 'white' }}>{emailData.to}</Paper>
            </Box>
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary">Subject</Typography>
              <Paper sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.3)', color: 'white' }}>{emailData.subject}</Paper>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Message</Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', color: 'white', minHeight: 150, whiteSpace: 'pre-wrap' }}>{emailData.body}</Paper>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEmailOpen(false)}>Close</Button>
            <Button variant="outlined" onClick={handleCopyEmail}>
              Copy to Clipboard
            </Button>
            <Button variant="contained" onClick={handleLaunchMailClient} sx={{ background: 'linear-gradient(45deg, #4F9CFF, #FF4FD2)' }}>
              Launch Mail App
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
}

