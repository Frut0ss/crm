import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SuperAdminBusinessView.css';

function SuperAdminBusinessView() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [newBooking, setNewBooking] = useState({ customerId: '', service: '', date: '', time: '' });
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);

  // Ensure only super admins can access this view
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const fetchBusinessInfo = useCallback(async () => {
    try {
      const response = await fetch('/api/businesses');
      const data = await response.json();
      const business = data.businesses?.find(b => b.id === tenantId);
      setBusinessInfo(business);
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  }, [tenantId]);

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers?tenantId=${tenantId}`);
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, [tenantId]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`/api/bookings?tenantId=${tenantId}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId && user?.role === 'super_admin') {
      fetchBusinessInfo();
      fetchCustomers();
      fetchBookings();
    }
  }, [tenantId, user, fetchBusinessInfo, fetchCustomers, fetchBookings]);

  const addCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCustomer, tenantId })
      });

      if (response.ok) {
        await fetchCustomers();
        setNewCustomer({ name: '', email: '', phone: '' });
        setShowAddCustomer(false);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const addBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBooking, tenantId })
      });

      if (response.ok) {
        await fetchBookings();
        setNewBooking({ customerId: '', service: '', date: '', time: '' });
        setShowAddBooking(false);
      }
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customers?id=${customerId}&tenantId=${tenantId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchCustomers();
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const deleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/bookings?id=${bookingId}&tenantId=${tenantId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchBookings();
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  if (!user || user.role !== 'super_admin') {
    return <div>Access denied. Super admin privileges required.</div>;
  }

  return (
    <div className="super-admin-business-view">
      <div className="business-view-header">
        <div className="header-content">
          <div className="business-info">
            <h1>Super Admin: {businessInfo?.name || tenantId}</h1>
            <p>Business ID: {tenantId}</p>
            <p>Supporting customer dashboard</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/super-admin')}
              className="back-btn"
            >
              ← Back to Super Admin
            </button>
          </div>
        </div>
      </div>

      <div className="business-view-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers ({customers.length})
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'customers' && (
            <div className="customers-section">
              <div className="section-header">
                <h2>Customer Management</h2>
                <button 
                  onClick={() => setShowAddCustomer(!showAddCustomer)}
                  className="add-btn"
                >
                  + Add Customer
                </button>
              </div>

              {showAddCustomer && (
                <form onSubmit={addCustomer} className="add-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Customer</button>
                    <button type="button" onClick={() => setShowAddCustomer(false)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              )}

              <div className="customers-grid">
                {customers.map(customer => (
                  <div key={customer.id} className="customer-card">
                    <div className="customer-info">
                      <h3>{customer.name}</h3>
                      <p>{customer.email}</p>
                      <p>{customer.phone}</p>
                    </div>
                    <div className="customer-actions">
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {customers.length === 0 && (
                <div className="empty-state">
                  <p>No customers found for this business.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <div className="section-header">
                <h2>Booking Management</h2>
                <button 
                  onClick={() => setShowAddBooking(!showAddBooking)}
                  className="add-btn"
                >
                  + Add Booking
                </button>
              </div>

              {showAddBooking && (
                <form onSubmit={addBooking} className="add-form">
                  <div className="form-row">
                    <select
                      value={newBooking.customerId}
                      onChange={(e) => setNewBooking({...newBooking, customerId: e.target.value})}
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Service"
                      value={newBooking.service}
                      onChange={(e) => setNewBooking({...newBooking, service: e.target.value})}
                      required
                    />
                    <input
                      type="date"
                      value={newBooking.date}
                      onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                      required
                    />
                    <input
                      type="time"
                      value={newBooking.time}
                      onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Booking</button>
                    <button type="button" onClick={() => setShowAddBooking(false)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              )}

              <div className="bookings-grid">
                {bookings.map(booking => {
                  const customer = customers.find(c => c.id === booking.customerId);
                  return (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-info">
                        <h3>{booking.service}</h3>
                        <p><strong>Customer:</strong> {customer?.name || 'Unknown'}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                      </div>
                      <div className="booking-actions">
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {bookings.length === 0 && (
                <div className="empty-state">
                  <p>No bookings found for this business.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminBusinessView;