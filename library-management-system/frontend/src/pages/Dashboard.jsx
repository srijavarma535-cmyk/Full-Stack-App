import { useState, useEffect } from 'react';
import { statsAPI, transactionsAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, overdueRes] = await Promise.all([
        statsAPI.get(),
        transactionsAPI.getOverdue(),
      ]);
      setStats(statsRes.data.stats);
      setOverdueBooks(overdueRes.data.overdue);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalBooks || 0}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.activeMembers || 0}</div>
          <div className="stat-label">Active Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.borrowedBooks || 0}</div>
          <div className="stat-label">Currently Borrowed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--danger-color)' }}>
            {stats?.overdueBooks || 0}
          </div>
          <div className="stat-label">Overdue Books</div>
        </div>
      </div>

      {overdueBooks.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Overdue Books</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((transaction) => {
                  const daysOverdue = Math.floor(
                    (new Date() - new Date(transaction.due_date)) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <tr key={transaction.id}>
                      <td>
                        <strong>{transaction.title}</strong>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {transaction.author}
                        </div>
                      </td>
                      <td>{transaction.member_name}</td>
                      <td>{new Date(transaction.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-danger">{daysOverdue} days</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>{transaction.member_name}</td>
                  <td>{new Date(transaction.borrow_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.status === 'borrowed' ? 'badge-warning' : 'badge-success'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Popular Books</h2>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Times Borrowed</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {stats?.popularBooks?.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.borrow_count}</td>
                  <td>
                    {book.available_copies}/{book.total_copies}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
