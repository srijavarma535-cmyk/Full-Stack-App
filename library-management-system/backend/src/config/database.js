const sqlite3 = require("sqlite3").verbose();
const path = require('path');

const DB_PATH = path.join(__dirname,"../../database/library.db");



// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Books table
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE NOT NULL,
        category TEXT,
        total_copies INTEGER DEFAULT 1,
        available_copies INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Members table
    db.run(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        membership_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active'
      )
    `);

    // Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        member_id INTEGER NOT NULL,
        borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        due_date DATETIME NOT NULL,
        return_date DATETIME,
        status TEXT DEFAULT 'borrowed',
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (member_id) REFERENCES members(id)
      )
    `);

    console.log('Database tables initialized');
    
    // Insert sample data if tables are empty
    insertSampleData();
  });
}

// Insert sample data
function insertSampleData() {
  db.get('SELECT COUNT(*) as count FROM books', (err, row) => {
    if (!err && row.count === 0) {
      const sampleBooks = [
        ['The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 3, 3],
        ['To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 2, 2],
        ['1984', 'George Orwell', '978-0451524935', 'Science Fiction', 4, 4],
        ['Pride and Prejudice', 'Jane Austen', '978-0141439518', 'Romance', 2, 2],
        ['The Catcher in the Rye', 'J.D. Salinger', '978-0316769174', 'Fiction', 3, 3],
        ['Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '978-0439708180', 'Fantasy', 5, 5],
        ['The Hobbit', 'J.R.R. Tolkien', '978-0547928227', 'Fantasy', 3, 3],
        ['Fahrenheit 451', 'Ray Bradbury', '978-1451673319', 'Science Fiction', 2, 2]
      ];

      const stmt = db.prepare('INSERT INTO books (title, author, isbn, category, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)');
      sampleBooks.forEach(book => stmt.run(book));
      stmt.finalize();
      console.log('Sample books inserted');
    }
  });

  db.get('SELECT COUNT(*) as count FROM members', (err, row) => {
    if (!err && row.count === 0) {
      const sampleMembers = [
        ['John Doe', 'john.doe@email.com', '555-0101', '123 Main St', 'active'],
        ['Jane Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave', 'active'],
        ['Bob Johnson', 'bob.johnson@email.com', '555-0103', '789 Pine Rd', 'active'],
        ['Alice Williams', 'alice.w@email.com', '555-0104', '321 Elm St', 'active']
      ];

      const stmt = db.prepare('INSERT INTO members (name, email, phone, address, status) VALUES (?, ?, ?, ?, ?)');
      sampleMembers.forEach(member => stmt.run(member));
      stmt.finalize();
      console.log('Sample members inserted');
    }
  });
}

module.exports = db;
