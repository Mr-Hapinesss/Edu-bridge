const express    = require('express');
const router     = express.Router();
const { protect }   = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    enrollUser,
    getCourses,
    unEnrollUser    
} = require ('../controllers/EnrollmentControllers/enrollmentController');

// Enroll the logged-in user into a course. Private.
router.post('/', protect, enrollUser);


//   Get all courses the logged-in user is enrolled in. Private.
//   NOTE: This static path MUST be declared before DELETE /:courseId, otherwise Express matches "my-courses" as a courseId parameter.
router.get('/my-courses', protect, getCourses);


//   Unenroll the logged-in user from a course. Private.
router.delete('/:courseId', protect, unEnrollUser);


module.exports = router;