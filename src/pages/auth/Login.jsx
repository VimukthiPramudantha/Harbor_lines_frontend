import { useState } from 'react';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/Login.css';
import logo from '../../assets/logo.png'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <h1>Sign In</h1>
          <p className="subtitle">Enter Your User Name and Password to Sign in.</p>
          <div className="divider"></div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <label>User Name <span className="required">*</span></label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Admin123"
                required
              />
            </div>

            <div className="input-group">
              <label>Password <span className="required">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                required
              />
            </div>

            <div className="options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Keep me Logged in</span>
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="login-branding-section">
        <div className="branding-content">
          <img src={logo} alt="logo"  id='logo'/>
        </div>
      </div>
    </div>
  );
};

export default Login;