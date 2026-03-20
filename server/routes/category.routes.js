const router = require('express').Router();
const {
  getAll,
  create,
  update,
  delete: deleteCategory,
} = require('../controllers/category.controller');
const verifyToken = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', getAll);
router.post('/', verifyToken, adminOnly, create);
router.put('/:id', verifyToken, adminOnly, update);
router.delete('/:id', verifyToken, adminOnly, deleteCategory);

module.exports = router;
