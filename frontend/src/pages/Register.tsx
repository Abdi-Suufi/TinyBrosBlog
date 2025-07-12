import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password, formData.displayName);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
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
            <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                    borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                    color: theme === 'dark' ? 'var(--text-primary)' : undefined
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Display Name</Form.Label>
                <Form.Control
                  type="text"
                  name="displayName"
                  value={formData.displayName}
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
                  minLength={6}
                  className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                    borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                    color: theme === 'dark' ? 'var(--text-primary)' : undefined
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </Container>
  );
};

export default Register; 