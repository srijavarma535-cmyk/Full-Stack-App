const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /api/transactions - Get all transactions
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/overdue - Get overdue books
router.get('/overdue', transactionController.getOverdueBooks);

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// POST /api/transactions/borrow - Borrow a book
router.post('/borrow', transactionController.borrowBook);

// POST /api/transactions/return/:id - Return a book
router.post('/return/:id', transactionController.returnBook);

module.exports = router;
