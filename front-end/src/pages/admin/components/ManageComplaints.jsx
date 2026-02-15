import { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Stack,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Box,
    Tooltip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";

const ManageComplaints = () => {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("https://cook-book-fullstack-mern.onrender.com/api/complaints", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setComplaints(Array.isArray(data) ? data : data.complaints || []);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to load complaints",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://cook-book-fullstack-mern.onrender.com/api/complaints/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setComplaints((prev) => prev.filter((c) => c._id !== deleteId));

            setSnackbar({
                open: true,
                message: "Complaint deleted successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to delete complaint",
                severity: "error",
            });
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Manage Complaints
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={6}>
                    <CircularProgress />
                </Box>
            ) : complaints.length === 0 ? (
                <Typography align="center" mt={6} color="text.secondary">
                    No complaints found
                </Typography>
            ) : (
                <Stack spacing={3}>
                    {complaints.map((complaint) => (
                        <Paper
                            key={complaint._id}
                            elevation={3}
                            sx={{ p: 2.5, borderRadius: 3 }}
                        >
                            {/* Header: user info + Delete button */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="start"
                                mb={1}
                                flexWrap="wrap"
                            >
                                <Box>
                                    <Typography
                                        fontWeight={600}
                                        sx={{ cursor: complaint.user?._id ? "pointer" : "default" }}
                                        onClick={() => {
                                            if (complaint.user?._id) {
                                                navigate(`/users/${complaint.user._id}`);
                                            }
                                        }}
                                    >
                                        {complaint.user?.name || "Unknown User"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {complaint.user?.email || "-"}
                                    </Typography>
                                </Box>

                                {/* Delete button on the right */}
                                <Box display="flex" alignItems="start" mt={{ xs: 1, sm: 0 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteOutlineIcon />}
                                        onClick={() => setDeleteId(complaint._id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            {/* Complaint content */}
                            <Typography mb={1}>{complaint.content}</Typography>

                            {/* Timestamp below content */}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                mb={1}
                                display="block"
                            >
                                {new Date(complaint.createdAt).toLocaleString()}
                            </Typography>

                            {/* Reference button */}
                            {complaint.referenceUrl && (
                                <Tooltip title="Open reference">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() =>
                                            window.open(complaint.referenceUrl, "_blank")
                                        }
                                        startIcon={<OpenInNewIcon fontSize="small" />}
                                    >
                                        Reference
                                    </Button>
                                </Tooltip>
                            )}
                        </Paper>
                    ))}
                </Stack>
            )}

            {/* Delete Confirmation */}
            <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Complaint</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this complaint?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ManageComplaints;
