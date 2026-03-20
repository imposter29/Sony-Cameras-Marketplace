const router = require('express').Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} = require('../controllers/cart.controller');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:productId', updateQuantity);
router.delete('/item/:productId', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
