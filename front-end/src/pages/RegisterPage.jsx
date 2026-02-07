import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // import the context

/* 🔹 Cloudinary config */
const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, uploadProfileImage } = useUser(); // get register from context

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        image: null,      // File
        preview: null     // Preview URL
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    /* 🔹 Input change */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* 🔹 Image selection */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm({
            ...form,
            image: file,
            preview: URL.createObjectURL(file)
        });
    };

    /* 🔹 Register */
    const handleRegister = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!emailRegex.test(form.email)) {
            return setSnackbar({
                open: true,
                message: 'Please enter a valid email address',
                severity: 'error'
            });
        }

        if (!strongPasswordRegex.test(form.password)) {
            return setSnackbar({
                open: true,
                message:
                    'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
                severity: 'error'
            });
        }

        if (form.password !== form.confirmPassword) {
            return setSnackbar({
                open: true,
                message: 'Passwords do not match',
                severity: 'error'
            });
        }

        try {
            const imageUrl = await uploadProfileImage(form.image);

            const payload = {
                name: form.name,
                username: form.username,
                email: form.email,
                password: form.password,
                image: imageUrl
            };

            // 🔹 Use context register method
            await register(payload);

            setSnackbar({
                open: true,
                message: 'Account created successfully!',
                severity: 'success'
            });

            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    error.message || 'Registration failed',
                severity: 'error'
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Box
                    component="form"
                    onSubmit={handleRegister}
                    sx={{ width: '100%', p: 4, borderRadius: 2, boxShadow: 4 }}
                >
                    {/* Brand */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight={700}>
                            Cook Book
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Share recipes. Discover flavors. Build your kitchen story.
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Profile Image */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar src={form.preview} sx={{ width: 56, height: 56 }} />
                        <Button variant="outlined" component="label">
                            Upload profile photo
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>

                    {/* Fields */}
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField label="Full name" name="name" value={form.name} onChange={handleChange} />
                        <TextField label="Username" name="username" value={form.username} onChange={handleChange} />
                        <TextField label="Email address" name="email" type="email" value={form.email} onChange={handleChange} />
                        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                        <TextField label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ mt: 4 }}>
                        <Button fullWidth size="large" type="submit" variant="contained">
                            Create account
                        </Button>

                        <Typography variant="body2" align="center" sx={{ mt: 2 }} color="text.secondary">
                            Already have an account?
                            <Link to="/login" style={{ textDecoration: 'none', marginLeft: 4 }}>
                                <Button variant="text">login</Button>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RegisterPage;
