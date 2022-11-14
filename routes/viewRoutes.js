const express = require('express');

const viewsController = require('./../controllerrs/viewsController');
const authController = require('./../controllerrs/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
