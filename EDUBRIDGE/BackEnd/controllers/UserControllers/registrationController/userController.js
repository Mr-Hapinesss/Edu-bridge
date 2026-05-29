const User = require('../../../models/userSchema');
const generateToken   = require('../../../utils/generateToken');

const register = async (req, res, next) => {
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
            success: true,
            data: {
            _id:        user._id,
            name:       user.name,
            email:      user.email,
            role:       user.role,
            department: user.department,
            gradeLevel: user.gradeLevel,
            token:      generateToken(user._id),
        }
    });

    } catch (error) {
        next(error); // Pass to global error handler
    }
};

const logIn = async (req, res) => {
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
};

module.exports = { 
    logIn,
    register
 };
