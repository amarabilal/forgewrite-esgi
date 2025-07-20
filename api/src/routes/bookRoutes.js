const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const chapterController = require('../controllers/chapterController')
const characterController = require('../controllers/characterController')
const mapItemController = require('../controllers/mapItemController');
const commentController = require('../controllers/commentController');
const authenticateToken = require('../../middleware/authMiddleware');

// All routes protected by JWT auth
router.use(authenticateToken);

// GET /api/books - Get all books for user
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Get a book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - Create a new book
router.post('/', bookController.createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookController.deleteBook);

router.get('/:bookId/chapters', chapterController.getChaptersByBookId)

router.get('/:id/characters', characterController.getCharactersByBookId)

router.get('/:id/map-items', mapItemController.getMapItemsByBookId);

router.get('/:id/comments', commentController.getCommentsByBookId);

module.exports = router;
