import React, { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, tenantId = null) => {
    try {
      console.log('Attempting login with:', { username, tenantId, hasPassword: !!password });
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'login',
          username, 
          password, 
          tenantId 
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          tenantId: data.user.tenantId,
          tenantName: data.user.tenantName,
          token: data.token
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        console.error('Login failed:', data);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Network error during login:', error);
      return { success: false, error: 'Network error: ' + error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isBusinessAdmin: user?.role === 'business_admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};