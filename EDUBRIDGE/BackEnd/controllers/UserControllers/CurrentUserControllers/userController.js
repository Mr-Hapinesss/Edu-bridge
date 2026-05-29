const User = require('../../../models/userSchema');

const myProfile = (req, res) => {
    res.json({
        _id:        req.user._id,
        name:       req.user.name,
        email:      req.user.email,
        role:       req.user.role,
        department: req.user.department,
        gradeLevel: req.user.gradeLevel,
    });
};

const meProfile = (req, res) => {
    res.status(200).json({
        _id:   req.user._id,
        name:  req.user.name,
        email: req.user.email,
        role:  req.user.role,
    });
};

const updateProfile = async (req, res) => {
    const user = req.user;

    if (req.body.name)     user.name     = req.body.name;
    if (req.body.email)    user.email    = req.body.email;
    // Assigning a new password here triggers the pre-save bcrypt hook automatically
    if (req.body.password) user.password = req.body.password;

    try {
        const updatedUser = await user.save();

        res.status(200).json({
            _id:   updatedUser._id,
            name:  updatedUser.name,
            email: updatedUser.email,
            role:  updatedUser.role,
        });

    } catch (error) {
        console.error('Profile update error:', error.message);
        res.status(400).json({ message: error.message || 'Error updating profile.' });
    }
};

const deleteMyProfile = async (req, res) => {
    // Prevent admins from accidentally self-deleting through this casual endpoint
    if (req.user.role === 'admin') {
        return res.status(403).json({
            message: 'Admins cannot self-delete. Another administrator must perform this action.',
        });
    }

    try {
        const result = await User.findByIdAndDelete(req.user._id);

        if (!result) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Account successfully deleted.' });

    } catch (error) {
        console.error('Self-delete error:', error.message);
        res.status(500).json({ message: 'Server error during account deletion.' });
    }
};

module.exports = {
    myProfile,
    meProfile,
    updateProfile,
    deleteMyProfile
}