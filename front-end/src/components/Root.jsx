import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useUser } from "../context/UserContext";

const Root = () => {
    const token = localStorage.getItem("token");
    const { user, loading, getCurrentUser } = useUser();

    useEffect(() => {
        if (token && !user) {
            getCurrentUser();
        }
    }, [token, user]);

    // 🔹 No token → Landing
    if (!token) {
        return <Navigate to="/landing" replace />;
    }

    // 🔹 Fetching user
    if (loading || !user) {
        return (
            <Box
                height="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
                <Typography mt={2}>Checking your account...</Typography>
            </Box>
        );
    }

    // 🔹 Blocked user page
    if (user.status === "blocked") {
        return (
            <Box
                height="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                px={2}
            >
                <Typography variant="h4" color="error" gutterBottom>
                    Account Blocked 🚫
                </Typography>
                <Typography>
                    Your account has been blocked by the admin.
                    <br />
                    Please contact support for more information.
                </Typography>
            </Box>
        );
    }

    // 🔹 Admin user
    if (user.userType === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
    }

    // 🔹 Normal user
    return <Navigate to="/home" replace />;
};

export default Root;
