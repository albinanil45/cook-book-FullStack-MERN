import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Paper,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const MotionCard = motion(Card);

const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });


    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');

            const userRes = await axios.get(
                `http://localhost:5000/api/auth/user/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const recipeRes = await axios.get(
                `http://localhost:5000/api/recipes/user/${id}`
            );

            setUser(userRes.data);
            setRecipes(recipeRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyProfileLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setSnackbar({
                open: true,
                message: 'Profile link copied to clipboard',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to copy profile link',
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

    return (
        <Box maxWidth="lg" mx="auto" px={2} py={4}>
            {/* BACK BUTTON */}
            <Tooltip title="Go back">
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                            backgroundColor: 'grey.100',
                        },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            </Tooltip>

            {/* PROFILE HEADER */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    mb: 5,
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={4}
                    flexWrap="wrap"
                >
                    <Avatar
                        src={user.image || ''}
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: 42,
                        }}
                    >
                        {user.name?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h5" fontWeight="bold">
                                {user.name}
                            </Typography>

                            <Tooltip title="Copy profile link">
                                <IconButton size="small" onClick={copyProfileLink}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>


                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            gutterBottom
                        >
                            @{user.username}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="body2">
                            🍽️ {recipes.length} Recipes shared
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* RECIPES */}
            <Typography variant="h6" fontWeight="bold" mb={3}>
                Recipes by {user.name}
            </Typography>

            <Grid container spacing={3}>
                {recipes.map((recipe, index) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                        <MotionCard
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                            }}
                            sx={{
                                borderRadius: 3,
                                cursor: 'pointer',
                                boxShadow: 3,
                            }}
                            onClick={() =>
                                navigate(`/recipes/${recipe._id}`)
                            }
                        >
                            <CardMedia
                                component="img"
                                height="190"
                                image={
                                    recipe.image && recipe.image.trim() !== ''
                                        ? recipe.image
                                        : '/src/placeholder.webp'
                                }
                                alt={recipe.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        '/recipe-placeholder.webp';
                                }}
                            />

                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    noWrap
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
                                >
                                    {recipe.description}
                                </Typography>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>
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

export default UserProfilePage;
