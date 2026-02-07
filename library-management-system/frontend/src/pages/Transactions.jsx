import { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const response = await transactionsAPI.getAll(params);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await transactionsAPI.return(id);
        fetchTransactions();
        alert('Book returned successfully!');
      } catch (error) {
        alert(error.response?.data?.error || 'Error returning book');
      }
    }
  };

  const calculateDaysRemaining = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Transactions</h1>
      </div>

      <div className="search-filters">
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const daysRemaining = calculateDaysRemaining(transaction.due_date);
                const isOverdue = daysRemaining < 0 && transaction.status === 'borrowed';
                
                return (
                  <tr key={transaction.id}>
                    <td>
                      <strong>{transaction.title}</strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {transaction.author}
                      </div>
                    </td>
                    <td>
                      <div>{transaction.member_name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {transaction.member_email}
                      </div>
                    </td>
                    <td>{new Date(transaction.borrow_date).toLocaleDateString()}</td>
                    <td>
                      {new Date(transaction.due_date).toLocaleDateString()}
                      {transaction.status === 'borrowed' && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: isOverdue ? 'var(--danger-color)' : 'var(--text-secondary)',
                          }}
                        >
                          {isOverdue
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days left`}
                        </div>
                      )}
                    </td>
                    <td>
                      {transaction.return_date
                        ? new Date(transaction.return_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.status === 'borrowed'
                            ? isOverdue
                              ? 'badge-danger'
                              : 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : transaction.status}
                      </span>
                    </td>
                    <td>
                      {transaction.status === 'borrowed' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturn(transaction.id)}
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
