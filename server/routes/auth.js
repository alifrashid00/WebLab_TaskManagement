const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const bcrypt = require("bcryptjs");

// Simplified User Model (remove verification fields)
/*
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" }
});
*/


router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json("Email already exists");

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken
        });

        await user.save();

        // ✅ Optional: send verification email here

        res.status(201).json("Verification email sent!");
    } catch (err) {
        res.status(500).json(err.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json("User not found");

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json("Invalid credentials");

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


router.get("/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) return res.status(400).send("Invalid or expired token");

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send("Email verified successfully! You can now log in.");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;