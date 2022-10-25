const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMIddleware');

// get all users by admin
router.get('/', protect, admin, userController.getAllUsers);

// register new user
router.post('/register', userController.register);

// verify user account
router.get('/:id/verify/:token', userController.verifyUser);

// authenticate user and get token
router.post('/login', userController.login);

// send a mail with the link to reset password
router.post('/forgot-password', userController.forgotPassword);

// change new password
router.put('/reset-password/:id', userController.resetPassword);

// login by Google
router.post('/passport/data', userController.getUserDataGoogle);

// get data for an authenticated user
router.get('/profile', protect, userController.getUserProfile);

// update data for an authenticated user
router.put('/profile', protect, userController.updateUserProfile);

// add new user by admin
router.post('/', protect, admin, userController.addUser);

// delete a user by ID
router.delete('/:id', protect, admin, userController.deleteUser);

// delete failed when user has been donated
router.put(
  '/delete-failed/:id',
  protect,
  admin,
  userController.deleteUserFailed
);

// get a users by ID
router.get('/:id', protect, admin, userController.getUserById);

// update a user by ID
router.put('/:id', protect, admin, userController.updateUser);

module.exports = router;
