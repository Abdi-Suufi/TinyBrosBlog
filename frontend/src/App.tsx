import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Analytics } from "@vercel/analytics/react";
import AuthPage from './pages/AuthPage';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';
import Support from './pages/Support';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminContacts from './pages/AdminContacts';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const LeftSidebar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSidebarLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div
      className={`left-sidebar d-none d-lg-flex flex-column ${theme === 'dark' ? 'text-white' : 'text-dark'}`}
      style={{
        width: '250px',
        minHeight: '100vh',
        marginRight: '1.5rem',
        padding: '1.5rem 1rem',
        borderRight: `1px solid var(--border)`,
        background: theme === 'dark' ? '#23272f' : '#ffffff',
        overflowY: 'auto',
      }}
    >
      <style>{`
        .sidebar-title-link {
          transition: transform 0.18s cubic-bezier(.4,2,.6,1), text-shadow 0.18s cubic-bezier(.4,2,.6,1);
        }
        .sidebar-title-link:hover {
          transform: scale(1.07);
          text-shadow: 0 2px 16px var(--accent, #4dabf7), 0 1px 2px rgba(0,0,0,0.08);
        }
      `}</style>
      <div className="mb-4" style={{ fontFamily: 'Poppins, Inter, sans-serif', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.03em', lineHeight: 1.1, marginLeft: '1.5rem' }}>
        <Link to="/" className="text-decoration-none sidebar-title-link" style={{ color: theme === 'dark' ? '#fff' : '#23272f', display: 'block', textAlign: 'left' }}>
          <div style={{ fontWeight: 700 }}>Tiny</div>
          <div style={{ color: 'var(--accent)', fontWeight: 700 }}>bros</div>
          <div style={{ fontWeight: 400, letterSpacing: '0.08em' }}>blog</div>
        </Link>
      </div>
      <Nav className="flex-column mb-4">
        <Nav.Link as={Link} to="/" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-house-door me-2"></i>Feed</Nav.Link>
        {isAuthenticated && (
          <>
            <Nav.Link as={Link} to="/create" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-plus-circle me-2"></i>Create Post</Nav.Link>
            <Nav.Link as={Link} to="/profile" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-person me-2"></i>Profile</Nav.Link>
            <Nav.Link as={Link} to="/settings" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-gear me-2"></i>Settings</Nav.Link>
          </>
        )}
        <Nav.Link as={Link} to="/support" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-headset me-2"></i>Support</Nav.Link>
        <Nav.Link as={Link} to="/about" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-info-circle me-2"></i>About Us</Nav.Link>
        <Nav.Link as={Link} to="/contact" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-chat-dots me-2"></i>Contact Us</Nav.Link>
        <Nav.Link as={Link} to="/privacy" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-shield-check me-2"></i>Privacy Policy</Nav.Link>
        {user?.role === 'admin' && (
          <Nav.Link as={Link} to="/admin/contacts" className={`${theme === 'dark' ? 'text-warning' : 'text-warning'} mb-2`}><i className="bi bi-inbox me-2"></i>Admin: Support Messages</Nav.Link>
        )}
      </Nav>
      <div className="mt-auto">
        <div className="mb-3">
          <Button 
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
            size="sm" 
            onClick={toggleTheme} 
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
        ) : (
          <div>
            <Nav.Link as={Link} to="/login" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}><i className="bi bi-box-arrow-in-right me-2"></i>Login</Nav.Link>
            <Nav.Link as={Link} to="/register" className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}> <i className="bi bi-person-plus me-2"></i>Register</Nav.Link>
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  // Hide sidebar on login/register
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div data-theme={theme} style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {hideSidebar ? (
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="d-flex flex-row justify-content-center align-items-start mx-auto" style={{ minHeight: '100vh', width: '100%', maxWidth: '1000px', margin: '0 auto', marginLeft: '4rem' }}>
          <LeftSidebar />
          <div style={{ maxWidth: '1400px', width: '100%', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
          <Analytics />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
