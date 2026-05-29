const mongoose = require('mongoose');


// Status lifecycle: draft → under_review → published → archived

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type:     String,
            required: [true, 'Course title is required'],
            trim:     true,
            unique:   true, // BUG FIX: courseRoutes catches 11000 duplicate errors,
                            // but this index was never declared — duplicates slipped through
        },

        description: {
            type:     String,
            required: [true, 'Course description is required'],
            trim:     true,
        },

        instructor: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'User',
            required: [true, 'Instructor reference is required'],
        },

        price: {
            type:    Number,
            default: 0,
            min:     [0, 'Price cannot be negative'],
        },

        duration: {
            type: String, // e.g. "4 weeks", "10 hours" — flexible string format
            trim: true,
        },

        courseStatus: {
            type:    String,
            enum:    ['draft', 'under_review', 'published', 'archived'],
            default: 'draft',
        },
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;