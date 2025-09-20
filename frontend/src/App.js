import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Customers from './Customers';
import Bookings from './Bookings';
import WidgetPage from './WidgetPage';
import './App.css';

function Home() {
  return (
    <div>
      <h1>Welcome to CRM App</h1>
      <p>Choose a section to get started:</p>
      <ul>
        <li><Link to="/customers">Manage Customers</Link></li>
        <li><Link to="/bookings">Manage Bookings</Link></li>
        <li><Link to="/widget">Booking Widget (for embedding)</Link></li>
      </ul>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📋 Embed Code for Your Website:</h3>
        <p>Copy this code to embed the booking widget on any website:</p>
        <code style={{ 
          display: 'block', 
          padding: '15px', 
          backgroundColor: '#2c3e50', 
          color: '#ecf0f1', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          overflowX: 'auto'
        }}>
          {`<iframe 
  src="${window.location.origin}/widget" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border: none; border-radius: 10px;">
</iframe>`}
        </code>
      </div>
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
            <Route path="/widget" element={<WidgetPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;