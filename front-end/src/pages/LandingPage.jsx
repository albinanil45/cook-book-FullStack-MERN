import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Stack,
    IconButton,
    useTheme
} from '@mui/material';
import {
    AutoAwesome,
    Favorite,
    Star,
    RestaurantMenu,
    Search
} from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const features = [
        {
            title: "AI Recipe Generator",
            desc: "Turn your leftover ingredients into a gourmet meal using our AI engine.",
            icon: <AutoAwesome color="primary" fontSize="large" />
        },
        {
            title: "Global Cookbook",
            desc: "Explore thousands of recipes from diverse cultures and cuisines.",
            icon: <RestaurantMenu color="primary" fontSize="large" />
        },
        {
            title: "Rate & Review",
            desc: "Share your culinary experience and help others find the best tastes.",
            icon: <Star color="primary" fontSize="large" />
        }
    ];

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Navbar */}
            <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        Cook Book
                    </Typography>
                    <Button color="inherit" sx={{ color: 'text.primary' }} onClick={() => navigate('/login')}>Login</Button>
                    <Button variant="contained" sx={{ ml: 2, borderRadius: 2 }} onClick={() => navigate('/register')}>Register</Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box sx={{
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                pt: 10, pb: 10,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`
            }}>
                <Container maxWidth="md">
                    <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 800 }}>
                        Master Your Kitchen with AI
                    </Typography>
                    <Typography variant="h5" align="center" paragraph sx={{ opacity: 0.9 }}>
                        The all-in-one platform to explore recipes, save your favorites, and generate meals based on what's in your fridge.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Button variant="contained" size="large" sx={{ bgcolor: 'primary.contrastText', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }} onClick={() => navigate('/register')}>
                            Get Started
                        </Button>
                        {/* <Button variant="outlined" size="large" sx={{ color: 'background.paper', borderColor: 'background.paper' }}>
                            View Demo
                        </Button> */}
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box sx={{ textAlign: 'center', p: 3 }}>
                                {feature.icon}
                                <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {feature.desc}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 6, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Cook Book AI. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;