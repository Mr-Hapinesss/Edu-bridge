const express  = require('express');
const router   = express.Router();

const User            = require('../models/userSchema');
const generateToken   = require('../utils/generateToken');
const { getAllUsers }  = require('../controllers/userController');

// Single source of truth for auth middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { authorize }               = require('../middleware/roleMiddleware');


/* 
   PUBLIC ROUTES  (no token required)
 */

/*
POST /api/users/register
Creates a new user account.
Body: { name, email, password, role?, department?, gradeLevel? }
 */
router.post('/register', async (req, res) => {
    const { name, email, password, role, department, gradeLevel } = req.body;

    // Basic field validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        // Prevent duplicate accounts
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'An account with that email already exists.' });
        }

        // Create the user — password hashing is handled by the pre-save hook in UserSchema
        const user = await User.create({
            name,
            email,
            password,
            role:       role       || 'student',
            department: department || undefined,
            gradeLevel: gradeLevel || undefined,
        });

        // Respond with profile data and a signed JWT
        res.status(201).json({
            _id:        user._id,
            name:       user.name,
            email:      user.email,
            role:       user.role,
            department: user.department,
            gradeLevel: user.gradeLevel,
            token:      generateToken(user._id),
        });

    } catch (error) {
        // Mongoose validation errors surface here (e.g. missing gradeLevel for students)
        console.error('Registration error:', error.message);
        res.status(400).json({ message: error.message || 'Server error during registration.' });
    }
});


/**
 POST /api/users/login
 Authenticates a user and returns a JWT.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });

        // matchPassword is defined as an instance method on UserSchema
        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id:   user._id,
                name:  user.name,
                email: user.email,
                role:  user.role,
                token: generateToken(user._id),
            });
        }

        // Intentionally vague — don't reveal whether the email exists
        res.status(401).json({ message: 'Invalid email or password.' });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


/* 
   PROTECTED ROUTES — current user  (any authenticated user)
   IMPORTANT: These static paths (/me, /profile) MUST be declared before
   the parameterised /:id routes, otherwise Express will treat the literal
   strings "me" and "profile" as ID values.
 */

/*
 GET /api/users/profile
 Returns the authenticated user's profile.
 */
router.get('/profile', protect, (req, res) => {
    res.json({
        _id:        req.user._id,
        name:       req.user.name,
        email:      req.user.email,
        role:       req.user.role,
        department: req.user.department,
        gradeLevel: req.user.gradeLevel,
    });
});


/**
 GET /api/users/me
 Alias for /profile — returns the authenticated user's basic info.
 */
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        _id:   req.user._id,
        name:  req.user.name,
        email: req.user.email,
        role:  req.user.role,
    });
});


/*
 PUT /api/users/me
 Updates the authenticated user's own profile (name, email, password).
 Body (all optional): { name?, email?, password? }
 */
router.put('/me', protect, async (req, res) => {
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
});


/*
 DELETE /api/users/me
 Deletes the authenticated user's own account.
 Admins are blocked — they must be deleted by another admin via /:id.
 */
router.delete('/me', protect, async (req, res) => {
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
});


/* 
   PROTECTED ROUTES — admin / instructor actions
   Static paths like /approve-role/:id MUST come before the bare /:id routes.
*/

/*
  GET /api/users
  Returns all users. Admin and Instructor only.
 */
router.get('/', protect, authorizeRoles('admin', 'instructor'), getAllUsers);


/*
 PUT /api/users/approve-role/:id
 Promotes a user to 'instructor' or 'admin'. Admin only.
 Body: { newRole: 'instructor' | 'admin' }

 NOTE: This route MUST be declared before GET/DELETE /:id so Express does
 not interpret "approve-role" as a user ID.
 */
router.put('/approve-role/:id', protect, authorize('admin'), async (req, res) => {
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
});


/*
 GET /api/users/:id
 Fetches any user's profile by ID. Admin and Instructor only.
*/
router.get('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
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
});


/*
 DELETE /api/users/:id
 Deletes any user account by ID. Admin or Instructor only.
 Deletion hierarchy:
   - Only an Admin can delete another Admin.
   - Only an Admin can delete an Instructor.
   - Admins and Instructors can delete Students.
 */
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
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
});


module.exports = router;