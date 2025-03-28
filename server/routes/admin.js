const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Unauthorized");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json("Invalid token");
    }
};


const adminOnly = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json("Access denied");
    }
    next();
};


router.get("/users", authMiddleware, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}, "username email role isVerified");
        res.json(users);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
