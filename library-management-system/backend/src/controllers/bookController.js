const db = require('../config/database');

// Get all books
exports.getAllBooks = (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY id DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ books: rows });
  });
};

// Get book by ID
exports.getBookById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book: row });
  });
};

// Add new book
exports.addBook = (req, res) => {
  const { title, author, isbn, category, total_copies } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ error: 'Title, author, and ISBN are required' });
  }
   const totalCopiesNum=Number(total_copies)||1;
  const available_copies = totalCopiesNum;
  const query = `
    INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [title, author, isbn, category, totalCopiesNum || 1, available_copies], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Book with this ISBN already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Book added successfully',
      book: { id: this.lastID, title, author, isbn, category, total_copies:totalCopiesNum, available_copies }
    });
  });
};

// Update book
exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category, total_copies, available_copies } = req.body;

  const query = `
    UPDATE books 
    SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?, available_copies = ?
    WHERE id = ?
  `;

  db.run(query, [title, author, isbn, category, total_copies, available_copies, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully' });
  });
};

// Delete book
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  // Check if book has active transactions
  db.get(
    'SELECT COUNT(*) as count FROM transactions WHERE book_id = ? AND status = "borrowed"',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row.count > 0) {
        return res.status(400).json({ error: 'Cannot delete book with active borrowings' });
      }

      db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
      });
    }
  );
};

// Get all categories
exports.getCategories = (req, res) => {
  db.all('SELECT DISTINCT category FROM books WHERE category IS NOT NULL', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const categories = rows.map(row => row.category);
    res.json({ categories });
  });
};
