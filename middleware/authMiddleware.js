const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token required"
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


const farmerOnly = (req, res, next) => {
    if (req.user.role !== "farmer") {
        return res.status(403).json({
            message: "Only farmers can perform this action"
        });
    }

    next();
};


module.exports = {
    protect,
    farmerOnly
};