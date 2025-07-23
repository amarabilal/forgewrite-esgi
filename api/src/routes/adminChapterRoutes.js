const express = require('express');
const router = express.Router();
const adminChapterController = require('../controllers/adminChapterController');
const authenticateToken = require('../../middleware/authMiddleware');
const authorizeAdmin = require('../../middleware/adminMiddleware');

// Admin routes protected by authentication and admin authorization
router.use(authenticateToken, authorizeAdmin);

// CRUD for chapters by admin
router.get('/', adminChapterController.getAllChapters);
router.get('/:id', adminChapterController.getChapterById);
router.post('/', adminChapterController.createChapter);
router.put('/:id', adminChapterController.updateChapter);
router.delete('/:id', adminChapterController.deleteChapter);

module.exports = router;
