const jwt = require('jsonwebtoken');

const AuthCheck = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies?.token;
        const redirectPath = requiredRole === 'admin'
            ? '/admin/login'
            : requiredRole === 'manager'
                ? '/manager/login'
                : '/login';

        if (!token) {
            console.log('not logged in please login first');
            return res.redirect(redirectPath);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            if (requiredRole && decoded.role !== requiredRole) {
                return res.redirect(redirectPath);
            }
            req.user = decoded;
            return next();
        } catch (err) {
            console.log('Authentication error:', err.message);
            return res.redirect(redirectPath);
        }
    };
};

module.exports = AuthCheck;