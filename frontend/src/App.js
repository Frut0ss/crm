import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import SuperAdminDashboard from './SuperAdminDashboard';
import BusinessDashboard from './BusinessDashboard';
import Customers from './Customers';
import Bookings from './Bookings';
import WidgetPage from './WidgetPage';
import './App.css';
import './LoginPage.css';
import './SuperAdminDashboard.css';
import './BusinessDashboard.css';

function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="unauthorized">Access denied</div>;
  }

  return children;
}

function Home() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Welcome to CRM App</h1>
      <p>Choose a section to get started:</p>
      <ul>
        <li><Link to="/customers">Manage Customers</Link></li>
        <li><Link to="/bookings">Manage Bookings</Link></li>
        <li><Link to="/widget">Booking Widget (for embedding)</Link></li>
        {user?.role === 'super_admin' && (
          <li><Link to="/super-admin">Super Admin Dashboard</Link></li>
        )}
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

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Router>
        {user && (
          <nav>
            <Link to="/">Home</Link> | 
            <Link to="/customers">Customers</Link> | 
            <Link to="/bookings">Bookings</Link> |
            {user.role === 'super_admin' && (
              <Link to="/super-admin">Super Admin</Link>
            )}
            {user.role === 'business_admin' && (
              <Link to={`/business/${user.tenantId}`}>Dashboard</Link>
            )}
          </nav>
        )}
        <main style={{ padding: user ? '20px' : '0' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Super Admin Routes */}
            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Business Dashboard Routes */}
            <Route 
              path="/business/:tenantId" 
              element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Business Widget Routes (Public) */}
            <Route path="/business/:tenantId/widget" element={<WidgetPage />} />
            
            {/* Legacy Routes (Protected) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />
            <Route path="/widget" element={<WidgetPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;