import { useEffect, useState } from "react";
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    CircularProgress,
    Stack,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Avatar,
    Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const token = localStorage.getItem("token");

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://cook-book-fullstack-mern.onrender.com/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Block user
    const blockUser = async (id) => {
        try {
            await axios.put(
                `https://cook-book-fullstack-mern.onrender.com/api/admin/users/${id}/block`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, status: "blocked" } : u))
            );
        } catch (error) {
            console.error("Failed to block user", error);
        }
    };

    // Unblock user
    const unblockUser = async (id) => {
        try {
            await axios.put(
                `https://cook-book-fullstack-mern.onrender.com/api/admin/users/${id}/unblock`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, status: "active" } : u))
            );
        } catch (error) {
            console.error("Failed to unblock user", error);
        }
    };

    // Filter users based on search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredUsers(
                users.filter(
                    (u) =>
                        u.name.toLowerCase().includes(term) ||
                        u.username.toLowerCase().includes(term) ||
                        u.email.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, users]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ p: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Manage Users
                </Typography>

                {/* Search bar */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar
                                        src={user.image || "/src/placeholder.webp"}
                                        alt={user.name}
                                    >
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell
                                    sx={{
                                        color: user.status === "blocked" ? "error.main" : "success.main",
                                        fontWeight: 500,
                                    }}
                                >
                                    {user.status}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {user.status === "active" ? (
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => blockUser(user._id)}
                                            >
                                                Block
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => unblockUser(user._id)}
                                            >
                                                Unblock
                                            </Button>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ManageUsers;
