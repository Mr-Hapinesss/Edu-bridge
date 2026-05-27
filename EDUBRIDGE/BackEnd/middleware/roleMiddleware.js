/*
authorize(...allowedRoles)

Factory middleware that restricts a route to specific roles.
MUST be used AFTER the `protect` middleware, which attaches req.user.

 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        // Guard: protect middleware must have run first
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: 'Not authorized — user session missing. Ensure protect middleware runs first.',
            });
        }

        // Allow if the user's role appears in the whitelist
        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        // Role exists but isn't permitted for this route
        return res.status(403).json({
            message: `Forbidden: role '${req.user.role}' is not permitted to perform this action.`,
        });
    };
};

module.exports = { authorize };