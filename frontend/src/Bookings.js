import React, { useState, useEffect } from 'react';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(setBookings);
  }, []);

  const addBooking = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: desc })
    });
    const newBooking = await res.json();
    setBookings([...bookings, newBooking]);
    setDesc('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div>
      <h2>📋 Booking Management</h2>
      
      {/* Quick Add Booking (Admin) */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Quick Add Booking (Admin)</h3>
        <input 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          placeholder="Booking description" 
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={addBooking}>Add Booking</button>
      </div>

      {/* Bookings List */}
      <div>
        <h3>All Bookings ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic' }}>
            No bookings yet. Customer bookings will appear here.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bookings.map(booking => (
              <div 
                key={booking.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                    {booking.description}
                  </h4>
                  <span 
                    style={{ 
                      backgroundColor: getStatusColor(booking.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }}
                  >
                    {booking.status || 'pending'}
                  </span>
                </div>
                
                {booking.date && booking.time && (
                  <p style={{ margin: '5px 0', color: '#34495e' }}>
                    <strong>📅 Date & Time:</strong> {formatDate(booking.date)} at {booking.time}
                  </p>
                )}
                
                {booking.customer && (
                  <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <p style={{ margin: '2px 0', fontSize: '14px' }}>
                      <strong>👤 Customer:</strong> {booking.customer.name || 'N/A'}
                    </p>
                    {booking.customer.email && (
                      <p style={{ margin: '2px 0', fontSize: '14px' }}>
                        <strong>📧 Email:</strong> {booking.customer.email}
                      </p>
                    )}
                    {booking.customer.phone && (
                      <p style={{ margin: '2px 0', fontSize: '14px' }}>
                        <strong>📞 Phone:</strong> {booking.customer.phone}
                      </p>
                    )}
                    {booking.customer.service && (
                      <p style={{ margin: '2px 0', fontSize: '14px' }}>
                        <strong>🔧 Service:</strong> {booking.customer.service}
                      </p>
                    )}
                    {booking.customer.notes && (
                      <p style={{ margin: '2px 0', fontSize: '14px' }}>
                        <strong>📝 Notes:</strong> {booking.customer.notes}
                      </p>
                    )}
                  </div>
                )}
                
                {booking.createdAt && (
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#7f8c8d' }}>
                    <strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;