const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
    const { name, username, email, password, image } = req.body;

    try {
        // validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // check username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            image: image || null, // Cloudinary URL
        });

        // generate token
        const token = jwt.sign(
            { id: user._id, },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                image: user.image,
            },
            token,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                userType: user.userType
            },

            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                userType: user.userType,
                status: user.status,
                email: user.email,
                image: user.image,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

/**
 * GET /api/auth/user/:id
 * Get user by ID
 */
router.get("/user/:id", protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
});

/**
 * PUT /api/auth/user/:id
 * Update user profile
 */
router.put("/user/:id", protect, async (req, res) => {
    try {
        // 🔐 Authorization check
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { name, username, email, image } = req.body;

        // 🔍 Check if username already exists for another user
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: req.params.id }, // exclude current user
            });

            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Username already taken" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                username,
                email,
                image,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



/**
 * GET /api/auth/me
 * Get currently logged-in user
 */
router.get("/me", protect, async (req, res) => {
    try {
        // req.user already attached by protect middleware
        res.json(req.user);
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: "Failed to fetch current user" });
    }
});

module.exports = router;
