const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // 🔒 BLOCKED USER CHECK
            if (req.user.status === 'blocked') {
                return res.status(403).json({
                    message: 'Your account has been blocked. Please contact support.',
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }

    // No token
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }
};

module.exports = { protect };
