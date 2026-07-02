const router = require('express').Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  cancelOrder,
  updateStatus,
} = require('../controllers/order.controller');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { validate, placeOrderRules } = require('../middleware/validators');

router.use(verifyToken);

router.post('/', placeOrderRules, validate, placeOrder);
router.get('/my', getMyOrders);
router.get('/all', adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', adminOnly, updateStatus);

module.exports = router;
