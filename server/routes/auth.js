const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Simplified User Model (remove verification fields)
/*
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" }
});
*/

// Register (No email verification)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;


        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json("Email already exists");

        // Create user directly
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json("Registration successful!");
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Login (No password encryption check)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json("User not found");

        // Direct password comparison (remove bcrypt)
        if (password !== user.password) return res.status(400).json("Invalid credentials");

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;