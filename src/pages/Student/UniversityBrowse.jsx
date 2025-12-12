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
    CardActions,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    IconButton,
    Divider,
    Avatar,
    CircularProgress
} from '@mui/material';
import {
    School,
    CheckCircle,
    Cancel,
    CalendarToday,
    AttachMoney,
    Schedule,
    Logout,
    Person,
    Close,
    ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getUniversities, getProgramsByUniversity } from "../../services/universityService";
import { getProfile, updateProfile } from "../../services/studentService";
import { createApplication } from "../../services/studentService";

export default function UniversityBrowse() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [universities, setUniversities] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [profile, setProfile] = useState(null);

    // Eligibility checker dialog
    const [checkerOpen, setCheckerOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [credentials, setCredentials] = useState({
        education_system: 'BD',
        ssc_gpa: '',
        hsc_gpa: '',
        o_level_points: '',
        a_level_points: ''
    });
    const [eligibilityResult, setEligibilityResult] = useState(null);
    const [admissionDate, setAdmissionDate] = useState('');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

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
            // Load universities
            const unis = await getUniversities();
            setUniversities(unis || []);

            // Load all programs from all universities
            const allPrograms = [];
            for (const uni of unis || []) {
                const progs = await getProgramsByUniversity(uni.id);
                const progsWithUni = (progs || []).map(p => ({
                    ...p,
                    university: uni
                }));
                allPrograms.push(...progsWithUni);
            }
            setPrograms(allPrograms);

            // Load user profile
            const { data: profileData } = await getProfile(user.id);
            setProfile(profileData || null);

            // Pre-fill credentials if available
            if (profileData) {
                setCredentials({
                    education_system: profileData.education_system || 'BD',
                    ssc_gpa: profileData.ssc_gpa || '',
                    hsc_gpa: profileData.hsc_gpa || '',
                    o_level_points: profileData.o_level_points || '',
                    a_level_points: profileData.a_level_points || ''
                });
            }
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            setLoading(false);
        }
    };

    const openEligibilityChecker = (program) => {
        setSelectedProgram(program);
        setEligibilityResult(null);
        setAdmissionDate('');
        setCheckerOpen(true);
    };

    const checkEligibility = () => {
        if (!selectedProgram) return;

        const prog = selectedProgram;
        let isEligible = false;

        if (credentials.education_system === 'BD') {
            const sscGpa = parseFloat(credentials.ssc_gpa) || 0;
            const hscGpa = parseFloat(credentials.hsc_gpa) || 0;

            isEligible = (
                sscGpa >= (prog.min_ssc_gpa || 0) &&
                hscGpa >= (prog.min_hsc_gpa || 0)
            );

            setEligibilityResult({
                eligible: isEligible,
                system: 'BD',
                studentGPA: { ssc: sscGpa, hsc: hscGpa },
                requiredGPA: { ssc: prog.min_ssc_gpa, hsc: prog.min_hsc_gpa }
            });
        } else {
            const oLevel = parseInt(credentials.o_level_points) || 0;
            const aLevel = parseInt(credentials.a_level_points) || 0;

            isEligible = (
                oLevel >= (prog.min_o_level_points || 0) &&
                aLevel >= (prog.min_a_level_points || 0)
            );

            setEligibilityResult({
                eligible: isEligible,
                system: 'Cambridge',
                studentPoints: { oLevel, aLevel },
                requiredPoints: { oLevel: prog.min_o_level_points, aLevel: prog.min_a_level_points }
            });
        }
    };

    const handleApply = async () => {
        if (!selectedProgram || !admissionDate) {
            alert("Please select an admission date");
            return;
        }

        try {
            // Save credentials to profile
            await updateProfile(user.id, {
                education_system: credentials.education_system,
                ssc_gpa: credentials.education_system === 'BD' ? parseFloat(credentials.ssc_gpa) : null,
                hsc_gpa: credentials.education_system === 'BD' ? parseFloat(credentials.hsc_gpa) : null,
                o_level_points: credentials.education_system === 'Cambridge' ? parseInt(credentials.o_level_points) : null,
                a_level_points: credentials.education_system === 'Cambridge' ? parseInt(credentials.a_level_points) : null
            });

            // Create application
            await createApplication({
                student_id: user.id,
                university_id: selectedProgram.university.id,
                program_id: selectedProgram.id,
                status: 'Draft',
                is_eligible: true,
                admission_date: admissionDate,
                eligibility_checked_at: new Date().toISOString()
            });

            alert("Application submitted successfully!");
            setCheckerOpen(false);
            navigate('/student/applications');
        } catch (err) {
            console.error("Error submitting application:", err);
            alert("Failed to submit application");
        }
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
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/student/dashboard')}
                    sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: '#4F9CFF' } }}
                >
                    Go Back to Dashboard
                </Button>

                {/* Header with Avatar and Logout */}
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
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/student/applications')}
                            sx={{
                                borderColor: '#4F9CFF',
                                color: '#4F9CFF',
                                '&:hover': {
                                    borderColor: '#4F9CFF',
                                    bgcolor: 'rgba(79, 156, 255, 0.1)'
                                }
                            }}
                        >
                            My Applications
                        </Button>
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
                        Discover Universities
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mb={4}>
                        Browse programs and check your eligibility
                    </Typography>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Box mb={4}>
                        <TextField
                            fullWidth
                            placeholder="Search universities or programs (e.g., BUET, CSE, Engineering)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(30, 30, 37, 0.95)',
                                    borderRadius: 3,
                                    border: '2px solid rgba(79, 156, 255, 0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(79, 156, 255, 0.4)',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: '#4F9CFF',
                                        boxShadow: '0 0 20px rgba(79, 156, 255, 0.3)',
                                    },
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'white',
                                    fontSize: '1rem',
                                    padding: '16px 20px',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                        {searchQuery && (
                            <Box mt={1} display="flex" alignItems="center" gap={1}>
                                <Typography variant="caption" color="text.secondary">
                                    Showing results for: <span style={{ color: '#4F9CFF', fontWeight: 'bold' }}>"{searchQuery}"</span>
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={() => setSearchQuery('')}
                                    sx={{
                                        minWidth: 'auto',
                                        padding: '2px 8px',
                                        color: '#FF4FD2',
                                        fontSize: '0.7rem',
                                        '&:hover': { bgcolor: 'rgba(255, 79, 210, 0.1)' }
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        )}
                    </Box>
                </motion.div>

                {/* University Programs Grid */}
                {programs.length === 0 ? (
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
                            No programs available. Please contact admin.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {programs
                            .filter(program => {
                                if (!searchQuery.trim()) return true;

                                const query = searchQuery.toLowerCase();
                                const programName = (program.name || '').toLowerCase();
                                const universityName = (program.university?.name || '').toLowerCase();
                                const duration = (program.duration || '').toLowerCase();
                                const intakeTerm = (program.intake_term || '').toLowerCase();

                                return (
                                    programName.includes(query) ||
                                    universityName.includes(query) ||
                                    duration.includes(query) ||
                                    intakeTerm.includes(query)
                                );
                            })
                            .map((program, index) => (
                                <Grid item xs={12} md={6} lg={4} key={program.id}>
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
                                                border: '1px solid rgba(79, 156, 255, 0.2)',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    transition: 'transform 0.3s ease',
                                                    borderColor: '#4F9CFF'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box display="flex" alignItems="center" mb={2}>
                                                    <School sx={{ color: '#4F9CFF', fontSize: 40, mr: 2 }} />
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold" color="white">
                                                            {program.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {program.university?.name}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                                                {/* Requirements */}
                                                <Box mb={2}>
                                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                        Requirements (BD System):
                                                    </Typography>
                                                    <Box display="flex" gap={1} flexWrap="wrap">
                                                        <Chip
                                                            label={`SSC: ${program.min_ssc_gpa || 'N/A'}`}
                                                            size="small"
                                                            sx={{ bgcolor: 'rgba(79, 156, 255, 0.2)', color: 'white' }}
                                                        />
                                                        <Chip
                                                            label={`HSC: ${program.min_hsc_gpa || 'N/A'}`}
                                                            size="small"
                                                            sx={{ bgcolor: 'rgba(79, 156, 255, 0.2)', color: 'white' }}
                                                        />
                                                    </Box>
                                                </Box>

                                                {/* Program Details */}
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    {program.duration && (
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {program.duration}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {program.tuition_fee && (
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {program.tuition_fee}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    {program.intake_term && (
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {program.intake_term}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, pt: 0 }}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={() => openEligibilityChecker(program)}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #00E676, #00C853)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #00C853, #00A843)'
                                                        }
                                                    }}
                                                >
                                                    Check Eligibility
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}

                        {/* No Results Message */}
                        {programs.filter(program => {
                            if (!searchQuery.trim()) return true;
                            const query = searchQuery.toLowerCase();
                            const programName = (program.name || '').toLowerCase();
                            const universityName = (program.university?.name || '').toLowerCase();
                            const duration = (program.duration || '').toLowerCase();
                            const intakeTerm = (program.intake_term || '').toLowerCase();
                            return (
                                programName.includes(query) ||
                                universityName.includes(query) ||
                                duration.includes(query) ||
                                intakeTerm.includes(query)
                            );
                        }).length === 0 && searchQuery.trim() && (
                                <Grid item xs={12}>
                                    <Paper
                                        sx={{
                                            p: 6,
                                            textAlign: 'center',
                                            background: 'rgba(30, 30, 37, 0.95)',
                                            borderRadius: 3,
                                            border: '1px solid rgba(255, 79, 210, 0.2)'
                                        }}
                                    >
                                        <School sx={{ fontSize: 64, color: '#FF4FD2', mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" color="white" mb={1}>
                                            No results found for "{searchQuery}"
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={3}>
                                            Try searching with different keywords like university names (BUET, DU) or programs (CSE, Engineering)
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setSearchQuery('')}
                                            sx={{
                                                borderColor: '#4F9CFF',
                                                color: '#4F9CFF',
                                                '&:hover': {
                                                    borderColor: '#4F9CFF',
                                                    bgcolor: 'rgba(79, 156, 255, 0.1)'
                                                }
                                            }}
                                        >
                                            Clear Search
                                        </Button>
                                    </Paper>
                                </Grid>
                            )}
                    </Grid>
                )}

                {/* Eligibility Checker Dialog */}
                <Dialog
                    open={checkerOpen}
                    onClose={() => setCheckerOpen(false)}
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
                                Check Eligibility
                            </Typography>
                            <IconButton onClick={() => setCheckerOpen(false)}>
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        {selectedProgram && (
                            <>
                                <Box mb={3} p={2} bgcolor="rgba(79, 156, 255, 0.1)" borderRadius={2}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="white">
                                        {selectedProgram.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedProgram.university?.name}
                                    </Typography>
                                </Box>

                                {!eligibilityResult ? (
                                    <>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Education System</InputLabel>
                                            <Select
                                                value={credentials.education_system}
                                                label="Education System"
                                                onChange={(e) => setCredentials({ ...credentials, education_system: e.target.value })}
                                            >
                                                <MenuItem value="BD">Bangladesh (SSC/HSC)</MenuItem>
                                                <MenuItem value="Cambridge">Cambridge (O/A Level)</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {credentials.education_system === 'BD' ? (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    label="SSC GPA"
                                                    type="number"
                                                    inputProps={{ step: 0.01, min: 0, max: 5 }}
                                                    value={credentials.ssc_gpa}
                                                    onChange={(e) => setCredentials({ ...credentials, ssc_gpa: e.target.value })}
                                                />
                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    label="HSC GPA"
                                                    type="number"
                                                    inputProps={{ step: 0.01, min: 0, max: 5 }}
                                                    value={credentials.hsc_gpa}
                                                    onChange={(e) => setCredentials({ ...credentials, hsc_gpa: e.target.value })}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    label="O Level Points"
                                                    type="number"
                                                    value={credentials.o_level_points}
                                                    onChange={(e) => setCredentials({ ...credentials, o_level_points: e.target.value })}
                                                />
                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    label="A Level Points"
                                                    type="number"
                                                    value={credentials.a_level_points}
                                                    onChange={(e) => setCredentials({ ...credentials, a_level_points: e.target.value })}
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Box>
                                        {eligibilityResult.eligible ? (
                                            <Alert
                                                severity="success"
                                                icon={<CheckCircle />}
                                                sx={{ mb: 3 }}
                                            >
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    🎉 Congratulations! You are eligible!
                                                </Typography>
                                                <Typography variant="body2">
                                                    You meet the requirements for {selectedProgram.name}
                                                </Typography>
                                            </Alert>
                                        ) : (
                                            <Alert
                                                severity="error"
                                                icon={<Cancel />}
                                                sx={{ mb: 3 }}
                                            >
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    😔 Sorry, You are not eligible
                                                </Typography>
                                                {eligibilityResult.system === 'BD' ? (
                                                    <Box mt={1}>
                                                        <Typography variant="body2">
                                                            Required: SSC {eligibilityResult.requiredGPA.ssc}, HSC {eligibilityResult.requiredGPA.hsc}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Your GPA: SSC {eligibilityResult.studentGPA.ssc}, HSC {eligibilityResult.studentGPA.hsc}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box mt={1}>
                                                        <Typography variant="body2">
                                                            Required: O Level {eligibilityResult.requiredPoints.oLevel}, A Level {eligibilityResult.requiredPoints.aLevel}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Your Points: O Level {eligibilityResult.studentPoints.oLevel}, A Level {eligibilityResult.studentPoints.aLevel}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Alert>
                                        )}

                                        {eligibilityResult.eligible && (
                                            <Box>
                                                <Typography variant="subtitle2" color="white" mb={2}>
                                                    Next Steps:
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    margin="normal"
                                                    label="Select Admission Date"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={admissionDate}
                                                    onChange={(e) => setAdmissionDate(e.target.value)}
                                                />
                                                <Box mt={2}>
                                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                        Required Documents:
                                                    </Typography>
                                                    <Box display="flex" flexDirection="column" gap={0.5}>
                                                        <Typography variant="caption" color="text.secondary">☐ SSC Certificate</Typography>
                                                        <Typography variant="caption" color="text.secondary">☐ HSC Certificate</Typography>
                                                        <Typography variant="caption" color="text.secondary">☐ National ID</Typography>
                                                        <Typography variant="caption" color="text.secondary">☐ Passport Photo</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        {!eligibilityResult ? (
                            <>
                                <Button onClick={() => setCheckerOpen(false)}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    onClick={checkEligibility}
                                    sx={{
                                        background: 'linear-gradient(45deg, #FF4FD2, #4F9CFF)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #E63FB8, #3D84E5)'
                                        }
                                    }}
                                >
                                    Check
                                </Button>
                            </>
                        ) : eligibilityResult.eligible ? (
                            <>
                                <Button onClick={() => setEligibilityResult(null)}>Back</Button>
                                <Button
                                    variant="contained"
                                    onClick={handleApply}
                                    disabled={!admissionDate}
                                    sx={{
                                        background: 'linear-gradient(45deg, #00E676, #00C853)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #00C853, #00A843)'
                                        }
                                    }}
                                >
                                    Proceed to Apply
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setCheckerOpen(false)}>Close</Button>
                                <Button onClick={() => setEligibilityResult(null)}>
                                    Try Again
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

