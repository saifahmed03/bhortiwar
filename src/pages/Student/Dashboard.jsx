import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    getApplications,
    getDocuments,
    getAcademicRecords,
    getProfile
} from "../../services/studentService";
import { getUniversities, getAllPrograms } from "../../services/universityService";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    Badge,
    ListItemIcon,
    ListItemText,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    List,
    ListItem,
    ListItemSecondaryAction
} from '@mui/material';

import {
    Description,
    School,
    Assignment,
    TrendingUp,
    Person,
    Upload,
    ArrowForward,
    MenuBook,
    CheckCircle,
    Logout,
    PictureAsPdf,
    Notifications,
    Info,
    Celebration,
    Timer,
    Edit,
    HourglassEmpty,
    Delete,
    Add,
    Event,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { generateStudentSummaryPDF } from '../../utils/pdfGenerator';
import AICounselor from '../../components/AICounselor/AICounselor';


// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const StatCard = ({ title, count, icon: Icon, color, onClick }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }}>
        <Paper
            onClick={onClick}
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${color}15 0%, rgba(20,20,25,0.8) 100%)`,
                border: `1px solid ${color}30`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    background: `linear-gradient(135deg, ${color}30 0%, rgba(20,20,25,0.6) 100%)`,
                    border: `1px solid ${color}80`,
                    boxShadow: `0 0 30px ${color}30`
                }
            }}
        >
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.15, transform: 'rotate(15deg)' }}>
                <Icon sx={{ fontSize: 120, color: color }} />
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                        display: 'flex',
                        color: 'white',
                        boxShadow: `0 4px 12px ${color}30`
                    }}
                >
                    <Icon />
                </Box>
                <Typography variant="subtitle1" color="rgba(255,255,255,0.8)" fontWeight="medium">
                    {title}
                </Typography>
            </Box>

            <Typography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 1, textShadow: `0 0 20px ${color}40` }}>
                {count}
            </Typography>

            <Typography variant="caption" sx={{ color: color, display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
                View Details <ArrowForward sx={{ fontSize: 14 }} />
            </Typography>
        </Paper>
    </motion.div>
);

const QuickActionItem = ({ title, icon: Icon, color, onClick }) => (
    <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, ${color}15 100%)`,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 20,
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            color: 'white',
            outline: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'background 0.3s, border-color 0.3s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, ${color}40 100%)`;
            e.currentTarget.style.borderColor = color;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, ${color}15 100%)`;
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
    >
        <Box
            sx={{
                p: 2,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
                mb: 2,
                color: 'white',
                boxShadow: `0 8px 16px ${color}20`,
                border: `1px solid ${color}40`
            }}
        >
            <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="body2" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {title}
        </Typography>
    </motion.button>
);

const CountdownCompact = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const isEmpty = !targetDate || Object.keys(timeLeft).length === 0;

    if (isEmpty) return <Typography variant="caption" fontWeight="bold" color="text.secondary">NO DATE SET</Typography>;

    return (
        <Box display="flex" gap={1.5} alignItems="center">
            {[
                { label: 'D', value: timeLeft.days },
                { label: 'H', value: timeLeft.hours },
                { label: 'M', value: timeLeft.minutes },
                { label: 'S', value: timeLeft.seconds },
            ].map((item, i) => (
                <Box key={i} textAlign="center">
                    <Typography variant="h4" fontWeight="900" sx={{ color: '#fff', lineHeight: 1, textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
                        {String(item.value || 0).padStart(2, '0')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

const ChecklistCompact = ({ items }) => {
    const pending = items.filter(i => !i.completed).slice(0, 3);

    if (items.length === 0) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                <Typography variant="body2">No active missions.</Typography>
                <Typography variant="caption">Click to add tasks.</Typography>
            </Box>
        );
    }

    return (
        <Box width="100%">
            {pending.map(item => (
                <Box key={item.id} display="flex" alignItems="center" gap={1.5} mb={1} sx={{ opacity: 0.9 }}>
                    <Box sx={{ minWidth: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.completed && <Box sx={{ width: 10, height: 10, bgcolor: '#00E676', borderRadius: '2px' }} />}
                    </Box>
                    <Box overflow="hidden">
                        <Typography variant="body2" color="white" noWrap sx={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.7 : 1 }}>
                            {item.text}
                        </Typography>
                        {item.deadline && (
                            <Typography variant="caption" color="#4F9CFF" display="flex" alignItems="center" gap={0.5}>
                                <Event sx={{ fontSize: 10 }} />
                                {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        )}
                    </Box>
                </Box>
            ))}
            {pending.length === 0 && items.length > 0 && (
                <Typography variant="body2" color="#00E676" fontStyle="italic">All clear. Good job!</Typography>
            )}
            {items.length > pending.length && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    + {items.length - pending.length} more hidden
                </Typography>
            )}
        </Box>
    );
};

const Dashboard = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [documentsCount, setDocumentsCount] = useState(0);
    const [academicCount, setAcademicCount] = useState(0);
    const [profile, setProfile] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [programs, setPrograms] = useState([]);

    // Notification State
    const [notifAnchor, setNotifAnchor] = useState(null);
    const [readNotifIds, setReadNotifIds] = useState(new Set());
    const notifOpen = Boolean(notifAnchor);

    // Countdown State
    const [countdown, setCountdown] = useState({ date: null, label: '' });
    const [isCountdownOpen, setIsCountdownOpen] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [tempLabel, setTempLabel] = useState('');

    // Checklist State
    const [checklistItems, setChecklistItems] = useState([]);
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [nut, setNut] = useState(""); // New Utility Text
    const [nud, setNud] = useState(""); // New Utility Date

    // AI Counselor State
    const [isAICounselorOpen, setIsAICounselorOpen] = useState(false);

    useEffect(() => {
        if (user?.id) {
            // Load Countdown
            const savedCountdown = localStorage.getItem(`bhortijuddho_countdown_${user.id}`);
            if (savedCountdown) {
                try { setCountdown(JSON.parse(savedCountdown)); } catch (e) { console.error(e); }
            } else {
                setCountdown({ date: null, label: '' });
            }
            // Load Checklist
            const savedList = localStorage.getItem(`bhortijuddho_checklist_${user.id}`);
            if (savedList) {
                try { setChecklistItems(JSON.parse(savedList)); } catch (e) { }
            } else {
                setChecklistItems([]);
            }
        }
    }, [user]);

    const handleSaveCountdown = () => {
        if (tempDate && tempLabel && user?.id) {
            const newData = { date: tempDate, label: tempLabel };
            setCountdown(newData);
            localStorage.setItem(`bhortijuddho_countdown_${user.id}`, JSON.stringify(newData));
            setIsCountdownOpen(false);
        }
    };

    const handleAddChecklist = () => {
        if (!nut || !user?.id) return;
        const newItem = {
            id: Date.now(),
            text: nut,
            deadline: nud,
            completed: false
        };
        const updated = [...checklistItems, newItem];
        setChecklistItems(updated);
        localStorage.setItem(`bhortijuddho_checklist_${user.id}`, JSON.stringify(updated));
        setNut("");
        setNud("");
    };

    const toggleChecklistItem = (id) => {
        if (!user?.id) return;
        const updated = checklistItems.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        setChecklistItems(updated);
        localStorage.setItem(`bhortijuddho_checklist_${user.id}`, JSON.stringify(updated));
    };

    const deleteChecklistItem = (id) => {
        if (!user?.id) return;
        const updated = checklistItems.filter(item => item.id !== id);
        setChecklistItems(updated);
        localStorage.setItem(`bhortijuddho_checklist_${user.id}`, JSON.stringify(updated));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDownloadPDF = async () => {
        try {
            if (!user?.id) return;
            const [apps, docs, academics, profileData] = await Promise.all([
                getApplications(user.id),
                getDocuments(user.id),
                getAcademicRecords(user.id),
                getProfile(user.id)
            ]);
            await generateStudentSummaryPDF({
                profile: { ...profileData?.data, email: user?.email },
                academicRecords: academics?.data || [],
                documents: docs?.data || [],
                applications: apps?.data || []
            });
        } catch (error) {
            console.error('PDF Error:', error);
            alert('Could not generate PDF.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            if (!user?.id) {
                setLoading(false);
                setProfile(null);
                setApplications([]);
                setDocumentsCount(0);
                setAcademicCount(0);
                return;
            }

            setLoading(true);
            try {
                const apps = await getApplications(user.id);
                const docs = await getDocuments(user.id);
                const academics = await getAcademicRecords(user.id);
                const profileData = await getProfile(user.id);
                const unis = await getUniversities();
                const progs = await getAllPrograms();

                setApplications(apps?.data || []);
                setDocumentsCount(docs?.data?.length || 0);
                setAcademicCount(academics?.data?.length || 0);
                setProfile(profileData?.data || null);
                setUniversities(unis || []);
                setPrograms(progs || []);
            } catch (error) {
                console.error('Fetch error:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [user, authLoading]);

    // Derived State
    const recentApplications = useMemo(() => applications.slice(0, 3), [applications]);
    const applicationsCount = applications.length;

    const progress = useMemo(() => {
        let p = 0;
        // Profile Check (40%)
        if (profile?.full_name) p += 10;
        if (profile?.phone) p += 10;
        if (profile?.address) p += 10;
        if (profile?.avatar_url) p += 10;

        // Documents Check (30%)
        if (documentsCount > 0) p += 30;

        // Applications Check (30%)
        if (applicationsCount > 0) p += 30;

        return Math.min(p, 100);
    }, [profile, documentsCount, applicationsCount]);

    const notifications = useMemo(() => {
        const notifs = [];
        applications.forEach(app => {
            if (app.status === 'Accepted') {
                const uni = universities.find(u => u.id === app.university_id);
                notifs.push({
                    id: `acc-${app.id}`,
                    text: `Congratulations! You have been accepted to ${uni?.name || 'University'}!`,
                    time: "Status Update",
                    type: 'success',
                    icon: Celebration
                });
            }
        });
        return notifs;
    }, [applications, universities]);

    // Load read notifications from storage
    useEffect(() => {
        if (user?.id) {
            try {
                const stored = localStorage.getItem(`read_notifications_${user.id}`);
                if (stored) setReadNotifIds(new Set(JSON.parse(stored)));
            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        }
    }, [user]);

    const visibleNotifications = useMemo(() =>
        notifications.filter(n => !readNotifIds.has(n.id)),
        [notifications, readNotifIds]
    );

    const unreadCount = visibleNotifications.length;

    const handleNotifClick = (event) => {
        setNotifAnchor(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchor(null);
        if (visibleNotifications.length > 0) {
            setReadNotifIds(prev => {
                const next = new Set(prev);
                visibleNotifications.forEach(n => next.add(n.id));
                if (user?.id) {
                    localStorage.setItem(`read_notifications_${user.id}`, JSON.stringify([...next]));
                }
                return next;
            });
        }
    };

    const getStatusColor = (status) => {
        const map = { 'Draft': 'default', 'Submitted': 'info', 'In Review': 'warning', 'Accepted': 'success', 'Rejected': 'error' };
        return map[status] || 'default';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#0E0E14">
                <CircularProgress sx={{ color: '#4F9CFF' }} size={60} />
            </Box>
        );
    }

    const quickActions = [
        { title: 'Profile', icon: Person, color: '#FF4FD2', onClick: () => navigate('/student/profile') },
        { title: 'Universities', icon: School, color: '#4F9CFF', onClick: () => navigate('/student/universities') },
        { title: 'Documents', icon: Upload, color: '#00E676', onClick: () => navigate('/student/documents') },
        { title: 'Academics', icon: MenuBook, color: '#FFD700', onClick: () => navigate('/student/academic-info') },
        { title: 'Summary PDF', icon: PictureAsPdf, color: '#FF6B6B', onClick: handleDownloadPDF },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                pb: 8,
                pt: 2,
                // Background is now handled globally in global.css
            }}
        >
            <Container maxWidth="xl">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">

                    {/* Header Bar */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backdropFilter: 'blur(20px)',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                src={profile?.avatar_url}
                                sx={{ width: 56, height: 56, bgcolor: '#4F9CFF', border: '2px solid rgba(79, 156, 255, 0.5)', boxShadow: '0 0 15px rgba(79, 156, 255, 0.3)' }}
                            >
                                {profile?.full_name?.[0] || <Person />}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #FFF, #CCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Welcome, {profile?.full_name?.split(' ')[0] || "Student"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ready to shape your future today?
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Tooltip title="Notifications">
                                <IconButton
                                    onClick={handleNotifClick}
                                    sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Logout />}
                                onClick={handleLogout}
                                sx={{ borderRadius: 3, borderColor: 'rgba(255, 79, 79, 0.3)', color: '#ff4f4f', '&:hover': { borderColor: '#ff4f4f', bgcolor: 'rgba(255, 79, 79, 0.1)' } }}
                            >
                                Logout
                            </Button>

                            {/* Notification Menu */}
                            <Menu
                                anchorEl={notifAnchor}
                                open={notifOpen}
                                onClose={handleNotifClose}
                                PaperProps={{
                                    sx: { bgcolor: '#1A1A24', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 300 }
                                }}
                            >
                                <Box p={2} borderBottom="1px solid rgba(255,255,255,0.1)"><Typography fontWeight="bold">Notifications</Typography></Box>
                                {visibleNotifications.length === 0 ? (
                                    <Box p={2} textAlign="center">
                                        <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                                    </Box>
                                ) : (
                                    visibleNotifications.map(n => (
                                        <MenuItem key={n.id} onClick={handleNotifClose} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <ListItemIcon>
                                                {n.icon ? <n.icon sx={{ color: '#00E676' }} /> : <Info sx={{ color: '#4F9CFF' }} />}
                                            </ListItemIcon>
                                            <ListItemText primary={n.text} secondary={n.time} secondaryTypographyProps={{ sx: { color: 'gray' } }} />
                                        </MenuItem>
                                    ))
                                )}
                            </Menu>
                        </Box>
                    </Paper>

                    {/* Stats Grid */}
                    <Grid container spacing={3} mb={5}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Applications" count={applicationsCount} icon={Assignment} color="#4F9CFF" onClick={() => navigate('/student/applications')} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Documents Ready" count={documentsCount} icon={Description} color="#00E676" onClick={() => navigate('/student/documents')} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Academic Records" count={academicCount} icon={School} color="#FFD700" onClick={() => navigate('/student/academic-info')} />
                        </Grid>

                        {/* Countdown Widget */}
                        <Grid item xs={12} sm={12} md={6}>
                            <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} style={{ height: '100%' }}>
                                <Paper
                                    onClick={() => {
                                        setTempDate(countdown.date || '');
                                        setTempLabel(countdown.label || '');
                                        setIsCountdownOpen(true);
                                    }}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #1A1A24 0%, #2A2A35 100%)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '4px', bgcolor: '#FF4FD2' }} />
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Timer sx={{ color: '#FF4FD2' }} />
                                        <Typography variant="overline" color="text.secondary" fontWeight="bold">
                                            {countdown.label || "SET DATE"}
                                        </Typography>
                                    </Box>
                                    <CountdownCompact targetDate={countdown.date} />
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Checklist Widget */}
                        <Grid item xs={12} sm={12} md={6}>
                            <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} style={{ height: '100%' }}>
                                <Paper
                                    onClick={() => setIsChecklistOpen(true)}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        background: 'linear-gradient(135deg, #1A1A24 0%, #2A2A35 100%)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        gap: 2
                                    }}
                                >
                                    <Box sx={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '4px', bgcolor: '#00E676' }} />

                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00E676' }}>
                                            <CheckBoxIcon />
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" color="white">War Room Checklist</Typography>
                                    </Box>

                                    <ChecklistCompact items={checklistItems} />

                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* AI Counselor Button */}
                    <Box mb={5}>
                        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Paper
                                onClick={() => setIsAICounselorOpen(true)}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, rgba(79, 156, 255, 0.15) 0%, rgba(255, 79, 212, 0.15) 100%)',
                                    border: '2px solid rgba(79, 156, 255, 0.3)',
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, rgba(79, 156, 255, 0.25) 0%, rgba(255, 79, 212, 0.25) 100%)',
                                        border: '2px solid rgba(255, 79, 212, 0.6)',
                                        boxShadow: '0 0 40px rgba(79, 156, 255, 0.4)',
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: -30, right: -30, opacity: 0.1, transform: 'rotate(15deg)' }}>
                                    <Typography sx={{ fontSize: 150 }}>🧠</Typography>
                                </Box>

                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" gap={3}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #4F9CFF 0%, #FF4FD2 100%)',
                                                display: 'flex',
                                                color: 'white',
                                                boxShadow: '0 8px 20px rgba(79, 156, 255, 0.4)',
                                                fontSize: 32
                                            }}
                                        >
                                            🧠
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold" sx={{
                                                background: 'linear-gradient(45deg, #4F9CFF, #FF4FD2)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                mb: 0.5
                                            }}>
                                                AI Admission Counselor
                                            </Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                                                Get instant advice, emotional support, and personalized recommendations
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #4F9CFF, #FF4FD2)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            boxShadow: '0 4px 12px rgba(79, 156, 255, 0.3)'
                                        }}
                                    >
                                        Ask Now <ArrowForward />
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Box>

                    {/* Quick Actions */}
                    <Box mb={5}>
                        <Typography variant="h6" fontWeight="bold" color="white" mb={2} pl={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp sx={{ color: '#FF4FD2' }} /> Quick Access
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                                gap: 2.5
                            }}
                        >
                            {quickActions.map((action, i) => (
                                <QuickActionItem key={i} {...action} />
                            ))}
                        </Box>
                    </Box>

                    {/* Main Content Split - Applications Grid */}
                    <Grid container spacing={4}>
                        {/* Recent Applications */}
                        <Grid item xs={12} lg={8}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(20,20,25,0.9) 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 4,
                                    minHeight: 400
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(79, 156, 255, 0.1)', color: '#4F9CFF' }}>
                                            <Assignment sx={{ fontSize: 20 }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" color="white">
                                            Recent Applications
                                        </Typography>
                                    </Box>
                                    <Button
                                        size="small"
                                        endIcon={<ArrowForward />}
                                        onClick={() => navigate('/student/applications')}
                                        sx={{ color: 'rgba(79, 156, 255, 0.8)' }}
                                    >
                                        View All
                                    </Button>
                                </Box>

                                {recentApplications.map((app, index) => {
                                    const uni = universities.find(u => u.id === app.university_id);
                                    const prog = programs.find(p => p.id === app.program_id);
                                    return (
                                        <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2.5,
                                                    mb: 2,
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    transition: 'all 0.3s',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255,255,255,0.06)',
                                                        transform: 'translateX(5px)',
                                                        borderLeft: `4px solid ${getStatusColor(app.status) === 'default' ? '#aaa' : '#4F9CFF'}`
                                                    }
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'rgba(79, 156, 255, 0.1)', color: '#4F9CFF', border: '1px solid rgba(79, 156, 255, 0.2)' }}>
                                                        {uni?.name?.[0] || "U"}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="bold" color="white">
                                                            {uni?.name || "Loading..."}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {prog?.name || "Program Name"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={app.status}
                                                    color={getStatusColor(app.status)}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        borderRadius: 2
                                                    }}
                                                />
                                            </Paper>
                                        </motion.div>
                                    );
                                })}
                                {recentApplications.length === 0 && (
                                    <Box textAlign="center" py={8} color="text.secondary">
                                        <Assignment sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
                                        <Typography>No applications yet.</Typography>
                                        <Button variant="text" onClick={() => navigate('/student/universities')}>Start Browsing</Button>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Progress & Tips */}
                        <Grid item xs={12} lg={4}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(20,20,25,0.9) 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 4
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00E676' }}>
                                        <CheckCircle sx={{ fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold" color="white">
                                        Application Progress
                                    </Typography>
                                </Box>

                                <Box mb={4} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2" color="text.secondary">Profile Completion</Typography>
                                        <Typography variant="body2" color="#4F9CFF" fontWeight="bold">{progress}%</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #FF4FD2, #4F9CFF)' } }} />
                                </Box>

                                <Typography variant="subtitle2" fontWeight="bold" color="white" mb={2}>
                                    Next Steps
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {[
                                        { text: 'Upload missing transcripts', done: false, color: '#FFD700' },
                                        { text: 'Complete personal statement', done: true, color: '#00E676' },
                                        { text: 'Submit application to BRACU', done: false, color: '#4F9CFF' },
                                    ].map((step, i) => (
                                        <Box key={i} display="flex" gap={2} alignItems="center" sx={{ opacity: step.done ? 0.6 : 1 }}>
                                            <CheckCircle sx={{ fontSize: 20, color: step.done ? step.color : 'rgba(255,255,255,0.1)' }} />
                                            <Typography variant="body2" sx={{ color: step.done ? 'text.secondary' : 'white', textDecoration: step.done ? 'line-through' : 'none' }}>
                                                {step.text}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                </motion.div>
            </Container>

            {/* Countdown Dialog */}
            <Dialog
                open={isCountdownOpen}
                onClose={() => setIsCountdownOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#1E1E25',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Set Your Target (D-Day)</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Define your mission objective and the deadline.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Mission Name (e.g., BUET Exam)"
                        fullWidth
                        variant="outlined"
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{ sx: { color: 'white' } }}
                        InputLabelProps={{ sx: { color: 'gray' } }}
                    />
                    <TextField
                        label="Target Date"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true, sx: { color: 'gray' } }}
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        InputProps={{ sx: { color: 'white' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button onClick={() => setIsCountdownOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
                    <Button onClick={handleSaveCountdown} variant="contained" color="secondary">Set Timer</Button>
                </DialogActions>
            </Dialog>

            {/* Checklist Dialog */}
            <Dialog
                open={isChecklistOpen}
                onClose={() => setIsChecklistOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1E1E25',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minHeight: 500
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckBoxIcon sx={{ color: '#00E676' }} /> War Room Operations
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {/* Add New */}
                    <Box display="flex" gap={1} mb={3} alignItems="flex-end">
                        <TextField
                            label="New Operation / Task"
                            variant="standard"
                            fullWidth
                            value={nut}
                            onChange={(e) => setNut(e.target.value)}
                            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                            sx={{ input: { color: 'white' } }}
                        />
                        <TextField
                            type="datetime-local"
                            variant="standard"
                            value={nud}
                            onChange={(e) => setNud(e.target.value)}
                            sx={{ width: 180, input: { color: 'white' } }}
                        />
                        <IconButton onClick={handleAddChecklist} sx={{ bgcolor: '#00E676', color: '#000', '&:hover': { bgcolor: '#00C853' } }}>
                            <Add />
                        </IconButton>
                    </Box>

                    {/* List */}
                    <List>
                        {checklistItems.length === 0 && (
                            <Typography textAlign="center" color="text.secondary" mt={4}>No operations pending. Stay sharp.</Typography>
                        )}
                        {checklistItems.map(item => (
                            <ListItem
                                key={item.id}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    mb: 1,
                                    borderRadius: 2,
                                    borderLeft: item.completed ? '4px solid #00E676' : '4px solid #FF4FD2'
                                }}
                            >
                                <Checkbox
                                    checked={item.completed}
                                    onChange={() => toggleChecklistItem(item.id)}
                                    icon={<CheckBoxOutlineBlank sx={{ color: '#FF4FD2' }} />}
                                    checkedIcon={<CheckBoxIcon sx={{ color: '#00E676' }} />}
                                />
                                <ListItemText
                                    primary={
                                        <Typography sx={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'text.secondary' : 'white' }}>
                                            {item.text}
                                        </Typography>
                                    }
                                    secondary={
                                        item.deadline ? (
                                            <Typography variant="caption" color={item.completed ? 'text.secondary' : '#4F9CFF'}>
                                                Deadline: {new Date(item.deadline).toLocaleString()}
                                            </Typography>
                                        ) : null
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => deleteChecklistItem(item.id)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#FF5252' } }}>
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button onClick={() => setIsChecklistOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* AI Counselor Modal */}
            <AICounselor
                isOpen={isAICounselorOpen}
                onClose={() => setIsAICounselorOpen(false)}
                userContext={{
                    profile: profile,
                    applications: applicationsCount,
                    documents: documentsCount
                }}
            />
        </Box>
    );
};

export default Dashboard;

