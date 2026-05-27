const jwt          = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User         = require('../models/userSchema');

// Pull secret from env; never hard-code a real secret in source
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}


/*
protect
   Validates the Bearer JWT sent in the Authorization header.
   On success, attaches the full user object (password excluded) to req.user
   and calls next(). On failure, throws — caught by express-async-handler and
   forwarded to the global error handler.
*/
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Reject immediately if no Bearer token is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('Not authorized — no token provided.');
    }

    // Extract the raw token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        // Verify signature and expiry
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch fresh user data (so revoked users can't keep using old tokens)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized — user no longer exists.');
        }

        next();

    } catch (error) {
        // Catches both JWT errors (expired, bad sig) and the throw above
        res.status(401);
        throw new Error('Not authorized — token is invalid or expired.');
    }
});


/*
 authorizeRoles
   Factory middleware — restricts a route to one or more named roles.
   Must run AFTER protect so that req.user is already available.
   Usage:
     router.get('/', protect, authorizeRoles('admin', 'instructor'), handler)

*/

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: role '${req.user.role}' is not permitted to perform this action.`,
            });
        }
        next();
    };
};


module.exports = { protect, authorizeRoles };