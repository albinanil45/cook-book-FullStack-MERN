const express = require("express");
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Private (User)
 */
router.post("/", protect, async (req, res) => {
    try {
        const { content, referenceUrl } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Complaint content is required" });
        }

        const complaint = await Complaint.create({
            user: req.user._id,
            content,
            referenceUrl,
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/complaints/my
 * @desc    Get complaints submitted by logged-in user
 * @access  Private (User)
 */
router.get("/my", protect, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints
 * @access  Private (Admin)
 */
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a complaint
 * @access  Private (Admin)
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        await complaint.deleteOne();

        res.json({ message: "Complaint removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
