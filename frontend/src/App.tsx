import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppContent: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">TinyBrosBlog</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Feed</Nav.Link>
              {isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/create">Create Post</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">
                    Welcome, {user?.displayName}!
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="mt-3">
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
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
