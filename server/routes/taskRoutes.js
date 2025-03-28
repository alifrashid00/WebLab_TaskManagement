const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify JWT and extract user ID
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Unauthorized");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json("Invalid token");
    }
};

// Create task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.userId });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Get all tasks (with optional filters)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { priority, category, sortBy } = req.query;
        const filter = { user: req.userId };
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const sort = {};
        if (sortBy === "dueDate") sort.dueDate = 1;
        if (sortBy === "priority") sort.priority = 1;

        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Get single task
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json("Task not found");
        res.json(task);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        res.json("Task deleted");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
