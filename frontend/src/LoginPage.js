import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [loginType, setLoginType] = useState('super_admin'); // 'super_admin' or 'business'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(
      username, 
      password, 
      loginType === 'business' ? tenantId : null
    );

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>CRM System Login</h2>
        
        <div className="login-type-selector">
          <button 
            type="button"
            className={`type-btn ${loginType === 'super_admin' ? 'active' : ''}`}
            onClick={() => setLoginType('super_admin')}
          >
            Super Admin
          </button>
          <button 
            type="button"
            className={`type-btn ${loginType === 'business' ? 'active' : ''}`}
            onClick={() => setLoginType('business')}
          >
            Business Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loginType === 'business' && (
            <div className="form-group">
              <label htmlFor="tenantId">Business ID:</label>
              <input
                type="text"
                id="tenantId"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="Your business ID"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Super Admin:</strong><br/>
             Username: superadmin<br/>
             Password: admin123</p>
          <p><strong>Business (demo):</strong><br/>
             Business ID: demo<br/>
             Username: admin<br/>
             Password: business123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;