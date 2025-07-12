import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const AppContent: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <div className="d-flex">
      {/* Mobile Toggle Button */}
      <Button 
        variant="dark" 
        className="d-md-none position-fixed" 
        style={{ top: '10px', left: '10px', zIndex: 1001 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <i className="bi bi-list"></i>
      </Button>

      {/* Side Panel */}
      <div className={`sidebar ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'} ${showSidebar ? 'show' : ''}`} style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000 }}>
        <div className="p-3">
          <h4 className="mb-4">
            <Link to="/" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} text-decoration-none`}>TinyBrosBlog</Link>
          </h4>
          
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
              <i className="bi bi-house-door me-2"></i>
              Feed
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/create" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Post
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/settings" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <hr className="my-4" />
          
          <div className="mt-auto">
            {/* Theme Toggle */}
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
                <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} size="sm" onClick={logout} className="w-100">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Nav.Link as={Link} to="/login" className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Nav.Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: '250px', width: 'calc(100% - 250px)', minHeight: '100vh' }}>
        {/* Mobile Overlay */}
        {showSidebar && (
          <div 
            className="d-md-none position-fixed" 
            style={{ 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              zIndex: 999 
            }}
            onClick={() => setShowSidebar(false)}
          />
        )}
        <div className="p-3">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
