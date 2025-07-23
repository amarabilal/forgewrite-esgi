const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');
const authenticateToken = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

// Admin routes protected by authentication and admin authorization
router.use(authenticateToken, authorizeAdmin);

// CRUD for books by admin
router.get('/', adminBookController.getAllBooks);
router.get('/:id', adminBookController.getBookById);
router.post('/', adminBookController.createBook);
router.put('/:id', adminBookController.updateBook);
router.delete('/:id', adminBookController.deleteBook);

module.exports = router;
