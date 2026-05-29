const Enrollment = require('../../models/enrollment');
const Course     = require('../../models/courseSchema');

const enrollUser = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required for enrollment.' });
    }

    try {
        // Only allow enrollment in published courses
        const course = await Course.findById(courseId);
        if (!course || course.courseStatus !== 'published') {
            return res.status(404).json({
                message: 'Course not found or is not currently available for enrollment.',
            });
        }

        // Guard against duplicate enrollment (belt-and-suspenders alongside the unique index)
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(409).json({ message: 'You are already enrolled in this course.' });
        }

        // Create the enrollment record
        const newEnrollment = await Enrollment.create({ user: userId, course: courseId });

        // Populate course details for the response
        await newEnrollment.populate('course', 'title instructor');

        res.status(201).json({
            message:    'Enrollment successful!',
            enrollment: newEnrollment,
        });

    } catch (error) {
        console.error('Enrollment error:', error.message);
        res.status(500).json({ message: 'Server error during enrollment.' });
    }
};

const getCourses = async (req, res) => {
    try {
        // BUG FIX: Calling .populate() twice on the same path ('course') means the
        // second call silently overwrites the first. Use a single nested populate instead.
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({
                path:     'course',
                select:   'title description price duration courseStatus instructor',
                populate: {
                    path:   'instructor',
                    select: 'name email',
                },
            })
            .sort({ enrollmentDate: -1 });

        // Always return 200 with an empty array rather than a misleading 404
        res.status(200).json({
            count:       enrollments.length,
            enrollments: enrollments,
        });

    } catch (error) {
        console.error('Fetch enrollments error:', error.message);
        res.status(500).json({ message: 'Server error while fetching enrolled courses.' });
    }
};

const unEnrollUser = async (req, res) => {
    try {
        const result = await Enrollment.findOneAndDelete({
            user:   req.user._id,
            course: req.params.courseId,
        });

        if (!result) {
            return res.status(404).json({
                message: 'Enrollment not found. You may not be enrolled in this course.',
            });
        }

        res.status(200).json({ message: 'Successfully unenrolled from course.' });

    } catch (error) {
        console.error('Unenrollment error:', error.message);
        // BUG FIX: error.kind === 'ObjectId' is unreliable across Mongoose versions
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Course ID format.' });
        }
        res.status(500).json({ message: 'Server error while processing unenrollment.' });
    }
};

module.exports = {
    enrollUser,
    getCourses,
    unEnrollUser    
}