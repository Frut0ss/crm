import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Customers from './Customers';
import Bookings from './Bookings';
import './App.css';

function Home() {
  return (
    <div>
      <h1>Welcome to CRM App</h1>
      <p>Choose a section to get started:</p>
      <ul>
        <li><Link to="/customers">Manage Customers</Link></li>
        <li><Link to="/bookings">Manage Bookings</Link></li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/customers">Customers</Link> | <Link to="/bookings">Bookings</Link>
        </nav>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;