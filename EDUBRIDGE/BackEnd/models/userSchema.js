const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');


const UserSchema = new mongoose.Schema(
    {
        name: {
            type:     String,
            required: [true, 'Name is required'],
            trim:     true,
        },

        email: {
            type:     String,
            required: [true, 'Email is required'],
            unique:   true,
            trim:     true,
            lowercase: true,
        },

        password: {
            type:     String,
            required: [true, 'Password is required'],
            minlength: 6,
        },

        role: {
            type:     String,
            enum:     ['student', 'instructor', 'admin'],
            default:  'student',
            required: true,
        },

        // Only required when role === 'student'
        gradeLevel: {
            type:     Number,
            required: function () { return this.role === 'student'; },
        },

        // Only required when role === 'instructor'
        department: {
            type:     String,
            required: function () { return this.role === 'instructor'; },
        },
    },
    { timestamps: true }
);


/* Pre-save Hook

   Automatically hashes the password before saving whenever it has been
   modified 

*/
UserSchema.pre('save', async function () {
    // Skip re-hashing if the password field hasn't changed
    if (!this.isModified('password')) {
        return;
    };

    try{
        const salt    = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('Password hashing error:', error.message);
        throw new Error('Server error during password processing.');    
}});


/*  
matchPassword(candidatePassword)
Compares a plain-text password against the stored hash.
*/
UserSchema.methods.matchPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', UserSchema);
module.exports = User;