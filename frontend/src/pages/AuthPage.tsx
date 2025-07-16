import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthPage.css';
import { authService } from '../services/authService';

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

  // Animation refs
  const mainRef = useRef<HTMLDivElement>(null);
  const aContainerRef = useRef<HTMLDivElement>(null);
  const bContainerRef = useRef<HTMLDivElement>(null);
  const switchCntRef = useRef<HTMLDivElement>(null);
  const switchCircleRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const switchC1Ref = useRef<HTMLDivElement>(null);
  const switchC2Ref = useRef<HTMLDivElement>(null);

  // Theme effect for body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Set isSignUp based on route
  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location.pathname]);

  // Switch animation
  const handleSwitch = () => {
    setIsSignUp((prev) => !prev);
  };

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
      <div className={`auth-main${theme === 'dark' ? ' dark' : ''}`} ref={mainRef}>
        {/* Register Form */}
        <div className={`container a-container${isSignUp ? ' is-txl' : ''}`} id="a-container" ref={aContainerRef}>
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
          </form>
        </div>
        {/* Login Form */}
        <div className={`container b-container${isSignUp ? ' is-txl is-z200' : ''}`} id="b-container" ref={bContainerRef}>
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
          </form>
        </div>
        {/* Switcher */}
        <div className={`switch${isSignUp ? ' is-txr' : ''}`} id="switch-cnt" ref={switchCntRef}>
          <div className="switch__circle" ref={switchCircleRefs[0]}></div>
          <div className="switch__circle switch__circle--t" ref={switchCircleRefs[1]}></div>
          <div className={`switch__container${!isSignUp ? '' : ' is-hidden'}`} id="switch-c1" ref={switchC1Ref}>
            <h2 className="switch__title title">Welcome Back !</h2>
            <p className="switch__description description">To keep connected with us please login with your personal info</p>
            <button className="switch__button button switch-btn" onClick={handleSwitch} type="button">SIGN IN</button>
          </div>
          <div className={`switch__container${isSignUp ? '' : ' is-hidden'}`} id="switch-c2" ref={switchC2Ref}>
            <h2 className="switch__title title">Hello Friend !</h2>
            <p className="switch__description description">Enter your personal details and start journey with us</p>
            <button className="switch__button button switch-btn" onClick={handleSwitch} type="button">SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 