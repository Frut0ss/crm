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
    const { description } = req.body;
    const booking = { id: Date.now(), description };
    bookings.push(booking);
    res.status(201).json(booking);
  } else {
    res.status(405).end();
  }
}