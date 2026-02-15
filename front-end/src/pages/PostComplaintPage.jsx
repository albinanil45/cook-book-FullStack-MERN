import { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Snackbar,
    Alert,
    IconButton,
    Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostComplaintPage = () => {
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [referenceUrl, setReferenceUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setSnackbar({
                open: true,
                message: "Issue description cannot be empty",
                severity: "error",
            });
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                "https://cook-book-fullstack-mern.onrender.com/api/complaints",
                { content, referenceUrl },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setSnackbar({
                open: true,
                message: "Issue reported successfully",
                severity: "success",
            });

            setContent("");
            setReferenceUrl("");
        } catch (error) {
            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to report the issue",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: 4,
                    borderRadius: 3,
                }}
            >
                {/* Header */}
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={600} ml={1}>
                        Report an Issue
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Found something wrong? Report a recipe, user, or any issue
                    you’ve encountered.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Issue Description"
                            placeholder="Describe the issue in detail..."
                            multiline
                            rows={4}
                            fullWidth
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <TextField
                            label="Reference URL (optional)"
                            placeholder="Recipe link / User profile link"
                            fullWidth
                            value={referenceUrl}
                            onChange={(e) =>
                                setReferenceUrl(e.target.value)
                            }
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                            }}
                        >
                            {loading ? "Submitting..." : "Report Issue"}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
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

export default PostComplaintPage;
