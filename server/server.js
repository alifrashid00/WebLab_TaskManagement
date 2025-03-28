const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./routes/auth");

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

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB error:", err));

app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
