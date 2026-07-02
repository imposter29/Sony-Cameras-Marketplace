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
const {
  validate,
  addressRules,
  addressUpdateRules,
} = require('../middleware/validators');

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addressRules, validate, addAddress);
router.put('/addresses/:addressId', addressUpdateRules, validate, updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

module.exports = router;
