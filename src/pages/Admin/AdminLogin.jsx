import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Paper,
    Alert
} from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Lock, VpnKey, VerifiedUser, Security } from "@mui/icons-material";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const x = useMotionValue(0);
    const background = useTransform(
        x,
        [0, 260],
        ["linear-gradient(90deg, #FF4FD2 0%, #1a1a2e 0%)", "linear-gradient(90deg, #4F9CFF 100%, #1a1a2e 100%)"]
    );

    const handleDragEnd = () => {
        if (x.get() > 250) {
            setVerified(true);
        } else {
            x.set(0); // Reset if not fully dragged
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "qwerty1234") {
            // Set a session storage flag for basic security
            sessionStorage.setItem("admin_auth", "true");
            navigate("/admin/dashboard");
        } else {
            setError("Access Denied: Invalid Credentials");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#0E0E14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                p: 2,
                background: `
          radial-gradient(circle at 50% 50%, rgba(79, 156, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 10% 10%, rgba(255, 79, 210, 0.05) 0%, transparent 40%)
        `
            }}
        >
            <Container maxWidth="xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: "rgba(30, 30, 37, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(20px)",
                            textAlign: "center"
                        }}
                    >
                        <Box mb={3} display="flex" justifyContent="center">
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    bgcolor: verified ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 79, 210, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: verified ? "2px solid #00E676" : "2px solid #FF4FD2"
                                }}
                            >
                                {verified ? (
                                    <VerifiedUser sx={{ fontSize: 40, color: "#00E676" }} />
                                ) : (
                                    <Security sx={{ fontSize: 40, color: "#FF4FD2" }} />
                                )}
                            </Box>
                        </Box>

                        <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
                            Admin Portal
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={4}>
                            {verified ? "Identity Verified. Enter Passcode." : "Security Verification Required"}
                        </Typography>

                        {/* Puzzle / Challenge */}
                        {!verified && (
                            <Box sx={{ mb: 4, position: "relative" }}>
                                <Box
                                    sx={{
                                        width: 300,
                                        height: 60,
                                        bgcolor: "rgba(255, 255, 255, 0.05)",
                                        borderRadius: 30,
                                        position: "relative",
                                        overflow: "hidden",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        margin: "0 auto"
                                    }}
                                >
                                    <motion.div
                                        style={{ background }}
                                        className="absolute inset-0 opacity-50"
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: "absolute",
                                            width: "100%",
                                            textAlign: "center",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "rgba(255, 255, 255, 0.3)",
                                            fontWeight: "bold",
                                            letterSpacing: 2,
                                            zIndex: 0
                                        }}
                                    >
                                        SLIDE TO VERIFY
                                    </Typography>

                                    <motion.div
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 260 }}
                                        dragElastic={0}
                                        dragMomentum={false}
                                        onDragEnd={handleDragEnd}
                                        style={{ x }}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "50%",
                                            bgcolor: "#FF4FD2",
                                            position: "absolute",
                                            top: 5,
                                            left: 5,
                                            cursor: "grab",
                                            zIndex: 10,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 0 20px rgba(255, 79, 210, 0.5)"
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <VpnKey sx={{ color: "white", fontSize: 20 }} />
                                    </motion.div>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                                    Prove humanity to proceed
                                </Typography>
                            </Box>
                        )}

                        {/* Password Input (Revealed after verification) */}
                        <motion.div
                            initial={false}
                            animate={{
                                height: verified ? "auto" : 0,
                                opacity: verified ? 1 : 0
                            }}
                            style={{ overflow: "hidden" }}
                        >
                            <form onSubmit={handleLogin}>
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ffcdd2' }}>
                                        {error}
                                    </Alert>
                                )}
                                <TextField
                                    fullWidth
                                    type="password"
                                    placeholder="Enter Admin Passcode"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                            '&:hover fieldset': { borderColor: '#4F9CFF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4F9CFF' }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    }}
                                />
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(45deg, #4F9CFF, #FF4FD2)',
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        boxShadow: "0 4px 20px rgba(79, 156, 255, 0.3)",
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #3D84E5, #E63FB8)',
                                            boxShadow: "0 6px 25px rgba(79, 156, 255, 0.5)"
                                        }
                                    }}
                                >
                                    Access Dashboard
                                </Button>
                            </form>
                        </motion.div>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AdminLogin;

