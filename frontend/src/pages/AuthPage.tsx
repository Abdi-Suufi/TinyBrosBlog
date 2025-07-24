import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AuthPage.css';
import { authService } from '../services/authService';
import { Nav, Button } from 'react-bootstrap';

// Copy MobileSidebar from App.tsx for reuse
const MobileSidebar: React.FC<{ show: boolean; onClose: () => void; setIsSignUp: (v: boolean) => void }> = ({ show, onClose, setIsSignUp }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSidebarLogout = () => {
    logout();
    navigate('/', { replace: true });
    onClose();
  };

  return (
    <>
      <div
        className={`mobile-sidebar-overlay${show ? ' show' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 2000,
          display: show ? 'block' : 'none',
        }}
      />
      <div
        className={`mobile-sidebar${show ? ' show' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: show ? 0 : '-260px',
          width: '250px',
          height: '100vh',
          background: theme === 'dark' ? '#23272f' : '#fff',
          zIndex: 2100,
          boxShadow: '2px 0 16px rgba(0,0,0,0.12)',
          transition: 'left 0.3s ease',
          padding: '1.5rem 1rem',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/" className="text-decoration-none sidebar-title-link" style={{ color: theme === 'dark' ? '#fff' : '#23272f', fontWeight: 700, fontSize: '1.2rem' }}>
            Tiny <span style={{ color: 'var(--accent)' }}>bros</span> blog
          </Link>
          <Button variant="link" size="sm" onClick={onClose} style={{ color: theme === 'dark' ? '#fff' : '#23272f' }}>
            <i className="bi bi-x-lg" style={{ fontSize: '1.3rem' }}></i>
          </Button>
        </div>
        <Nav className="flex-column mb-4">
          <Nav.Link as={Link} to="/" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-house-door me-2"></i>Feed</Nav.Link>
          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/create" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-plus-circle me-2"></i>Create Post</Nav.Link>
              <Nav.Link as={Link} to="/profile" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-person me-2"></i>Profile</Nav.Link>
              <Nav.Link as={Link} to="/settings" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-gear me-2"></i>Settings</Nav.Link>
            </>
          )}
          <Nav.Link as={Link} to="/support" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-headset me-2"></i>Support</Nav.Link>
          <Nav.Link as={Link} to="/about" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-info-circle me-2"></i>About Us</Nav.Link>
          <Nav.Link as={Link} to="/contact" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-chat-dots me-2"></i>Contact Us</Nav.Link>
          <Nav.Link as={Link} to="/privacy" onClick={onClose} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-shield-check me-2"></i>Privacy Policy</Nav.Link>
          {!isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/login" onClick={() => { navigate('/login'); onClose(); }} className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-box-arrow-in-right me-2"></i>Login</Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={() => { navigate('/register'); onClose(); }} className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}> <i className="bi bi-person-plus me-2"></i>Register</Nav.Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Nav.Link as={Link} to="/admin/contacts" onClick={onClose} className={`${theme === 'dark' ? 'text-warning' : 'text-warning'} mb-2`}><i className="bi bi-inbox me-2"></i>Admin: Support Messages</Nav.Link>
          )}
        </Nav>
        <div className="mb-3">
          <Button 
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
            size="sm" 
            onClick={() => { toggleTheme(); onClose(); }} 
            className="w-100 mb-2"
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} me-2`}></i>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
        {isAuthenticated ? (
          <div>
            <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2 small`}>
              Welcome, {user?.displayName}!
            </div>
            <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} size="sm" onClick={handleSidebarLogout} className="w-100">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
};

const AuthPage: React.FC = () => {
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme effect for body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  // Login form handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Register form handlers
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(
        registerData.username,
        registerData.email,
        registerData.password,
        registerData.displayName
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  // SVG Google icon
  const googleIcon = (
    <svg width="24" height="24" viewBox="0 0 48 48">
      <g>
        <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.2z"/>
        <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.3 5.1 29.4 3 24 3 15.3 3 7.9 8.6 6.3 14.7z"/>
        <path fill="#FBBC05" d="M24 43c5.3 0 10.2-1.7 13.9-4.7l-6.4-5.2c-2 1.4-4.5 2.2-7.5 2.2-5.6 0-10.3-3.8-12-9l-6.6 5.1C7.8 39.4 15.3 43 24 43z"/>
        <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.7-4.1 4.9l6.4 5.2C40.7 39.2 44 32.7 44 24c0-1.3-.1-2.2-.4-3.5z"/>
      </g>
    </svg>
  );

  useEffect(() => {
    // Handle Google OAuth callback
    if (authService.handleGoogleCallback()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="auth-page-container" data-theme={theme} style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? 'var(--auth-bg)' : 'var(--auth-neu-1)'
    }}>
      {/* Hamburger for mobile */}
      {!mobileSidebarOpen && (
        <button
          className="hamburger-menu d-lg-none"
          style={{
            position: 'fixed',
            top: 18,
            left: 18,
            zIndex: 2200,
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
            cursor: 'pointer',
          }}
          aria-label="Open navigation menu"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <i className="bi bi-list" style={{ fontSize: '2rem', color: 'var(--accent, #4dabf7)' }}></i>
        </button>
      )}
      <MobileSidebar show={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} setIsSignUp={setIsSignUp} />
      <div className={`auth-main${theme === 'dark' ? ' dark' : ''}`}> 
        {!isSignUp ? (
          <form className="form" onSubmit={handleLoginSubmit} autoComplete="off">
            <h2 className="form_title title">Sign in to Website</h2>
            <button type="button" className="form__button button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, width: 48, height: 48, padding: 0 }} onClick={handleGoogleLogin}>
              {googleIcon}
            </button>
            <span className="form__span">or use your email account</span>
            <input className="form__input" type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
            <input className="form__input" type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
            <a className="form__link" href="#" tabIndex={-1}>Forgot your password?</a>
            {error && !isSignUp && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <button className="form__button button submit" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'SIGN IN'}</button>
            <div className="w-100 text-center mt-3">
              <span>Don't have an account? </span>
              <button type="button" className="btn btn-link p-0" style={{ fontSize: 15 }} onClick={() => navigate('/register')}>Sign up</button>
            </div>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegisterSubmit} autoComplete="off">
            <h2 className="form_title title">Create Account</h2>
            <button type="button" className="form__button button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, width: 48, height: 48, padding: 0 }} onClick={handleGoogleLogin}>
              {googleIcon}
            </button>
            <span className="form__span">or use email for registration</span>
            <input className="form__input" type="text" name="username" placeholder="Username" value={registerData.username} onChange={handleRegisterChange} required minLength={3} />
            <input className="form__input" type="text" name="displayName" placeholder="Display Name" value={registerData.displayName} onChange={handleRegisterChange} required />
            <input className="form__input" type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
            <input className="form__input" type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required minLength={6} />
            <input className="form__input" type="password" name="confirmPassword" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={handleRegisterChange} required minLength={6} />
            {error && isSignUp && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <button className="form__button button submit" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'SIGN UP'}</button>
            <div className="w-100 text-center mt-3">
              <span>Already have an account? </span>
              <button type="button" className="btn btn-link p-0" style={{ fontSize: 15 }} onClick={() => navigate('/login')}>Sign in</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 