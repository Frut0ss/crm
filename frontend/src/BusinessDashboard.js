import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';

function BusinessDashboard() {
  const { user, logout } = useAuth();
  const { tenantId } = useParams();
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  const currentTenant = tenantId || user?.tenantId;

  const fetchData = useCallback(async () => {
    try {
      const [customersRes, bookingsRes] = await Promise.all([
        fetch(`/api/customers?tenant=${currentTenant}`),
        fetch(`/api/bookings?tenant=${currentTenant}`)
      ]);
      
      const customersData = await customersRes.json();
      const bookingsData = await bookingsRes.json();
      
      setCustomers(customersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/customers?tenant=${currentTenant}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer)
      });

      if (response.ok) {
        await fetchData(); // Refresh data
        setNewCustomer({ name: '', email: '', phone: '' });
        setShowAddCustomerForm(false);
        alert('Customer added successfully!');
      } else {
        alert('Error adding customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer');
    }
  };

  const businessName = user?.tenantName || `Business ${currentTenant}`;

  const getTodaysBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === today);
  };

  const getPendingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <div className="business-dashboard">
      <header className="dashboard-header">
        <h1>{businessName}</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          <button 
            className={`nav-btn ${activeTab === 'widget' ? 'active' : ''}`}
            onClick={() => setActiveTab('widget')}
          >
            Widget
          </button>
        </nav>

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <div className="stat-number">{bookings.length}</div>
              </div>
              <div className="stat-card">
                <h3>Today's Bookings</h3>
                <div className="stat-number">{getTodaysBookings().length}</div>
              </div>
              <div className="stat-card">
                <h3>Pending Bookings</h3>
                <div className="stat-number">{getPendingBookings().length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Customers</h3>
                <div className="stat-number">{customers.length}</div>
              </div>
            </div>

            <div className="quick-overview">
              <div className="overview-section">
                <h3>Upcoming Bookings</h3>
                {getUpcomingBookings().slice(0, 5).map(booking => (
                  <div key={booking.id} className="booking-preview">
                    <div className="booking-info">
                      <strong>{booking.customer?.name || 'Unknown'}</strong>
                      <span> - {booking.date} at {booking.time}</span>
                    </div>
                    <span className={`status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                {getUpcomingBookings().length === 0 && (
                  <p className="no-data">No upcoming bookings</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-tab">
            <h2>Booking Management</h2>
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>{booking.description}</h4>
                    <span className={`status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Customer:</strong> {booking.customer?.name}</p>
                    <p><strong>Email:</strong> {booking.customer?.email}</p>
                    <p><strong>Phone:</strong> {booking.customer?.phone}</p>
                    {booking.customer?.service && (
                      <p><strong>Service:</strong> {booking.customer.service}</p>
                    )}
                    {booking.customer?.notes && (
                      <p><strong>Notes:</strong> {booking.customer.notes}</p>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="no-data">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="customers-tab">
            <div className="section-header">
              <h2>Customer Management</h2>
              <button 
                onClick={() => setShowAddCustomerForm(!showAddCustomerForm)}
                className="add-btn"
              >
                + Add New Customer
              </button>
            </div>

            {showAddCustomerForm && (
              <div className="add-customer-form">
                <h3>Add New Customer</h3>
                <form onSubmit={addCustomer}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        placeholder="Customer Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        placeholder="customer@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        placeholder="Phone Number"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Customer</button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddCustomerForm(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="customers-list">
              {customers.map(customer => (
                <div key={customer.id} className="customer-card">
                  <h4>{customer.name}</h4>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Phone:</strong> {customer.phone}</p>
                  <p><strong>Added:</strong> {new Date(customer.id).toLocaleDateString()}</p>
                </div>
              ))}
              {customers.length === 0 && (
                <p className="no-data">No customers yet. Add your first customer above!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'widget' && (
          <div className="widget-tab">
            <h2>Booking Widget</h2>
            <div className="widget-info">
              <p>Embed our booking widget on your website so customers can book appointments directly!</p>
              
              <div className="widget-preview">
                <h3>Simple Embedding (Recommended):</h3>
                <p>Just copy and paste this code into your website where you want the booking form:</p>
                <textarea 
                  readOnly
                  value={`<!-- CRM Booking Widget -->
<div id="crm-booking-widget-container"></div>
<script src="${window.location.origin}/api/widget?tenant=${currentTenant}"></script>`}
                  className="code-textarea code-textarea-tall"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(`<!-- CRM Booking Widget -->
<div id="crm-booking-widget-container"></div>
<script src="${window.location.origin}/api/widget?tenant=${currentTenant}"></script>`)}
                  className="copy-btn"
                >
                  Copy Embed Code
                </button>
              </div>

              <div className="widget-features">
                <h4>Widget Features:</h4>
                <ul>
                  <li>Mobile-responsive design</li>
                  <li>Professional styling that matches any website</li>
                  <li>Fast loading and lightweight</li>
                  <li>Secure data handling</li>
                  <li>Real-time booking management</li>
                </ul>
              </div>

              <div className="widget-preview-link">
                <a 
                  href={`${window.location.origin}/embed-guide.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-btn"
                >
                  View Full Embedding Guide & Demo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDashboard;