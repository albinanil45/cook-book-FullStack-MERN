import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

    // 🔹 REGISTER
    const register = async (formData) => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Registration failed");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            setUser(data.user);

            return data;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 LOGIN
    const login = async (email, password) => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Login failed");
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            setUser(data.user);

            return data;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 GET CURRENT USER (auth user)
    const getCurrentUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            setLoading(true);

            const res = await fetch(
                "http://localhost:5000/api/auth/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                logout();
                return null;
            }

            const data = await res.json();
            console.log("Fetched current user:", data);
            setUser(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 GET USER BY ID (other users – return only)
    const getUserById = async (id) => {
        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:5000/api/auth/user/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch user");
            }

            return await res.json();
        } finally {
            setLoading(false);
        }
    };

    // 🔹 UPDATE PROFILE
    const updateProfile = async (updatedData, imageFile) => {
        try {
            setLoading(true);

            const imageUrl = await uploadProfileImage(imageFile);

            const payload = {
                name: updatedData.name,
                username: updatedData.username,
                image: imageUrl,
            };

            const res = await fetch(
                `http://localhost:5000/api/auth/user/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Profile update failed");
            }

            const data = await res.json();
            setUser(data);
            return data;
        } finally {
            setLoading(false);
        }
    };


    const uploadProfileImage = async (file) => {
        if (!file) return user?.image || "";

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("folder", "profiles");

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: "POST",
            body: data,
        });

        const result = await res.json();
        return result.secure_url;
    };



    // 🔹 LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                getCurrentUser,
                getUserById,
                updateProfile,
                uploadProfileImage,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }
    return context;
}
