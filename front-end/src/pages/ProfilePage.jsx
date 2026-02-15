import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Card,
    Snackbar,
    Alert,
    Grid,
    CardContent,
    CardActions,
    CardMedia,
    Fade,
    Grow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import placeholder from "/src/placeholder.webp";

export default function ProfilePage() {
    const { user, loading, getCurrentUser, updateProfile } = useUser();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({ name: "", username: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [recipes, setRecipes] = useState([]);
    const [loadingRecipes, setLoadingRecipes] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({
        open: false,
        recipeId: null,
    });
    const [deleting, setDeleting] = useState(false);

    // Fetch current user
    useEffect(() => {
        if (!user) getCurrentUser();
    }, []);

    // Populate form and fetch recipes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
            });
            setImagePreview(user.image || "");
            fetchUserRecipes();
        }
    }, [user]);

    const fetchUserRecipes = async () => {
        if (!user) return;
        try {
            setLoadingRecipes(true);
            const res = await fetch(
                `https://cook-book-fullstack-mern.onrender.com/api/recipes/user/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch recipes");
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        } finally {
            setLoadingRecipes(false);
        }
    };

    const handleImagePick = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleConfirmSave = async () => {
        try {
            setSaving(true);
            await updateProfile(formData, imageFile);
            setSnackbar({
                open: true,
                message: "Profile updated successfully",
                severity: "success",
            });
            setEditMode(false);
            setOpenConfirm(false);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || "Failed to update profile",
                severity: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRecipe = async () => {
        try {
            setDeleting(true);
            const res = await fetch(
                `http://localhost:5000/api/recipes/${deleteConfirm.recipeId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to delete recipe");
            setSnackbar({ open: true, message: "Recipe deleted successfully", severity: "success" });
            setDeleteConfirm({ open: false, recipeId: null });
            fetchUserRecipes();
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        } finally {
            setDeleting(false);
        }
    };

    if (loading || !user) {
        return (
            <Box mt={6} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Back Button */}
            <Box mt={2} ml={2}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>

            {/* Main Layout */}
            <Box mt={2} display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4} mx="auto" maxWidth={1200} px={2}>
                {/* Profile Section */}
                <Grow in timeout={600}>
                    <Card sx={{ p: 4, flex: "1 1 300px", borderRadius: 3, boxShadow: 4 }}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6">My Profile</Typography>
                            {!editMode && (
                                <IconButton onClick={() => setEditMode(true)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                            <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 1 }} />
                            {editMode && (
                                <Button component="label" variant="outlined" size="small">
                                    Change Photo
                                    <input hidden type="file" accept="image/*" onChange={handleImagePick} />
                                </Button>
                            )}
                        </Box>

                        {!editMode ? (
                            <>
                                <Typography><b>Name:</b> {user.name}</Typography>
                                <Typography mt={1}><b>Username:</b> @{user.username}</Typography>
                                <Typography mt={1}><b>Email:</b> {user.email}</Typography>
                            </>
                        ) : (
                            <>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    margin="normal"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <TextField
                                    label="Username"
                                    fullWidth
                                    margin="normal"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                                <TextField label="Email" fullWidth margin="normal" value={user.email} disabled />
                                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setOpenConfirm(true)}>
                                    Save Changes
                                </Button>
                                <Button fullWidth sx={{ mt: 1 }} onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </Card>
                </Grow>

                {/* Recipes Section */}
                <Fade in timeout={800}>
                    <Box flex="3 1 600px">
                        <Typography variant="h6" mb={2}>My Recipes</Typography>
                        {loadingRecipes ? (
                            <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                        ) : recipes.length === 0 ? (
                            <Typography>No recipes posted yet.</Typography>
                        ) : (
                            <Grid container spacing={3}>
                                {recipes.map((r, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={r._id}>
                                        <Grow in timeout={600 + idx * 100}>
                                            <Card
                                                sx={{
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    ":hover": { boxShadow: 8, transform: "scale(1.02)" },
                                                    transition: "all 0.3s ease",
                                                }}
                                                onClick={() => navigate(`/recipes/${r._id}`)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={r.image || placeholder}
                                                    alt={r.title}
                                                />
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight={600}>{r.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {r.category} | {r.cuisine}
                                                    </Typography>
                                                    <Typography variant="body2" mt={0.5}>Cooking: {r.cookingTime} mins</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm({ open: true, recipeId: r._id });
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grow>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Fade>
            </Box>

            {/* Profile Update Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>Are you sure you want to update your profile?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmSave} disabled={saving}>
                        {saving ? "Saving..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Recipe Dialog */}
            <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, recipeId: null })}>
                <DialogTitle>Delete Recipe</DialogTitle>
                <DialogContent>Are you sure you want to delete this recipe?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ open: false, recipeId: null })}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteRecipe} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
