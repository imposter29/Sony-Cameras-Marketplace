const router = require('express').Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const verifyToken = require('../middleware/auth');
const {
  validate,
  reviewRules,
  reviewUpdateRules,
} = require('../middleware/validators');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', verifyToken, reviewRules, validate, addReview);
router.put('/:id', verifyToken, reviewUpdateRules, validate, updateReview);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
