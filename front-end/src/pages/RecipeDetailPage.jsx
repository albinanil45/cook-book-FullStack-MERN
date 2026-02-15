import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Stack,
    Chip,
    Divider,
    Avatar,
    TextField,
    Button,
    Rating,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useUser } from '../context/UserContext';

const MotionPaper = motion(Paper);

function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, getCurrentUser } = useUser();

    const [recipe, setRecipe] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const [rating, setRating] = React.useState(0);
    const [review, setReview] = React.useState('');

    const [reviews, setReviews] = React.useState([]);
    const [hasReviewed, setHasReviewed] = React.useState(false);
    const [reviewLoading, setReviewLoading] = React.useState(false);

    const [savedRecipes, setSavedRecipes] = React.useState([]);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'info',
    });

    /* ================= FETCH RECIPE ================= */
    React.useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(
                    `https://cook-book-fullstack-mern.onrender.com/api/recipes/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                );
                const data = await res.json();
                setRecipe(data);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    /* ================= FETCH USER ================= */
    React.useEffect(() => {
        if (!user) getCurrentUser();
        if (user) setSavedRecipes(user.savedRecipes || []);
    }, [user, getCurrentUser]);

    /* ================= FETCH REVIEWS ================= */
    React.useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `https://cook-book-fullstack-mern.onrender.com/api/recipes/${id}/reviews`
                );
                const data = await res.json();
                setReviews(data || []);

                if (user) {
                    const reviewed = data.some(
                        (r) => r.user._id === user._id
                    );
                    setHasReviewed(reviewed);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchReviews();
    }, [id, user]);

    /* ================= CHECK OWN RECIPE ================= */
    const isOwnRecipe =
        user && recipe?.createdBy?._id === user?._id;

    /* ================= SUBMIT REVIEW ================= */
    const handleReviewSubmit = async () => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please login to post a review',
                severity: 'warning',
            });
            return;
        }

        if (isOwnRecipe) {
            setSnackbar({
                open: true,
                message: "You can't review your own recipe",
                severity: 'info',
            });
            return;
        }

        try {
            setReviewLoading(true);
            const res = await fetch(
                `https://cook-book-fullstack-mern.onrender.com/api/recipes/${id}/review`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify({
                        rating,
                        comment: review,
                    }),
                }
            );

            if (!res.ok) throw new Error('Failed to submit review');

            setSnackbar({
                open: true,
                message: 'Review submitted successfully',
                severity: 'success',
            });

            setRating(0);
            setReview('');
            setHasReviewed(true);

            const refresh = await fetch(
                `https://cook-book-fullstack-mern.onrender.com/api/recipes/${id}/reviews`
            );
            const updatedReviews = await refresh.json();
            setReviews(updatedReviews);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message,
                severity: 'error',
            });
        } finally {
            setReviewLoading(false);
        }
    };

    /* ================= SAVE / UNSAVE ================= */
    const toggleSaveRecipe = async () => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please login to add to favourites',
                severity: 'warning',
            });
            return;
        }

        const isSaved = savedRecipes.includes(recipe._id);
        try {
            const token = localStorage.getItem('token');
            const url = isSaved
                ? `https://cook-book-fullstack-mern.onrender.com/api/recipes/${recipe._id}/unsave`
                : `https://cook-book-fullstack-mern.onrender.com/api/recipes/${recipe._id}/save`;

            await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            setSavedRecipes((prev) =>
                isSaved
                    ? prev.filter((id) => id !== recipe._id)
                    : [...prev, recipe._id]
            );

            setSnackbar({
                open: true,
                message: isSaved
                    ? 'Removed from favourites'
                    : 'Added to favourites',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message,
                severity: 'error',
            });
        }
    };

    const copyRecipeLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setSnackbar({
                open: true,
                message: 'Recipe link copied to clipboard',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to copy link',
                severity: 'error',
            });
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (!recipe) return null;

    const isFavourite = savedRecipes.includes(recipe._id);

    return (
        <Box p={3} maxWidth="1200px" mx="auto">
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <MotionPaper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                elevation={3}
                sx={{ p: 4, borderRadius: 3 }}
            >
                {/* AUTHOR */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mb={3}
                    sx={{ cursor: 'pointer' }}
                    onClick={() =>
                        navigate(`/users/${recipe.createdBy._id}`)
                    }
                >
                    <Avatar src={recipe.createdBy?.image}>
                        {recipe.createdBy?.username
                            ?.charAt(0)
                            .toUpperCase()}
                    </Avatar>
                    <Typography fontWeight="bold">
                        {recipe.createdBy?.username}
                    </Typography>
                </Stack>

                {/* IMAGE + INFO */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box
                            component="img"
                            src={
                                recipe.image ||
                                '/src/placeholder.webp'
                            }
                            alt={recipe.title}
                            sx={{
                                width: '100%',
                                height: 320,
                                objectFit: 'cover',
                                borderRadius: 3,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Typography variant="h4" fontWeight="bold">
                            {recipe.title}
                        </Typography>
                        <Typography color="text.secondary" mb={2}>
                            {recipe.description}
                        </Typography>

                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip
                                icon={<AccessTimeIcon />}
                                label={`${recipe.cookingTime} min`}
                            />
                            <Chip
                                icon={<RestaurantIcon />}
                                label={recipe.difficulty.toUpperCase()}
                            />
                            <Chip label={recipe.category} />
                            <Chip label={recipe.cuisine} />
                        </Stack>

                        <Stack direction="row" spacing={2} mt={2}>
                            <Button
                                variant={isFavourite ? 'contained' : 'outlined'}
                                color="error"
                                onClick={toggleSaveRecipe}
                            >
                                {isFavourite ? 'Added to Favourites' : 'Add to Favourites'}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={copyRecipeLink}
                            >
                                Copy Recipe Link
                            </Button>
                        </Stack>

                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* INGREDIENTS */}
                <Typography variant="h6" fontWeight="bold">
                    Ingredients
                </Typography>

                <Grid container spacing={2} mb={4}>
                    {recipe.ingredients.map((ing, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Paper sx={{ p: 2 }}>
                                <Typography fontWeight="medium">
                                    {ing.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {ing.quantity}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* STEPS */}
                <Typography variant="h6" fontWeight="bold">
                    Cooking Steps
                </Typography>

                <Stack spacing={2} mb={5}>
                    {recipe.steps.map((step, i) => (
                        <Paper key={i} sx={{ p: 2 }}>
                            <Typography fontWeight="bold">
                                Step {i + 1}
                            </Typography>
                            <Typography color="text.secondary">
                                {step.instruction}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* REVIEW FORM */}
                <Typography variant="h6" fontWeight="bold">
                    Rate & Review
                </Typography>

                {isOwnRecipe ? (
                    <Alert severity="info">
                        You cannot review your own recipe.
                    </Alert>
                ) : hasReviewed ? (
                    <Alert severity="info">
                        You have already reviewed this recipe.
                    </Alert>
                ) : (
                    <Stack spacing={2} maxWidth={500}>
                        <Rating
                            value={rating}
                            onChange={(e, v) => setRating(v)}
                            size="large"
                        />
                        <TextField
                            multiline
                            rows={3}
                            placeholder="Write your review..."
                            value={review}
                            onChange={(e) =>
                                setReview(e.target.value)
                            }
                        />
                        <Button
                            variant="contained"
                            onClick={handleReviewSubmit}
                            disabled={
                                !rating ||
                                !review ||
                                reviewLoading
                            }
                        >
                            {reviewLoading
                                ? 'Submitting...'
                                : 'Submit Review'}
                        </Button>
                    </Stack>
                )}

                <Divider sx={{ my: 4 }} />

                {/* REVIEWS LIST */}
                <Typography variant="h6" fontWeight="bold">
                    Reviews ({reviews.length})
                </Typography>

                {reviews.length === 0 ? (
                    <Typography color="text.secondary">
                        No reviews yet.
                    </Typography>
                ) : (
                    <Stack spacing={3}>
                        {reviews.map((r) => (
                            <Paper key={r._id} sx={{ p: 2 }}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Avatar src={r.user?.image}>
                                        {r.user?.username
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight="bold">
                                            {r.user?.username}
                                        </Typography>
                                        <Rating
                                            value={r.rating}
                                            readOnly
                                            size="small"
                                        />
                                    </Box>
                                </Stack>
                                <Typography mt={1}>
                                    {r.comment}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </MotionPaper>

            {/* SNACKBAR */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar({ ...snackbar, open: false })
                }
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default RecipeDetailPage;
