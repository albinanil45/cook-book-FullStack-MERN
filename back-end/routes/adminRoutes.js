const express = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const AiRecipe = require("../models/AiRecipe"); // adjust if needed
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @route   GET /api/admin/overview
 * @desc    Admin dashboard overview stats
 * @access  Admin only
 */
router.get("/overview", protect, adminOnly, async (req, res) => {
    try {
        const [
            totalUsers,
            totalRecipes,
            totalAiRecipes,
        ] = await Promise.all([
            User.countDocuments(),
            Recipe.countDocuments(),
            AiRecipe.countDocuments(),
        ]);

        res.json({
            users: totalUsers,
            recipes: totalRecipes,
            aiRecipes: totalAiRecipes,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/admin/users/:id/block
 * @desc    Block a user
 * @access  Admin only
 */
router.put("/users/:id/block", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status === "blocked") {
            return res.status(400).json({ message: "User is already blocked" });
        }

        user.status = "blocked";
        await user.save();

        res.json({
            message: "User blocked successfully",
            userId: user._id,
            status: user.status,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/admin/users/:id/unblock
 * @desc    Unblock a user
 * @access  Admin only
 */
router.put("/users/:id/unblock", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status === "active") {
            return res.status(400).json({ message: "User is already active" });
        }

        user.status = "active";
        await user.save();

        res.json({
            message: "User unblocked successfully",
            userId: user._id,
            status: user.status,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/admin/recipes/:id
 * @desc    Admin delete ANY recipe
 * @access  Admin only
 */
router.delete("/recipes/:id", protect, adminOnly, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        await recipe.deleteOne();

        res.json({
            message: "Recipe deleted successfully by admin",
            recipeId: recipe._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users except logged-in admin
 * @access  Admin only
 */
router.get("/users", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id }, // exclude current user
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/admin/ai-recipes
 * @desc    Get all AI recipes
 * @access  Admin only
 */
router.get("/ai-recipes", protect, adminOnly, async (req, res) => {
    try {
        const aiRecipes = await AiRecipe.find()
            .populate("createdBy", "username")
            .sort({ createdAt: -1 });

        res.json(aiRecipes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/admin/ai-recipes/:id
 * @desc    Admin delete ANY AI recipe
 * @access  Admin only
 */
router.delete("/ai-recipes/:id", protect, adminOnly, async (req, res) => {
    try {
        const recipe = await AiRecipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: "AI recipe not found" });
        }

        await recipe.deleteOne();

        res.json({
            message: "AI recipe deleted successfully",
            recipeId: recipe._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;


module.exports = router;
