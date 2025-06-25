import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginUser(formData);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Redirect to home page
      navigate('/', { 
        state: { 
          message: 'Login successful!' 
        } 
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login to Your Account</h2>
        
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
