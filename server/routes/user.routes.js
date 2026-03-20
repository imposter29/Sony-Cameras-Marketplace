const router = require('express').Router();
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
} = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

module.exports = router;
