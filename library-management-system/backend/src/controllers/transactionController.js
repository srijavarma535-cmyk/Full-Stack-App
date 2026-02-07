const db = require('../config/database');

// Get all transactions
exports.getAllTransactions = (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT t.*, b.title, b.author, b.isbn, m.name as member_name, m.email as member_email
    FROM transactions t
    JOIN books b ON t.book_id = b.id
    JOIN members m ON t.member_id = m.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND t.status = ?';
    params.push(status);
  }

  query += ' ORDER BY t.borrow_date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ transactions: rows });
  });
};

// Borrow a book
exports.borrowBook = (req, res) => {
  const { book_id, member_id, due_days = 14 } = req.body;

  if (!book_id || !member_id) {
    return res.status(400).json({ error: 'Book ID and Member ID are required' });
  }

  // Check if book is available
  db.get('SELECT * FROM books WHERE id = ?', [book_id], (err, book) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.available_copies <= 0) {
      return res.status(400).json({ error: 'No copies available for borrowing' });
    }

    // Check if member exists and is active
    db.get('SELECT * FROM members WHERE id = ?', [member_id], (err, member) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      if (member.status !== 'active') {
        return res.status(400).json({ error: 'Member account is not active' });
      }

      // Check if member already has this book
      db.get(
        'SELECT * FROM transactions WHERE book_id = ? AND member_id = ? AND status = "borrowed"',
        [book_id, member_id],
        (err, existingTransaction) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (existingTransaction) {
            return res.status(400).json({ error: 'Member has already borrowed this book' });
          }

          // Calculate due date
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + due_days);

          // Create transaction
          db.run(
            'INSERT INTO transactions (book_id, member_id, due_date, status) VALUES (?, ?, ?, "borrowed")',
            [book_id, member_id, dueDate.toISOString()],
            function(err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              // Update available copies
              db.run(
                'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
                [book_id],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }

                  res.status(201).json({
                    message: 'Book borrowed successfully',
                    transaction: {
                      id: this.lastID,
                      book_id,
                      member_id,
                      due_date: dueDate.toISOString()
                    }
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};

// Return a book
exports.returnBook = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    if (transaction.status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    const returnDate = new Date().toISOString();

    // Update transaction
    db.run(
      'UPDATE transactions SET return_date = ?, status = "returned" WHERE id = ?',
      [returnDate, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Update available copies
        db.run(
          'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?',
          [transaction.book_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.json({
              message: 'Book returned successfully',
              return_date: returnDate
            });
          }
        );
      }
    );
  });
};

// Get overdue books
exports.getOverdueBooks = (req, res) => {
  const today = new Date().toISOString();
  
  const query = `
    SELECT t.*, b.title, b.author, b.isbn, m.name as member_name, m.email as member_email
    FROM transactions t
    JOIN books b ON t.book_id = b.id
    JOIN members m ON t.member_id = m.id
    WHERE t.status = 'borrowed' AND t.due_date < ?
    ORDER BY t.due_date ASC
  `;

  db.all(query, [today], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ overdue: rows });
  });
};

// Get transaction by ID
exports.getTransactionById = (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT t.*, b.title, b.author, b.isbn, m.name as member_name, m.email as member_email
    FROM transactions t
    JOIN books b ON t.book_id = b.id
    JOIN members m ON t.member_id = m.id
    WHERE t.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ transaction: row });
  });
};
