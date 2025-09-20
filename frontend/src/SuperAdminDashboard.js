import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [newBusiness, setNewBusiness] = useState({
    id: '',
    name: '',
    domain: '',
    adminUsername: '',
    adminPassword: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const addBusiness = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusiness)
      });

      if (response.ok) {
        await fetchBusinesses();
        setNewBusiness({
          id: '',
          name: '',
          domain: '',
          adminUsername: '',
          adminPassword: ''
        });
        setShowAddForm(false);
        alert('Business added successfully!');
      } else {
        alert('Error adding business');
      }
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Error adding business');
    }
  };

  const deleteBusiness = async (businessId) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        const response = await fetch(`/api/businesses?id=${businessId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchBusinesses();
          alert('Business deleted successfully!');
        } else {
          alert('Error deleting business');
        }
      } catch (error) {
        console.error('Error deleting business:', error);
        alert('Error deleting business');
      }
    }
  };

  return (
    <div className="super-admin-dashboard">
      <header className="dashboard-header">
        <h1>🚀 Super Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Businesses</h3>
            <div className="stat-number">{businesses.length}</div>
          </div>
          <div className="stat-card">
            <h3>Active Businesses</h3>
            <div className="stat-number">
              {businesses.filter(b => b.status === 'active').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <div className="stat-number">$0</div>
          </div>
        </div>

        <div className="businesses-section">
          <div className="section-header">
            <h2>Business Customers</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="add-btn"
            >
              + Add New Business
            </button>
          </div>

          {showAddForm && (
            <div className="add-business-form">
              <h3>Add New Business</h3>
              <form onSubmit={addBusiness}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business ID:</label>
                    <input
                      type="text"
                      value={newBusiness.id}
                      onChange={(e) => setNewBusiness({...newBusiness, id: e.target.value})}
                      placeholder="unique-business-id"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Name:</label>
                    <input
                      type="text"
                      value={newBusiness.name}
                      onChange={(e) => setNewBusiness({...newBusiness, name: e.target.value})}
                      placeholder="Business Name"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Domain (optional):</label>
                    <input
                      type="text"
                      value={newBusiness.domain}
                      onChange={(e) => setNewBusiness({...newBusiness, domain: e.target.value})}
                      placeholder="business.example.com"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Admin Username:</label>
                    <input
                      type="text"
                      value={newBusiness.adminUsername}
                      onChange={(e) => setNewBusiness({...newBusiness, adminUsername: e.target.value})}
                      placeholder="admin"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Password:</label>
                    <input
                      type="password"
                      value={newBusiness.adminPassword}
                      onChange={(e) => setNewBusiness({...newBusiness, adminPassword: e.target.value})}
                      placeholder="password"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Add Business</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="businesses-grid">
            {businesses.map(business => (
              <div key={business.id} className="business-card">
                <div className="business-header">
                  <h3>{business.name}</h3>
                  <span className={`status ${business.status}`}>
                    {business.status}
                  </span>
                </div>
                <div className="business-info">
                  <p><strong>ID:</strong> {business.id}</p>
                  <p><strong>Domain:</strong> {business.domain || 'Not set'}</p>
                  <p><strong>Created:</strong> {new Date(business.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="business-links">
                  <a 
                    href={`${window.location.origin}/business/${business.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dashboard-link"
                  >
                    📊 View Dashboard
                  </a>
                  <a 
                    href={`${window.location.origin}/business/${business.id}/widget`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="widget-link"
                  >
                    📅 Booking Widget
                  </a>
                </div>
                <div className="business-actions">
                  <button 
                    onClick={() => deleteBusiness(business.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {businesses.length === 0 && (
            <div className="no-businesses">
              <p>No businesses added yet. Click "Add New Business" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;