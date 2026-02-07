import * as React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Fade,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Avatar,
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import ResponsiveLayout from '../components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { useUser } from '../context/UserContext';
import { useFavourites } from '../context/FavouriteContext';
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const MotionCard = motion(Card);

const HomePage = () => {
    const navigate = useNavigate();
    const { getRecipes, recipes, loading } = useRecipe();
    const { logout } = useUser();
    const { favourites, toggleFavourite } = useFavourites();

    const [logoutOpen, setLogoutOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredRecipes, setFilteredRecipes] = React.useState([]);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

    // Fetch recipes
    React.useEffect(() => {
        getRecipes();
    }, []);

    // Filter recipes
    React.useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRecipes(recipes);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredRecipes(
                recipes.filter((recipe) =>
                    recipe.title.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, recipes]);

    // Logout
    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/landing');
    };

    // Handle save/unsave with snackbar for unauthenticated users
    const handleToggleFavourite = async (recipeId) => {
        try {
            await toggleFavourite(recipeId);
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Login to save recipes',
                severity: 'warning',
            });
        }
    };

    const drawerContent = (
        <Box>
            <Toolbar>
                <Typography variant="h6" fontWeight="bold">
                    Cook Book
                </Typography>
            </Toolbar>

            <Divider />

            <List>
                {/* Profile */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/profile")}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </ListItem>

                {/* Add Recipe */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/add-recipe")}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Recipe" />
                    </ListItemButton>
                </ListItem>

                {/* AI Recipe Generator */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/ai-recipe-generate")}>
                        <ListItemIcon>
                            <AutoAwesomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="AI Recipe Generator" />
                    </ListItemButton>
                </ListItem>

                {/* Saved AI Recipes */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => navigate("/generated-ai-recipes")}
                    >
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Saved AI Recipes" />
                    </ListItemButton>
                </ListItem>

                {/* Favourites */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/favourites")}>
                        <ListItemIcon>
                            <FavoriteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Favourites" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                {/* Report an Issue */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/report-issue")}>
                        <ListItemIcon>
                            <ReportProblemOutlinedIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText primary="Report an Issue" />
                    </ListItemButton>
                </ListItem>

                {/* Logout */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setLogoutOpen(true)}>
                        <ListItemIcon>
                            <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{ color: "error" }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );


    return (
        <ResponsiveLayout drawerContent={drawerContent}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Recipes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Discover delicious homemade recipes 🍽️
                </Typography>

                <Box mt={2} maxWidth={400}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={6}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && filteredRecipes.length === 0 && (
                <Fade in>
                    <Typography color="text.secondary">
                        No recipes found.
                    </Typography>
                </Fade>
            )}

            <Grid container spacing={3}>
                {filteredRecipes.map((recipe, index) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                        <MotionCard
                            whileHover={{ scale: 1.04 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            sx={{
                                width: 300,           // 🔒 fixed width for all cards
                                height: '100%',       // full height in grid
                                borderRadius: 3,
                                boxShadow: 3,
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            onClick={() => navigate(`/recipes/${recipe._id}`)}
                        >
                            {/* SAVE BUTTON */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    zIndex: 2,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavourite(recipe._id);
                                }}
                            >
                                {favourites.includes(recipe._id) ? (
                                    <FavoriteIcon color="error" />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                            </IconButton>

                            {/* USER HEADER */}
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
                                            maxWidth: 180, // truncate username if too long
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

                            {/* RECIPE IMAGE */}
                            <CardMedia
                                component="img"
                                height="180"
                                image={
                                    recipe.image && recipe.image.trim() !== ''
                                        ? recipe.image
                                        : '/src/placeholder.webp'
                                }
                                alt={recipe.title}
                                sx={{ objectFit: 'cover' }} // ensure consistent image fit
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/src/placeholder.webp';
                                }}
                            />

                            {/* RECIPE INFO */}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    noWrap
                                    title={recipe.title} // show full title on hover
                                >
                                    {recipe.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,  // show only 2 lines of description
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                    title={recipe.description} // full description on hover
                                >
                                    {recipe.description}
                                </Typography>
                            </CardContent>
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>

            {/* LOGOUT DIALOG */}
            <Dialog
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleLogoutConfirm}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
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
        </ResponsiveLayout>
    );
};

export default HomePage;
