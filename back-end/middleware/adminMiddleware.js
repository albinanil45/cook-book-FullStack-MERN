const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.status === "blocked") {
        return res.status(403).json({ message: "Your account is blocked" });
    }

    if (req.user.userType !== "admin") {
        return res.status(403).json({ message: "Admins only" });
    }

    next();
};

module.exports = { adminOnly };
