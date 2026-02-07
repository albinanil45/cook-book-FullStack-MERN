const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,

        username: {
            type: String,
            unique: true,
        },

        email: {
            type: String,
            unique: true,
        },

        password: String,

        image: {
            type: String,
        },

        savedRecipes: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
        ],

        // NEW: user type (user | admin)
        userType: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        // NEW: user status (active | blocked)
        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
