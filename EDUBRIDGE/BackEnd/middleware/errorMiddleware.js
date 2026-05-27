/*
 notFound
 Catches any request that didn't match a defined route and
 forwards it as a 404 error to the generic error handler below.
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found — ${req.originalUrl}`);
    res.status(404);
    next(error);
};


/*
 errorHandler
 Global error handler. Must be registered LAST in server.js after all routes.
 Formats every thrown/next(error) into a consistent JSON response.

 Also intercepts common Mongoose errors and maps them to appropriate HTTP codes
 so they don't masquerade as 500s.
 */
const errorHandler = (err, req, res, next) => {
    // Mongoose: malformed ObjectId (e.g. /api/users/not-a-real-id)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ID format: ${err.value}` });
    }

    // Mongoose: schema validation failed (required field missing, enum mismatch, etc.)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join('. ') });
    }

    // Mongoose: unique index violation (duplicate key)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `Duplicate value for field: '${field}'.` });
    }

    // JWT verification failure — express-async-handler re-throws these
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized — invalid or expired token.' });
    }

    // Fall back: use whatever status code was set before the throw, default to 500
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message || 'An unexpected server error occurred.',
        // Expose stack trace only during development
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};


module.exports = { notFound, errorHandler };