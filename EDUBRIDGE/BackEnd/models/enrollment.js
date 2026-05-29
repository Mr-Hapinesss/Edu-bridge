const mongoose = require('mongoose');

/*
Tracks which user is enrolled in which course, and their progress status.
The compound unique index prevents a user from enrolling in the same course twice.
 */
const EnrollmentSchema = new mongoose.Schema(
    {
        user: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'User',
            required: [true, 'User reference is required'],
        },

        course: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Course',
            required: [true, 'Course reference is required'],
        },

        enrollmentDate: {
            type:    Date,
            default: Date.now,
        },


        status: {
            type:    String,
            enum:    ['enrolled', 'in-progress', 'completed'],
            default: 'enrolled',
        },
    },
    { timestamps: true }
);

// Compound unique index: one user cannot enroll in the same course more than once
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
module.exports = Enrollment;