const db = require('../config/database');

// Get dashboard statistics
exports.getStats = (req, res) => {
  const stats = {};

  // Total books
  db.get('SELECT COUNT(*) as total, SUM(total_copies) as copies FROM books', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.totalBooks = row.total || 0;
    stats.totalCopies = row.copies || 0;

    // Total members
    db.get('SELECT COUNT(*) as total FROM members WHERE status = "active"', (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      stats.activeMembers = row.total || 0;

      // Currently borrowed books
      db.get('SELECT COUNT(*) as total FROM transactions WHERE status = "borrowed"', (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        stats.borrowedBooks = row.total || 0;

        // Overdue books
        const today = new Date().toISOString();
        db.get(
          'SELECT COUNT(*) as total FROM transactions WHERE status = "borrowed" AND due_date < ?',
          [today],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            stats.overdueBooks = row.total || 0;

            // Available books
            db.get('SELECT SUM(available_copies) as total FROM books', (err, row) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              stats.availableBooks = row.total || 0;

              // Recent transactions
              db.all(
                `SELECT t.*, b.title, m.name as member_name
                 FROM transactions t
                 JOIN books b ON t.book_id = b.id
                 JOIN members m ON t.member_id = m.id
                 ORDER BY t.borrow_date DESC
                 LIMIT 5`,
                (err, transactions) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  stats.recentTransactions = transactions;

                  // Popular books
                  db.all(
                    `SELECT b.*, COUNT(t.id) as borrow_count
                     FROM books b
                     LEFT JOIN transactions t ON b.id = t.book_id
                     GROUP BY b.id
                     ORDER BY borrow_count DESC
                     LIMIT 5`,
                    (err, books) => {
                      if (err) {
                        return res.status(500).json({ error: err.message });
                      }
                      stats.popularBooks = books;

                      res.json({ stats });
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
  });
};
