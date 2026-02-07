require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipeRoutes");
const aiRecipeRoutes = require('./routes/aiRecipe');
const adminRoutes = require("./routes/adminRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use('/api/ai', aiRecipeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);


// db + server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
