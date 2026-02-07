const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET /api/books - Get all books
router.get('/', bookController.getAllBooks);

// GET /api/books/categories - Get all categories
router.get('/categories', bookController.getCategories);

// GET /api/books/:id - Get book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - Add new book
router.post('/', bookController.addBook);

// PUT /api/books/:id - Update book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete book
router.delete('/:id', bookController.deleteBook);

module.exports = router;
