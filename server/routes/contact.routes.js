const express = require('express');
const router = express.Router();
const { submit, getAll, markRead, deleteMessage } = require('../controllers/contact.controller');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.post('/', submit);                           // public — anyone can submit
router.get('/', protect, adminOnly, getAll);         // admin — view all
router.patch('/:id/read', protect, adminOnly, markRead); // admin — mark read
router.delete('/:id', protect, adminOnly, deleteMessage); // admin — delete

module.exports = router;
