import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body>
            <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                    borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                    color: theme === 'dark' ? 'var(--text-primary)' : undefined
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                    borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                    color: theme === 'dark' ? 'var(--text-primary)' : undefined
                  }}
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100"
                type="submit"
                variant="primary"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </Container>
  );
};

export default Login; 