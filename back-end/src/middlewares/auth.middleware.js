
const jwt = require('jsonwebtoken');
const config = require('../../config');
const UserModel = require('../models/user.model');

const AuthMiddleware = {
    verifyToken: async (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], config.accessTokenSecret);
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
    },
    verifyRole: (roles) => {
        return (req, res, next) => {
            const userRole = req.user.role;
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
            }
            next();
        }
    },

    verifyEmailVerification: (req, res, next) => {
        if (!req.user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }
        next();
    }
};

module.exports = AuthMiddleware;
