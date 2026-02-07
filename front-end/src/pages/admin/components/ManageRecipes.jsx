import { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box,
    TextField,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const ManageRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/recipes");
            setRecipes(res.data);
            setFilteredRecipes(res.data);
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // Filter recipes when searchTerm changes
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRecipes(recipes);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredRecipes(
                recipes.filter(
                    (r) =>
                        r.title.toLowerCase().includes(term) ||
                        (r.createdBy?.username?.toLowerCase() || "").includes(term)
                )
            );
        }
    }, [searchTerm, recipes]);

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/api/admin/recipes/${selectedId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecipes((prev) => prev.filter((r) => r._id !== selectedId));
            setFilteredRecipes((prev) => prev.filter((r) => r._id !== selectedId));
        } catch (error) {
            console.error("Failed to delete recipe", error);
        } finally {
            setOpen(false);
            setSelectedId(null);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Manage Recipes
            </Typography>

            {/* Search bar */}
            <Box mb={2} maxWidth={400}>
                <TextField
                    fullWidth
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

            <Grid container spacing={3}>
                {filteredRecipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                        <Card
                            sx={{
                                width: 300, // fixed width
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                overflow: "hidden",
                            }}
                            onClick={() => navigate(`/recipes/${recipe._id}`)}
                        >
                            {recipe.image && (
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={recipe.image}
                                    alt={recipe.title}
                                    sx={{ objectFit: "cover" }}
                                />
                            )}

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    noWrap
                                    title={recipe.title}
                                >
                                    {recipe.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                    title={`Author: ${recipe.createdBy?.username || "Unknown"}`}
                                >
                                    Author: {recipe.createdBy?.username || "Unknown"}
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={(e) => handleDeleteClick(e, recipe._id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete confirmation dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete Recipe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this recipe? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageRecipes;
