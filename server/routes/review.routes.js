const router = require('express').Router();
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const verifyToken = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', verifyToken, addReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
