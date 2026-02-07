import { useState, useEffect } from 'react';
import { membersAPI } from '../services/api';
import Modal from '../components/Modal';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [searchTerm]);

  const fetchMembers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      
      const response = await membersAPI.getAll(params);
      setMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await membersAPI.create(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error adding member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await membersAPI.delete(id);
        fetchMembers();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting member');
      }
    }
  };

  const toggleStatus = async (member) => {
    try {
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      await membersAPI.update(member.id, { ...member, status: newStatus });
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating member');
    }
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Members</h1>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add New Member
        </button>
      </div>

      <div className="search-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search members by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Member Since</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.name}</strong>
                  </td>
                  <td>{member.email}</td>
                  <td>{member.phone || 'N/A'}</td>
                  <td>{new Date(member.membership_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        member.status === 'active' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className={`btn btn-sm ${
                          member.status === 'active' ? 'btn-warning' : 'btn-success'
                        }`}
                        onClick={() => toggleStatus(member)}
                      >
                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(member.id)}
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

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
