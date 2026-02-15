import { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
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

const CARD_WIDTH = 280;

const ManageAiRecipes = () => {
    const [aiRecipes, setAiRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Fetch AI recipes (admin)
    const fetchAiRecipes = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://cook-book-fullstack-mern.onrender.com/api/admin/ai-recipes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAiRecipes(res.data);
            setFilteredRecipes(res.data);
        } catch (error) {
            console.error("Failed to fetch AI recipes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAiRecipes();
    }, []);

    // Filter recipes
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRecipes(aiRecipes);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredRecipes(
                aiRecipes.filter(
                    (r) =>
                        r.title.toLowerCase().includes(term) ||
                        (r.createdBy?.username?.toLowerCase() || "").includes(term)
                )
            );
        }
    }, [searchTerm, aiRecipes]);

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(
                `https://cook-book-fullstack-mern.onrender.com/api/admin/ai-recipes/${selectedId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAiRecipes((prev) => prev.filter((r) => r._id !== selectedId));
            setFilteredRecipes((prev) => prev.filter((r) => r._id !== selectedId));
        } catch (error) {
            console.error("Failed to delete AI recipe", error);
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
                Manage AI Recipes
            </Typography>

            {/* Search bar */}
            <Box mb={2} maxWidth={400}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search AI recipes..."
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
                    <Grid
                        item
                        key={recipe._id}
                        sx={{
                            width: CARD_WIDTH,
                            maxWidth: CARD_WIDTH,
                            flexGrow: 0,
                        }}
                    >
                        <Card
                            onClick={() => navigate(`/generated-ai-recipes/${recipe._id}`)}
                            sx={{
                                width: CARD_WIDTH,
                                height: 180,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                borderRadius: 3,
                                transition: "all 0.25s ease",
                                boxShadow: 2,
                                "&:hover": {
                                    boxShadow: 6,
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    noWrap
                                    sx={{
                                        mb: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {recipe.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    👤 {recipe.createdBy?.username || "Unknown"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    📅 {new Date(recipe.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>

                            <CardActions
                                sx={{
                                    px: 2,
                                    pb: 2,
                                    justifyContent: "space-between",
                                    borderTop: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={(e) => handleDeleteClick(e, recipe._id)}
                                >
                                    Delete
                                </Button>

                                <Button size="small" variant="text" color="primary">
                                    View →
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete confirmation dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete AI Recipe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this AI recipe? This action cannot be undone.
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

export default ManageAiRecipes;
