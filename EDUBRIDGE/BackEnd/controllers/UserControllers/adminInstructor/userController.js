const User = require('../../../models/userSchema');
const asyncHandler = require('express-async-handler');

const getAllUsers = asyncHandler(async (req, res) => {
    // Find all users, but exclude the password field
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
});

 // Promotes a user to 'instructor' or 'admin'. Admin only.
 // NOTE: This route MUST be declared before GET/DELETE /:id so Express does not interpret "approve-role" as a user ID.

const approveRole = async (req, res) => {
    const { newRole } = req.body;
    const allowedRoles = ['instructor', 'admin'];

    if (!newRole || !allowedRoles.includes(newRole)) {
        return res.status(400).json({
            message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}.`,
        });
    }

    try {
        const targetUser = await User.findById(req.params.id).select('-password');

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        targetUser.role = newRole;
        await targetUser.save();

        res.status(200).json({
            message: `${targetUser.email} has been promoted to '${newRole}'.`,
            user: { _id: targetUser._id, name: targetUser.name, role: targetUser.role },
        });

    } catch (error) {
        console.error('Role approval error:', error.message);
        res.status(500).json({ message: 'Server error during role update.' });
    }
};

// Fetches user profile by id. admin and instructor only
const fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        // Malformed ObjectId (e.g. /api/users/not-an-id)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        console.error('Fetch user error:', error.message);
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
};

// Deletes any user account by ID. Admin or Instructor only.
const deleteUserById = async (req, res) => {
    const callerRole = req.user.role;

    try {
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Enforce deletion hierarchy
        if (targetUser.role === 'admin' && callerRole !== 'admin') {
            return res.status(403).json({ message: 'Only an Admin can delete another Admin.' });
        }
        if (targetUser.role === 'instructor' && callerRole !== 'admin') {
            return res.status(403).json({ message: 'Only an Admin can delete an Instructor.' });
        }

        await targetUser.deleteOne();

        res.status(200).json({
            message: `User '${targetUser.name}' (${targetUser.role}) has been deleted.`,
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
        console.error('Delete user error:', error.message);
        res.status(500).json({ message: 'Server error during deletion.' });
    }
}

module.exports = { 
    getAllUsers,
    approveRole,
    fetchUserById,
    deleteUserById
 };