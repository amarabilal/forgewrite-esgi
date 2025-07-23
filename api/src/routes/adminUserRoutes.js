const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const authenticateToken = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

// Admin routes protected by authentication and admin authorization
router.use(authenticateToken, authorizeAdmin);

// CRUD for users by admin
router.get('/', adminUserController.getAllUsers);
router.get('/stats', adminUserController.getUserStats);
router.get('/:id', adminUserController.getUserById);
router.post('/', adminUserController.createUser);
router.put('/:id', adminUserController.updateUser);
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
