import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import SuperAdminDashboard from './SuperAdminDashboard';
import SuperAdminBusinessView from './SuperAdminBusinessView';
import BusinessDashboard from './BusinessDashboard';
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
    // If trying to access a business route, redirect to login
    if (window.location.pathname.startsWith('/business/')) {
      window.location.href = '/login';
      return null;
    }
    return <LoginPage />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="unauthorized">Access denied</div>;
  }

  return children;
}

function Home() {
  const { user } = useAuth();
  
  // Redirect users to their appropriate dashboard
  React.useEffect(() => {
    if (user) {
      if (user.role === 'super_admin') {
        window.location.href = '/super-admin';
      } else if (user.role === 'business_admin') {
        window.location.href = `/business/${user.tenantId}`;
      }
    }
  }, [user]);
  
  // Loading state while redirecting
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to CRM</h1>
      <p>Redirecting you to your dashboard...</p>
    </div>
  );
}

function AppContent() {
  return (
    <div className="App">
      <Router>
        <main>
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
            <Route 
              path="/super-admin/business/:tenantId" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <SuperAdminBusinessView />
                </ProtectedRoute>
              } 
            />
            
            {/* Business Dashboard Routes - Now protected with proper authentication */}
            <Route 
              path="/business/:tenantId" 
              element={
                <ProtectedRoute requiredRole="business_admin">
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Business Widget Routes (Public) */}
            <Route path="/business/:tenantId/widget" element={<WidgetPage />} />
            
            {/* Legacy Home Route - redirects to appropriate dashboard */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
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