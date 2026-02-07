import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Chip,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Snackbar,
    Alert,
    Divider,
    IconButton,
    Grid,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AiRecipeGeneratePage = () => {
    const navigate = useNavigate();

    const [ingredientInput, setIngredientInput] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const token = localStorage.getItem('token');

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const addIngredient = () => {
        if (!ingredientInput.trim()) return;
        setIngredients([...ingredients, ingredientInput.trim()]);
        setIngredientInput('');
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const generateRecipe = async () => {
        if (ingredients.length === 0) {
            showSnackbar('Add at least one ingredient', 'warning');
            return;
        }

        setLoading(true);
        setRecipe(null);

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/ai/recipe',
                { ingredients },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRecipe(data);
            showSnackbar('Recipe generated successfully 🍳');
        } catch (error) {
            showSnackbar('Failed to generate recipe', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveRecipe = async () => {
        if (!recipe) return;

        setSaving(true);

        try {
            await axios.post(
                'http://localhost:5000/api/ai/recipe/save',
                recipe,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showSnackbar('Recipe saved successfully ❤️');
        } catch (error) {
            showSnackbar('Failed to save recipe', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box maxWidth={1000} mx="auto" px={2} py={3}>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            {/* Header */}
            <Typography variant="h4" fontWeight="bold">
                AI Recipe Generator <AutoAwesomeIcon color="primary" />
            </Typography>
            <Typography color="text.secondary" mb={3}>
                Enter the ingredients you have — AI will do the magic ✨
            </Typography>

            {/* Ingredient Input */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            fullWidth
                            label="Add ingredient"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && addIngredient()
                            }
                        />
                        <Button variant="contained" onClick={addIngredient}>
                            Add
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                        {ingredients.map((item, index) => (
                            <Chip
                                key={index}
                                label={item}
                                onDelete={() => removeIngredient(index)}
                            />
                        ))}
                    </Stack>

                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={generateRecipe}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Generate Recipe'
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Generated Recipe */}
            {recipe && (
                <Card
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 3,
                            background:
                                'linear-gradient(135deg, #ff9800, #ff5722)',
                            color: 'white',
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold">
                            {recipe.title}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                            {recipe.description}
                        </Typography>
                    </Box>

                    <CardContent>
                        {/* Meta */}
                        <Stack direction="row" spacing={1} mb={3} flexWrap="wrap">
                            <Chip
                                icon={<AccessTimeIcon />}
                                label={`${recipe.cookingTime} mins`}
                            />
                            <Chip
                                icon={<RestaurantIcon />}
                                label={recipe.difficulty.toUpperCase()}
                            />
                            <Chip label={recipe.category} />
                            <Chip label={recipe.cuisine} />
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        {/* Ingredients */}
                        <Typography fontWeight="bold" mb={1}>
                            Ingredients
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
                            {recipe.ingredients.map((ing, i) => (
                                <Chip
                                    key={i}
                                    label={`${ing.name} • ${ing.quantity}`}
                                    variant="outlined"
                                />
                            ))}
                        </Stack>

                        {/* Steps */}
                        <Typography fontWeight="bold" mb={2}>
                            Cooking Steps
                        </Typography>

                        <Grid container spacing={2}>
                            {recipe.steps.map((step) => (
                                <Grid item xs={12} key={step.stepNumber}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography fontWeight="bold">
                                            Step {step.stepNumber}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {step.instruction}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Box mt={4}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={saveRecipe}
                                disabled={saving}
                            >
                                {saving ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Save Recipe'
                                )}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({ ...snackbar, open: false })
                }
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AiRecipeGeneratePage;
