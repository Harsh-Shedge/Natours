const express = require('express');
const reviewController = require('./../controllerrs/reviewController');
const authController = require('./../controllerrs/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', reviewController.getAllReviews);

router.post(
  '/',
  authController.restrictTo('user'),
  reviewController.setTourIds,
  reviewController.createReview
);

router.get('/:id', reviewController.getReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
