const jwt = require("jsonwebtoken");

const auths = (roles = []) => (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json("Access denied");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json("Forbidden");
        }

        next();
    } catch (err) {
        res.status(400).json("Invalid token");
    }
};

module.exports = auths;