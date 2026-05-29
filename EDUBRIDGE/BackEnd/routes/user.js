const express  = require('express');
const router   = express.Router();

const { 
    getAllUsers,
    approveRole,
    fetchUserById,
    deleteUserById
 }  = require('../controllers/UserControllers/adminInstructor/userController');

const {
    myProfile,
    meProfile,
    updateProfile,
    deleteMyProfile
} = require('../controllers/UserControllers/CurrentUserControllers/userController');

const { 
    logIn,
    register
 } = require('../controllers/UserControllers/registrationController/userController');

// Single source of truth for auth middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');


   // PUBLIC ROUTES  (no token required)

 // Creates a new user account.
router.post('/register', register);

// Log in route
router.post('/login', logIn);


/* 
   PROTECTED ROUTES — current user  (any authenticated user)
   IMPORTANT: These static paths (/me, /profile) MUST be declared before
   the parameterised /:id routes, otherwise Express will treat the literal
   strings "me" and "profile" as ID values.
 */

// Returns the authenticated user's profile.
router.get('/profile', protect, myProfile);


// returns the authenticated user's basic info.
router.get('/me', protect, meProfile);


/*
 Updates the authenticated user's own profile (name, email, password).
 Body (all optional): { name?, email?, password? }
 */
router.put('/me', protect, updateProfile);


/*
 Deletes the authenticated user's own account.
 Admins are blocked — they must be deleted by another admin via /:id.
 */
router.delete('/me', protect, deleteMyProfile);


/* 
   PROTECTED ROUTES — admin / instructor actions
   Static paths like /approve-role/:id MUST come before the bare /:id routes.
*/

//  Returns all users. Admin and Instructor only.
router.get('/', protect, authorizeRoles('admin', 'instructor'), getAllUsers);


/*
 Promotes a user to 'instructor' or 'admin'. Admin only.
 NOTE: This route MUST be declared before GET/DELETE /:id so Express does
 not interpret "approve-role" as a user ID.
 */

 //   Returns all users. Admin and Instructor only.
router.put('/approve-role/:id', protect, authorize('admin'), approveRole);


//  Fetches any user's profile by ID. Admin and Instructor only.
router.get('/:id', protect, authorize('admin', 'instructor'), fetchUserById);


/*
 Deletes any user account by ID. Admin or Instructor only.
 Deletion hierarchy:
   - Only an Admin can delete another Admin.
   - Only an Admin can delete an Instructor.
   - Admins and Instructors can delete Students.
 */
router.delete('/:id', protect, authorize('admin', 'instructor'), deleteUserById);


module.exports = router;