const express = require('express');
const app = express();
app.use(express.json());

// In-memory data store for demo purposes
const customers = [];
const bookings = [];

// Customers
app.get('/api/customers', (req, res) => res.json(customers));
app.post('/api/customers', (req, res) => {
    const customer = { id: Date.now(), ...req.body };
    customers.push(customer);
    res.status(201).json(customer);
});

// Bookings
app.get('/api/bookings', (req, res) => res.json(bookings));
app.post('/api/bookings', (req, res) => {
    const booking = { id: Date.now(), ...req.body };
    bookings.push(booking);
    res.status(201).json(booking);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running on port ${port}`));