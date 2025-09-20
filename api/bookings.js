// In-memory data store for demo purposes
let bookings = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(bookings);
  } else if (req.method === 'POST') {
    const { description, date, time, customer, status, createdAt } = req.body;
    
    // Create booking object with comprehensive data
    const booking = {
      id: Date.now(),
      description: description || `Booking for ${customer?.name || 'Unknown'}`,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '',
      customer: customer || {},
      status: status || 'pending',
      createdAt: createdAt || new Date().toISOString()
    };
    
    bookings.push(booking);
    res.status(201).json(booking);
  } else {
    res.status(405).end();
  }
}