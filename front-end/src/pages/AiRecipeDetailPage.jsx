import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Stack,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MotionPaper = Paper; // Replace with framer-motion if you want animations

const AiRecipeDetailPage = () => {
    const { id } = useParams(); // AI recipe ID
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const token = localStorage.getItem('token');

    // Fetch AI recipe detail
    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://cook-book-fullstack-mern.onrender.com/api/ai/recipes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch recipe');
                const data = await res.json();
                setRecipe(data);
            } catch (err) {
                setSnackbar({ open: true, message: err.message, severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (!recipe) return null;

    return (
        <Box maxWidth={900} mx="auto" px={2} py={4}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <MotionPaper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {recipe.title}
                </Typography>

                <Typography color="text.secondary" mb={2}>
                    {recipe.description}
                </Typography>

                <Stack direction="row" spacing={1} mb={3}>
                    <Chip label={`⏱ ${recipe.cookingTime} mins`} />
                    <Chip label={`🎯 ${recipe.difficulty}`} />
                    <Chip label={`🍴 ${recipe.category}`} />
                    <Chip label={`${recipe.cuisine}`} />
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Ingredients */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Ingredients
                </Typography>
                <Grid container spacing={2} mb={4}>
                    {recipe.ingredients.map((ing, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Typography fontWeight="medium">{ing.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {ing.quantity}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Steps */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Cooking Steps
                </Typography>
                <Stack spacing={2}>
                    {recipe.steps.map((step) => (
                        <Paper key={step.stepNumber} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography fontWeight="bold">Step {step.stepNumber}</Typography>
                            <Typography color="text.secondary">{step.instruction}</Typography>
                        </Paper>
                    ))}
                </Stack>
            </MotionPaper>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AiRecipeDetailPage;
