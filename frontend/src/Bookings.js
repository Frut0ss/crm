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

  return (
    <div>
      <h2>Bookings</h2>
      <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Booking description" />
      <button onClick={addBooking}>Add Booking</button>
      <ul>
        {bookings.map(b => <li key={b.id}>{b.description}</li>)}
      </ul>
    </div>
  );
}

export default Bookings;