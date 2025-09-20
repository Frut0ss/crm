import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Customers from './Customers';
import Bookings from './Bookings';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/customers">Customers</Link> | <Link to="/bookings">Bookings</Link>
      </nav>
      <Routes>
        <Route path="/customers" element={<Customers />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </Router>
  );
}

export default App;