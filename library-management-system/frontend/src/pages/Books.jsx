import { useState, useEffect } from 'react';
import { booksAPI, membersAPI, transactionsAPI } from '../services/api';
import Modal from '../components/Modal';


export default function Books() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
  });
  const [borrowData, setBorrowData] = useState({
    member_id: '',
    due_days: 14,
  });

  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, [searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await booksAPI.getAll(params);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await membersAPI.getAll({ status: 'active' });
      setMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await booksAPI.create({
      ...formData,
      available_copies: Number(formData.total_copies),
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      total_copies: 1,
    });

    fetchBooks();
  } catch (error) {
    alert(error.response?.data?.error || 'Error adding book');
  }
};

 

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await transactionsAPI.borrow({
        book_id: selectedBook.id,
        ...borrowData,
      });
      setIsBorrowModalOpen(false);
      setSelectedBook(null);
      setBorrowData({ member_id: '', due_days: 14 });
      fetchBooks();
      alert('Book borrowed successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Error borrowing book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id);
        fetchBooks();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting book');
      }
    }
  };

  const openBorrowModal = (book) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Books</h1>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add New Book
        </button>
      </div>

      <div className="search-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search books by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <strong>{book.title}</strong>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <span className="badge badge-info">{book.category}</span>
                  </td>
                  <td>
                    {book.available_copies}/{book.total_copies}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => openBorrowModal(book)}
                        disabled={book.available_copies === 0}
                      >
                        Borrow
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Book">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Author *</label>
            <input
              type="text"
              name="author"
              className="form-input"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              className="form-input"
              value={formData.isbn}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Total Copies *</label>
            <input
              type="number"
              name="total_copies"
              className="form-input"
              value={formData.total_copies}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        title="Borrow Book"
      >
        {selectedBook && (
          <form onSubmit={handleBorrow}>
            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.375rem' }}>
              <strong>{selectedBook.title}</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                by {selectedBook.author}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Select Member *</label>
              <select
                className="form-select"
                value={borrowData.member_id}
                onChange={(e) => setBorrowData({ ...borrowData, member_id: e.target.value })}
                required
              >
                <option value="">Choose a member...</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due in (days) *</label>
              <input
                type="number"
                className="form-input"
                value={borrowData.due_days}
                onChange={(e) => setBorrowData({ ...borrowData, due_days: e.target.value })}
                min="1"
                max="90"
                required
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsBorrowModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Borrow Book
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
