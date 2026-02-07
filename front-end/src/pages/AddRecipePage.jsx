import * as React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Grid,
    IconButton,
    Paper,
    Stack,
    Snackbar,
    Alert,
    Divider,
    Card,
    CardMedia,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';

function AddRecipePage() {
    const navigate = useNavigate();
    const { addRecipe, loading } = useRecipe();

    const [form, setForm] = React.useState({
        title: '',
        description: '',
        cookingTime: '',
        difficulty: 'easy',
        category: 'breakfast',
        cuisine: 'indian',
    });

    const [ingredients, setIngredients] = React.useState([
        { name: '', quantity: '' },
    ]);
    const [steps, setSteps] = React.useState([
        { stepNumber: 1, instruction: '' },
    ]);

    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);

    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleSnackbarClose = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addRecipe(
                {
                    ...form,
                    cookingTime: Number(form.cookingTime),
                    ingredients,
                    steps,
                },
                imageFile
            );

            setSnackbar({
                open: true,
                message: 'Recipe created successfully!',
                severity: 'success',
            });

            navigate('/home');
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Failed to create recipe',
                severity: 'error',
            });
        }
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            justifyContent="center"
            bgcolor="background.default"
            p={3}
        >
            <Paper sx={{ maxWidth: 850, width: '100%', p: 4, borderRadius: 3 }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                    <IconButton onClick={() => navigate('/home')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight={600}>
                        Add New Recipe
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {/* BASIC INFO */}
                        <Box>
                            <Typography variant="h6" mb={1}>
                                Basic Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                <TextField
                                    label="Title"
                                    name="title"
                                    fullWidth
                                    required
                                    value={form.title}
                                    onChange={handleChange}
                                />

                                <TextField
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={form.description}
                                    onChange={handleChange}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Cooking Time (min)"
                                            name="cookingTime"
                                            type="number"
                                            fullWidth
                                            required
                                            value={form.cookingTime}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            label="Difficulty"
                                            name="difficulty"
                                            fullWidth
                                            value={form.difficulty}
                                            onChange={handleChange}
                                        >
                                            {['easy', 'medium', 'hard'].map((d) => (
                                                <MenuItem key={d} value={d}>
                                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            label="Category"
                                            name="category"
                                            fullWidth
                                            value={form.category}
                                            onChange={handleChange}
                                        >
                                            {[
                                                'breakfast',
                                                'lunch',
                                                'dinner',
                                                'snack',
                                                'dessert',
                                                'beverage',
                                            ].map((c) => (
                                                <MenuItem key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            select
                                            label="Cuisine"
                                            name="cuisine"
                                            fullWidth
                                            value={form.cuisine}
                                            onChange={handleChange}
                                        >
                                            {[
                                                'indian',
                                                'italian',
                                                'chinese',
                                                'mexican',
                                                'american',
                                                'thai',
                                                'other',
                                            ].map((c) => (
                                                <MenuItem key={c} value={c}>
                                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Box>

                        {/* INGREDIENTS */}
                        <Box>
                            <Typography variant="h6" mb={1}>
                                Ingredients
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                {ingredients.map((ing, i) => (
                                    <Grid container spacing={2} key={i}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Ingredient"
                                                fullWidth
                                                value={ing.name}
                                                onChange={(e) => {
                                                    const copy = [...ingredients];
                                                    copy[i].name = e.target.value;
                                                    setIngredients(copy);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Quantity"
                                                fullWidth
                                                value={ing.quantity}
                                                onChange={(e) => {
                                                    const copy = [...ingredients];
                                                    copy[i].quantity = e.target.value;
                                                    setIngredients(copy);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setIngredients([
                                            ...ingredients,
                                            { name: '', quantity: '' },
                                        ])
                                    }
                                >
                                    + Add Ingredient
                                </Button>
                            </Stack>
                        </Box>

                        {/* STEPS */}
                        <Box>
                            <Typography variant="h6" mb={1}>
                                Steps
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                {steps.map((step, i) => (
                                    <TextField
                                        key={i}
                                        label={`Step ${i + 1}`}
                                        fullWidth
                                        multiline
                                        value={step.instruction}
                                        onChange={(e) => {
                                            const copy = [...steps];
                                            copy[i].instruction = e.target.value;
                                            setSteps(copy);
                                        }}
                                    />
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        setSteps([
                                            ...steps,
                                            {
                                                stepNumber: steps.length + 1,
                                                instruction: '',
                                            },
                                        ])
                                    }
                                >
                                    + Add Step
                                </Button>
                            </Stack>
                        </Box>

                        {/* IMAGE */}
                        <Box>
                            <Typography variant="h6" mb={1}>
                                Recipe Image
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Card
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderStyle: 'dashed',
                                    textAlign: 'center',
                                }}
                            >
                                {imagePreview ? (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={imagePreview}
                                        sx={{ borderRadius: 2, mb: 2 }}
                                    />
                                ) : (
                                    <Typography color="text.secondary" mb={2}>
                                        No image selected
                                    </Typography>
                                )}

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Card>
                        </Box>

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ alignSelf: 'flex-end', px: 4 }}
                        >
                            {loading ? 'Saving...' : 'Create Recipe'}
                        </Button>
                    </Stack>
                </Box>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        severity={snackbar.severity}
                        variant="filled"
                        onClose={handleSnackbarClose}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
}

export default AddRecipePage;
