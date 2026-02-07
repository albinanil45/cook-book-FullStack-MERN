import { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Box,
    useTheme,
    CircularProgress,
} from "@mui/material";
import {
    People,
    RestaurantMenu,
    SmartToy,
} from "@mui/icons-material";
import axios from "axios";

const StatCard = ({ title, value, icon: Icon, color }) => {
    const theme = useTheme();

    return (
        <Paper
            sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
            }}
            elevation={3}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>

                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: theme.palette[color].light,
                        color: theme.palette[color].main,
                    }}
                >
                    <Icon />
                </Box>
            </Box>

            <Typography variant="h4" fontWeight={600}>
                {value}
            </Typography>
        </Paper>
    );
};

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/overview", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* 🔹 Header */}
            <Box mb={3}>
                <Typography variant="h5" fontWeight={600}>
                    Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Overview of platform activity
                </Typography>
            </Box>

            {/* 🔹 Stats */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Users"
                        value={stats.users}
                        icon={People}
                        color="primary"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Recipes"
                        value={stats.recipes}
                        icon={RestaurantMenu}
                        color="success"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="AI Recipes"
                        value={stats.aiRecipes}
                        icon={SmartToy}
                        color="warning"
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default DashboardHome;
