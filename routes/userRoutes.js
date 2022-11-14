const express = require('express');

const userController = require('./../controllerrs/userController');
const authController = require('./../controllerrs/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMe',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Protect all router after this middleware
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
