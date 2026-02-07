import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    useTheme,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    RestaurantMenu as RecipeIcon,
    SmartToy as AiIcon,
    AdminPanelSettings as AdminIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminSidebar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [logoutOpen, setLogoutOpen] = useState(false);

    const navItemStyle = ({ isActive }) => ({
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(0.5, 1),
        backgroundColor: isActive ? theme.palette.grey[900] : "transparent",
    });

    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // if stored
        navigate("/login"); // or /admin-login
    };

    return (
        <>
            {/* 🔹 Admin Label */}
            <Box px={2} py={2} display="flex" alignItems="center" gap={1}>
                <AdminIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                    Admin Panel
                </Typography>
            </Box>

            <List>
                <ListItemButton
                    component={NavLink}
                    to="/admin-dashboard"
                    end
                    style={navItemStyle}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton
                    component={NavLink}
                    to="/admin-dashboard/users"
                    style={navItemStyle}
                >
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Users" />
                </ListItemButton>

                <ListItemButton
                    component={NavLink}
                    to="/admin-dashboard/recipes"
                    style={navItemStyle}
                >
                    <ListItemIcon>
                        <RecipeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Recipes" />
                </ListItemButton>

                <ListItemButton
                    component={NavLink}
                    to="/admin-dashboard/ai-recipes"
                    style={navItemStyle}
                >
                    <ListItemIcon>
                        <AiIcon />
                    </ListItemIcon>
                    <ListItemText primary="AI Recipes" />
                </ListItemButton>

                <ListItemButton
                    component={NavLink}
                    to="/admin-dashboard/complaints"
                    style={navItemStyle}
                >
                    <ListItemIcon>
                        <ReportProblemOutlinedIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary="View Complaints" />
                </ListItemButton>

                {/* 🔹 Divider before logout */}
                <Divider sx={{ my: 1 }} />

                {/* 🔹 Logout */}
                <ListItemButton
                    onClick={() => setLogoutOpen(true)}
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        margin: theme.spacing(0.5, 1),
                        color: theme.palette.error.main,
                    }}
                >
                    <ListItemIcon sx={{ color: "inherit" }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>

            {/* 🔻 Logout confirmation dialog */}
            <Dialog
                open={logoutOpen}
                onClose={() => setLogoutOpen(false)}
            >
                <DialogTitle>Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout from the admin panel?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        onClick={handleLogoutConfirm}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminSidebar;
