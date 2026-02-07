const db = require('../config/database');

// Get all members
exports.getAllMembers = (req, res) => {
  const { search, status } = req.query;
  let query = 'SELECT * FROM members WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY membership_date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ members: rows });
  });
};

// Get member by ID
exports.getMemberById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    // Get member's borrowing history
    db.all(
      `SELECT t.*, b.title, b.author 
       FROM transactions t 
       JOIN books b ON t.book_id = b.id 
       WHERE t.member_id = ? 
       ORDER BY t.borrow_date DESC`,
      [id],
      (err, transactions) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ member: row, transactions });
      }
    );
  });
};

// Add new member
exports.addMember = (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const query = `
    INSERT INTO members (name, email, phone, address, status)
    VALUES (?, ?, ?, ?, 'active')
  `;

  db.run(query, [name, email, phone, address], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Member with this email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Member added successfully',
      member: { id: this.lastID, name, email, phone, address, status: 'active' }
    });
  });
};

// Update member
exports.updateMember = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, status } = req.body;

  const query = `
    UPDATE members 
    SET name = ?, email = ?, phone = ?, address = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [name, email, phone, address, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member updated successfully' });
  });
};

// Delete member
exports.deleteMember = (req, res) => {
  const { id } = req.params;

  // Check if member has active transactions
  db.get(
    'SELECT COUNT(*) as count FROM transactions WHERE member_id = ? AND status = "borrowed"',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row.count > 0) {
        return res.status(400).json({ error: 'Cannot delete member with active borrowings' });
      }

      db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
      });
    }
  );
};
