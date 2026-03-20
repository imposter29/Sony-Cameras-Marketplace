const router = require('express').Router();
const {
  getProducts,
  getFeatured,
  getCompare,
  getBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/compare', getCompare);
router.get('/:slug', getBySlug);
router.post('/', verifyToken, adminOnly, createProduct);
router.put('/:id', verifyToken, adminOnly, updateProduct);
router.delete('/:id', verifyToken, adminOnly, deleteProduct);

module.exports = router;
