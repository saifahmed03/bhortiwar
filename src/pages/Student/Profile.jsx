import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile, uploadAvatar } from "../../services/studentService";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  MenuItem,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  CameraAlt,
  School,
  ArrowBack,
  Public,
  ContactEmergency,
  Info,
  Logout
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Define styles outside component to prevent re-creation on every render
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(79, 156, 255, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#4F9CFF' },
    '&.Mui-disabled': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
      '& input': { '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.7)' }
    }
  },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4F9CFF' }
};

const selectSx = {
  ...textFieldSx,
  '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' },
  '& .MuiSelect-select': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
};

// MenuProps for Select dropdowns to ensure proper display
const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 300,
      backgroundColor: '#1E1E25',
      color: 'white'
    }
  }
};

// TabPanel component - defined outside to prevent re-creation
const TabPanel = React.memo(({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
));

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [formData, setFormData] = useState({
    // Basic Info
    full_name: "",
    phone: "",
    address: "",
    country: "",
    avatar_url: "",

    // Demographics
    date_of_birth: "",
    gender: "",
    preferred_pronouns: "",
    city_of_birth: "",
    country_of_birth: "",
    languages_spoken: [],
    primary_language: "",

    // Citizenship
    citizenship_status: "",
    citizenship_country: "",
    secondary_citizenship: "",
    visa_status: "",
    passport_number: "",

    // Contact & Emergency
    alternate_phone: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: ""
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setFormData({
          full_name: "",
          phone: "",
          address: "",
          country: "",
          avatar_url: "",
          date_of_birth: "",
          gender: "",
          preferred_pronouns: "",
          city_of_birth: "",
          country_of_birth: "",
          languages_spoken: [],
          primary_language: "",
          citizenship_status: "",
          citizenship_country: "",
          secondary_citizenship: "",
          visa_status: "",
          passport_number: "",
          alternate_phone: "",
          emergency_contact_name: "",
          emergency_contact_relationship: "",
          emergency_contact_phone: ""
        });
        return;
      }
      try {
        setLoading(true);
        const { data, error } = await getProfile(user.id);

        if (error) {
          console.log("Profile fetch note:", error);
        }

        if (data) {
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
            country: data.country || "",
            avatar_url: data.avatar_url || "",
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "",
            preferred_pronouns: data.preferred_pronouns || "",
            city_of_birth: data.city_of_birth || "",
            country_of_birth: data.country_of_birth || "",
            languages_spoken: data.languages_spoken || [],
            primary_language: data.primary_language || "",
            citizenship_status: data.citizenship_status || "",
            citizenship_country: data.citizenship_country || "",
            secondary_citizenship: data.secondary_citizenship || "",
            visa_status: data.visa_status || "",
            passport_number: data.passport_number || "",
            alternate_phone: data.alternate_phone || "",
            emergency_contact_name: data.emergency_contact_name || "",
            emergency_contact_relationship: data.emergency_contact_relationship || "",
            emergency_contact_phone: data.emergency_contact_phone || ""
          });
        } else {
          setFormData(prev => ({
            ...prev,
            full_name: user.user_metadata?.full_name || ""
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  // Calculate profile completion percentage
  const completionPercentage = useMemo(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter((val) => {
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'number') return true;
      return val !== "" && val !== null && val !== undefined;
    }).length;
    return Math.round((filledFields / totalFields) * 100);
  }, [formData]);

  // Handler for text field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handler for multi-select languages
  const handleLanguagesChange = useCallback((e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      languages_spoken: typeof value === 'string' ? value.split(',') : value
    }));
  }, []);

  // Handler for avatar click
  const handleAvatarClick = useCallback(() => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isEditing]);

  // Handler for avatar upload
  const handleAvatarUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const { data, error } = await uploadAvatar(user.id, file);

      if (error) {
        setError("Failed to upload avatar: " + error.message);
        return;
      }

      if (data?.avatar_url) {
        setFormData(prev => ({
          ...prev,
          avatar_url: data.avatar_url
        }));
        setSuccess("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  }, [user]);

  // Handler for saving profile
  const handleSave = useCallback(async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await updateProfile(user.id, {
        ...formData,
        email: user.email // Ensure email is synced
      });

      if (error) {
        setError("Failed to update profile: " + error.message);
        return;
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }, [user, formData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" bgcolor="#0E0E14">
        <CircularProgress sx={{ color: '#4F9CFF' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0E0E14', minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4} display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/student/dashboard')}
            sx={{ mr: 2, color: 'text.secondary', '&:hover': { color: '#4F9CFF', bgcolor: 'rgba(79, 156, 255, 0.1)' } }}
          >
            Go Back to Dashboard
          </Button>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
              My Profile
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your personal information
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            {!isEditing ? (
              <>
                <Button
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  sx={{
                    borderColor: '#4F9CFF',
                    color: '#4F9CFF',
                    '&:hover': { borderColor: '#3D84E5', bgcolor: 'rgba(79, 156, 255, 0.1)' }
                  }}
                >
                  Edit Profile
                </Button>
                <Button
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  variant="outlined"
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
              </>
            ) : (
              <Box display="flex" gap={2}>
                <Button
                  startIcon={<Cancel />}
                  onClick={() => setIsEditing(false)}
                  sx={{ color: 'text.secondary' }}
                >
                  Cancel
                </Button>
                <Button
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  onClick={handleSave}
                  variant="contained"
                  disabled={saving}
                  sx={{
                    bgcolor: '#4F9CFF',
                    '&:hover': { bgcolor: '#3D84E5' }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Profile Card - Centered */}
        <Box mb={4} display="flex" justifyContent="center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '600px' }}>
            <Paper
              sx={{
                p: 4,
                bgcolor: 'rgba(30, 30, 37, 0.95)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100px',
                  background: 'linear-gradient(180deg, rgba(79, 156, 255, 0.1) 0%, rgba(30, 30, 37, 0) 100%)',
                  zIndex: 0
                }}
              />

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <Box position="relative" mb={3} zIndex={1}>
                <Avatar
                  src={formData.avatar_url}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#4F9CFF',
                    fontSize: '3rem',
                    border: '4px solid rgba(30, 30, 37, 1)',
                    boxShadow: '0 8px 24px rgba(79, 156, 255, 0.3)',
                    cursor: isEditing ? 'pointer' : 'default'
                  }}
                  onClick={handleAvatarClick}
                >
                  {!formData.avatar_url && (formData.full_name ? formData.full_name.charAt(0).toUpperCase() : <Person fontSize="inherit" />)}
                </Avatar>
                {isEditing && (
                  <IconButton
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#4F9CFF',
                      '&:hover': { bgcolor: '#3D84E5' },
                      boxShadow: 2
                    }}
                    size="small"
                  >
                    {uploading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CameraAlt sx={{ color: 'white', fontSize: 18 }} />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5" fontWeight="bold" color="white" gutterBottom align="center">
                {formData.full_name || "Student"}
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" mb={3} align="center">
                {user?.email}
              </Typography>

              {/* Profile Completion */}
              <Box width="100%" mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" color="#4F9CFF" fontWeight="bold">
                    {completionPercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4F9CFF',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              <Box width="100%">
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

                <Box display="flex" alignItems="center" mb={2} color="rgba(255, 255, 255, 0.7)">
                  <School sx={{ mr: 2, color: '#4F9CFF', opacity: 0.8 }} />
                  <Typography variant="body2">Aspiring Student</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2} color="rgba(255, 255, 255, 0.7)">
                  <LocationOn sx={{ mr: 2, color: '#4F9CFF', opacity: 0.8 }} />
                  <Typography variant="body2">
                    {formData.country || "Location not set"}
                  </Typography>
                </Box>
                {formData.citizenship_status && (
                  <Box display="flex" alignItems="center" color="rgba(255, 255, 255, 0.7)">
                    <Public sx={{ mr: 2, color: '#4F9CFF', opacity: 0.8 }} />
                    <Typography variant="body2">{formData.citizenship_status}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Box>

        {/* Tabbed Form */}
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={10}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Paper
                sx={{
                  bgcolor: 'rgba(30, 30, 37, 0.95)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    px: 2,
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-selected': { color: '#4F9CFF' }
                    },
                    '& .MuiTabs-indicator': { bgcolor: '#4F9CFF' }
                  }}
                >
                  <Tab icon={<Person />} iconPosition="start" label="Personal" />
                  <Tab icon={<Public />} iconPosition="start" label="Citizenship" />
                  <Tab icon={<ContactEmergency />} iconPosition="start" label="Emergency Contact" />
                </Tabs>

                <Box px={4}>
                  {/* Tab 1: Personal Information */}
                  <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          sx={textFieldSx}
                          InputProps={{
                            startAdornment: <Person sx={{ color: 'text.secondary', mr: 1.5, fontSize: 20 }} />
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          value={user?.email}
                          disabled
                          sx={textFieldSx}
                          InputProps={{
                            startAdornment: <Email sx={{ color: 'text.secondary', mr: 1.5, fontSize: 20 }} />
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                          InputProps={{
                            startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1.5, fontSize: 20 }} />
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth disabled={!isEditing} sx={selectSx}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            label="Gender"
                            MenuProps={MENU_PROPS}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Preferred Pronouns (Optional)"
                          name="preferred_pronouns"
                          value={formData.preferred_pronouns}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="e.g., he/him, she/her, they/them"
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="City of Birth"
                          name="city_of_birth"
                          value={formData.city_of_birth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Country of Birth"
                          name="country_of_birth"
                          value={formData.country_of_birth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Primary Language"
                          name="primary_language"
                          value={formData.primary_language}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth disabled={!isEditing} sx={selectSx}>
                          <InputLabel>Languages Spoken</InputLabel>
                          <Select
                            multiple
                            name="languages_spoken"
                            value={formData.languages_spoken}
                            onChange={handleLanguagesChange}
                            input={<OutlinedInput label="Languages Spoken" />}
                            MenuProps={MENU_PROPS}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" sx={{ bgcolor: 'rgba(79, 156, 255, 0.2)', color: 'white' }} />
                                ))}
                              </Box>
                            )}
                          >
                            <MenuItem value="Bengali">Bengali</MenuItem>
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Hindi">Hindi</MenuItem>
                            <MenuItem value="Urdu">Urdu</MenuItem>
                            <MenuItem value="Arabic">Arabic</MenuItem>
                            <MenuItem value="French">French</MenuItem>
                            <MenuItem value="Spanish">Spanish</MenuItem>
                            <MenuItem value="Chinese">Chinese</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          multiline
                          rows={3}
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                          InputProps={{
                            startAdornment: <LocationOn sx={{ color: 'text.secondary', mr: 1.5, fontSize: 20 }} />
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Alternate Phone (Optional)"
                          name="alternate_phone"
                          value={formData.alternate_phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab 2: Citizenship */}
                  <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth disabled={!isEditing} sx={selectSx}>
                          <InputLabel>Citizenship Status</InputLabel>
                          <Select
                            name="citizenship_status"
                            value={formData.citizenship_status}
                            onChange={handleChange}
                            label="Citizenship Status"
                            MenuProps={MENU_PROPS}
                          >
                            <MenuItem value="Bangladeshi Citizen">Bangladeshi Citizen</MenuItem>
                            <MenuItem value="Dual Citizen">Dual Citizen</MenuItem>
                            <MenuItem value="International Student">International Student</MenuItem>
                            <MenuItem value="Permanent Resident">Permanent Resident</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Primary Citizenship Country"
                          name="citizenship_country"
                          value={formData.citizenship_country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          sx={textFieldSx}
                        />
                      </Grid>

                      {formData.citizenship_status === "Dual Citizen" && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Secondary Citizenship Country"
                            name="secondary_citizenship"
                            value={formData.secondary_citizenship}
                            onChange={handleChange}
                            disabled={!isEditing}
                            sx={textFieldSx}
                          />
                        </Grid>
                      )}

                      {formData.citizenship_status === "International Student" && (
                        <>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Visa Status"
                              name="visa_status"
                              value={formData.visa_status}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="e.g., Student Visa, F-1"
                              sx={textFieldSx}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Passport Number (Optional)"
                              name="passport_number"
                              value={formData.passport_number}
                              onChange={handleChange}
                              disabled={!isEditing}
                              sx={textFieldSx}
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ bgcolor: 'rgba(79, 156, 255, 0.1)', color: 'white' }}>
                          <Typography variant="body2">
                            <Info sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            This information helps universities understand your background and may be used for visa documentation if you're admitted.
                          </Typography>
                        </Alert>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab 3: Emergency Contact */}
                  <TabPanel value={activeTab} index={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Alert severity="warning" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: 'white', mb: 3 }}>
                          <Typography variant="body2">
                            Please provide emergency contact information. This person will be contacted in case of an emergency.
                          </Typography>
                        </Alert>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Name"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Relationship"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="e.g., Parent, Sibling, Spouse"
                          sx={textFieldSx}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Phone"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                          sx={textFieldSx}
                          InputProps={{
                            startAdornment: <Phone sx={{ color: 'text.secondary', mr: 1.5, fontSize: 20 }} />
                          }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;

