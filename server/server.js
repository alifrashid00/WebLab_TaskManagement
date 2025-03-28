const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/admin"); // adjust path if needed
const User = require("./models/User")
const bcrypt = require("bcryptjs");



dotenv.config();

const app = express();

// ✅ Proper CORS setup
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const createDefaultAdmin = async () => {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
        console.log("✅ Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10); // or from env

    const admin = new User({
        username: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true
    });

    await admin.save();
    console.log("Default admin created: admin@example.com / admin123");
};



mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB error:", err));

app.use("/api/auth", auth);

app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

createDefaultAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
