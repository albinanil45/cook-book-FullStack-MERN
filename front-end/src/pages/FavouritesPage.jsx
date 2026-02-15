import * as React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Stack,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert,
    Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useFavourites } from '../context/FavouriteContext';
import { useUser } from '../context/UserContext';

const MotionCard = motion(Card);

const FavouritesPage = () => {
    const navigate = useNavigate();
    const { user, getCurrentUser } = useUser();
    const { favourites, toggleFavourite } = useFavourites();

    const [recipes, setRecipes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'info',
    });

    /* Fetch user */
    React.useEffect(() => {
        if (!user) getCurrentUser();
    }, [user]);

    /* Fetch favourite recipes */
    React.useEffect(() => {
        if (!user) return;

        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const recipePromises = favourites.map((id) =>
                    fetch(`https://cook-book-fullstack-mern.onrender.com/api/recipes/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }).then((res) => res.json())
                );

                const data = await Promise.all(recipePromises);
                setRecipes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (favourites.length > 0) {
            fetchRecipes();
        } else {
            setRecipes([]);
            setLoading(false); // ✅ critical fix
        }
    }, [favourites, user]);

    const handleRemoveFavourite = async (recipeId) => {
        try {
            await toggleFavourite(recipeId);
            setSnackbar({
                open: true,
                message: 'Removed from favourites',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || 'Something went wrong',
                severity: 'error',
            });
        }
    };

    /* Loading state */
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    /* Empty favourites */
    /* Empty favourites */
    if (recipes.length === 0) {
        return (
            <Box p={3} maxWidth="1200px" mx="auto">
                {/* Back button */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 4 }}
                >
                    Back
                </Button>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    mt={6}
                >
                    <FavoriteBorderIcon
                        color="disabled"
                        sx={{ fontSize: 80, mb: 2 }}
                    />

                    <Typography variant="h6" color="text.secondary">
                        You haven’t favourited any recipes yet
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Start exploring and save your favourite ones ❤️
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/recipes')}
                    >
                        Browse Recipes
                    </Button>
                </Box>
            </Box>
        );
    }


    return (
        <Box p={3} maxWidth="1200px" mx="auto">
            {/* Back button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Typography variant="h4" fontWeight="bold" mb={3}>
                Your Favourites
            </Typography>

            <Grid container spacing={3}>
                {recipes.map((recipe, index) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                        <MotionCard
                            whileHover={{ scale: 1.04 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            sx={{
                                width: 300,
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: 3,
                                position: 'relative',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            onClick={() => navigate(`/recipes/${recipe._id}`)}
                        >
                            {/* Remove favourite */}
                            <IconButton
                                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFavourite(recipe._id);
                                }}
                            >
                                <FavoriteIcon color="error" />
                            </IconButton>

                            {/* User header */}
                            <CardContent sx={{ pb: 1 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar
                                        src={recipe.createdBy?.image || '/src/placeholder.webp'}
                                        alt={recipe.createdBy?.username}
                                        sx={{ width: 36, height: 36 }}
                                    >
                                        {recipe.createdBy?.username?.charAt(0)?.toUpperCase()}
                                    </Avatar>

                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        sx={{
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: 180,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/users/${recipe.createdBy._id}`);
                                        }}
                                    >
                                        {recipe.createdBy?.username}
                                    </Typography>
                                </Stack>
                            </CardContent>

                            {/* Image */}
                            <CardMedia
                                component="img"
                                height="180"
                                image={recipe.image || '/src/placeholder.webp'}
                                alt={recipe.title}
                                sx={{ objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/src/placeholder.webp';
                                }}
                            />

                            {/* Recipe info */}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    noWrap
                                    title={recipe.title}
                                >
                                    {recipe.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                    title={recipe.description}
                                >
                                    {recipe.description}
                                </Typography>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

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
        </Box>
    );
};

export default FavouritesPage;
