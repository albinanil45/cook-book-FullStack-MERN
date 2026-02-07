import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // import UserContext

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useUser(); // get login from context

    const [form, setForm] = useState({
        email: '',
        password: ''
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

    /* 🔹 Login */
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login(form.email, form.password); // use context login

            setSnackbar({
                open: true,
                message: 'Login successful!',
                severity: 'success'
            });

            // redirect after success
            setTimeout(() => navigate('/'), 1200);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Login failed',
                severity: 'error'
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ width: '100%', p: 4, borderRadius: 2, boxShadow: 4 }}
                >
                    {/* Brand */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight={700}>
                            Cook Book
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Welcome back. Continue your recipe journey.
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Fields */}
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            label="Email address"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Log in
                        </Button>

                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ mt: 2 }}
                            color="text.secondary"
                        >
                            Don’t have an account?
                            <Link to="/register" style={{ textDecoration: 'none', marginLeft: 4 }}>
                                <Button variant="text">Register</Button>
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

export default LoginPage;
