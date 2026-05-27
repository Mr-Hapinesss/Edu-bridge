const express = require('express');
const router  = express.Router();
const Course  = require('../models/courseSchema');
const { protect }   = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');


/* 
   GET /api/courses
   List all published courses. Public.
 */
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ courseStatus: 'published' })
            .populate('instructor', 'name email')
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({ count: courses.length, courses });

    } catch (error) {
        console.error('Fetch courses error:', error.message);
        res.status(500).json({ message: 'Server error while fetching courses.' });
    }
});


/* 
   GET /api/courses/:id
   Get a single course by ID. Public, but unpublished courses are
   restricted to the owning instructor and admins.
 */
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // BUG FIX: req.user is undefined on public routes (no token sent).
        // The original code accessed req.user._id directly and would crash with
        // "Cannot read properties of undefined". Fixed with optional chaining.
        const isOwner = req.user?._id?.toString() === course.instructor._id.toString();
        const isAdmin = req.user?.role === 'admin';

        if (course.courseStatus !== 'published' && !isOwner && !isAdmin) {
            return res.status(403).json({ message: 'This course is not published yet.' });
        }

        res.status(200).json(course);

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Course ID format.' });
        }
        console.error('Fetch course error:', error.message);
        res.status(500).json({ message: 'Server error while fetching course.' });
    }
});


/* 
   POST /api/courses
   Create a new course. Private — Instructor or Admin only.
 */
router.post('/', protect, authorize('admin', 'instructor'), async (req, res) => {
    const { title, description, price, duration } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    try {
        const course = await Course.create({
            title,
            description,
            price:      price    || 0,
            duration:   duration || undefined,
            instructor: req.user._id,
            courseStatus: 'draft',
        });

        res.status(201).json(course);

    } catch (error) {
        // Duplicate title — caught by the unique index on CourseSchema
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A course with this title already exists.' });
        }
        console.error('Create course error:', error.message);
        res.status(500).json({ message: 'Server error while creating course.' });
    }
});


/* 
   PUT /api/courses/:id
   Update a course. Private — owning Instructor or Admin only.
 */
router.put('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    const { title, description, price, duration, courseStatus } = req.body;
    const allowedStatuses = ['draft', 'under_review', 'published', 'archived'];

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Only the owning instructor or an admin may edit
        const isOwner = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to update this course.',
            });
        }

        // Apply updates only for fields that were actually sent
        if (title)       course.title       = title;
        if (description) course.description = description;
        if (price !== undefined) course.price = price;
        if (duration)    course.duration    = duration;

        if (courseStatus) {
            if (!allowedStatuses.includes(courseStatus)) {
                return res.status(400).json({
                    message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}.`,
                });
            }
            course.courseStatus = courseStatus;
        }

        const updatedCourse = await course.save();
        res.status(200).json(updatedCourse);

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Course ID format.' });
        }
        console.error('Update course error:', error.message);
        res.status(500).json({ message: 'Server error while updating course.' });
    }
});


/* 
   DELETE /api/courses/:id
   Delete a course. Private — owning Instructor or Admin only.
   TODO: Add cascade delete for all associated Enrollments and Lessons.
 */
router.delete('/:id', protect, authorize('admin', 'instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        const isOwner = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to delete this course.',
            });
        }

        await course.deleteOne();
        res.status(200).json({ message: 'Course successfully deleted.' });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Course ID format.' });
        }
        console.error('Delete course error:', error.message);
        res.status(500).json({ message: 'Server error while deleting course.' });
    }
});


module.exports = router;