import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';

function BusinessDashboard() {
  const { user, logout } = useAuth();
  const { tenantId } = useParams();
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, bookingsRes] = await Promise.all([
          fetch(`/api/customers?tenant=${tenantId || user?.tenantId}`),
          fetch(`/api/bookings?tenant=${tenantId || user?.tenantId}`)
        ]);
        
        const customersData = await customersRes.json();
        const bookingsData = await bookingsRes.json();
        
        setCustomers(customersData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tenantId, user?.tenantId]);

  const currentTenant = tenantId || user?.tenantId;
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
        <h1>📊 {businessName}</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button 
          className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Customers
        </button>
        <button 
          className={`nav-btn ${activeTab === 'widget' ? 'active' : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          🔗 Widget
        </button>
      </nav>

      <div className="dashboard-content">
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
                <h3>📅 Upcoming Bookings</h3>
                {getUpcomingBookings().slice(0, 5).map(booking => (
                  <div key={booking.id} className="booking-preview">
                    <div className="booking-info">
                      <strong>{booking.customer?.name || 'Unknown'}</strong>
                      <span>{booking.date} at {booking.time}</span>
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
            <h2>📅 Booking Management</h2>
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
                    <p><strong>📅 Date:</strong> {booking.date}</p>
                    <p><strong>⏰ Time:</strong> {booking.time}</p>
                    <p><strong>👤 Customer:</strong> {booking.customer?.name}</p>
                    <p><strong>📧 Email:</strong> {booking.customer?.email}</p>
                    <p><strong>📞 Phone:</strong> {booking.customer?.phone}</p>
                    {booking.customer?.service && (
                      <p><strong>🔧 Service:</strong> {booking.customer.service}</p>
                    )}
                    {booking.customer?.notes && (
                      <p><strong>📝 Notes:</strong> {booking.customer.notes}</p>
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
            <h2>👥 Customer Management</h2>
            <div className="customers-list">
              {customers.map(customer => (
                <div key={customer.id} className="customer-card">
                  <h4>{customer.name}</h4>
                  <p>Added: {new Date(customer.id).toLocaleDateString()}</p>
                </div>
              ))}
              {customers.length === 0 && (
                <p className="no-data">No customers yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'widget' && (
          <div className="widget-tab">
            <h2>🔗 Booking Widget</h2>
            <div className="widget-info">
              <p>Use this widget on your website to allow customers to book appointments:</p>
              
              <div className="widget-preview">
                <h3>Widget URL:</h3>
                <div className="url-box">
                  <code>{window.location.origin}/business/{currentTenant}/widget</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/business/${currentTenant}/widget`)}
                    className="copy-btn"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="embed-code">
                <h3>Embed Code:</h3>
                <textarea 
                  readOnly
                  value={`<iframe 
  src="${window.location.origin}/business/${currentTenant}/widget" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border: none; border-radius: 10px;">
</iframe>`}
                  className="code-textarea"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/business/${currentTenant}/widget" width="100%" height="600" frameborder="0" style="border: none; border-radius: 10px;"></iframe>`)}
                  className="copy-btn"
                >
                  Copy Embed Code
                </button>
              </div>

              <div className="widget-preview-link">
                <a 
                  href={`${window.location.origin}/business/${currentTenant}/widget`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-btn"
                >
                  🔗 Preview Widget
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