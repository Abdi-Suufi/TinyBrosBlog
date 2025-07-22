import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Support: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate sending support request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Support request:', formData);
      
      setSuccess('Thank you for contacting us! We will get back to you within 24 hours.');
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: '',
        category: 'general'
      }));
    } catch (err: any) {
      setError('Failed to send support request. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const supportCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'account', label: 'Account Problem' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}>
        <Row>
          <Col lg={8}>
            <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body>
                <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-headset me-3"></i>
                  Contact Support
                </h2>
                
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          style={{
                            backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                            borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                            color: theme === 'dark' ? 'var(--text-primary)' : undefined
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          style={{
                            backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                            borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                            color: theme === 'dark' ? 'var(--text-primary)' : undefined
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Category *</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    >
                      {supportCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief description of your issue..."
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
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about your issue..."
                      required
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <i className="bi bi-hourglass-split me-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body>
                <h5 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-info-circle me-2"></i>
                  Support Information
                </h5>
                
                <div className="mb-4">
                  <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                    <i className="bi bi-clock me-2"></i>
                    Response Time
                  </h6>
                  <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`}>
                    We typically respond within 24 hours during business days.
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                    <i className="bi bi-envelope me-2"></i>
                    Direct Email
                  </h6>
                  <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`}>
                    <a href="mailto:support@tinybrosblog.com" className={theme === 'dark' ? 'text-info' : 'text-primary'}>
                      support@tinybrosblog.com
                    </a>
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                    <i className="bi bi-github me-2"></i>
                    GitHub Issues
                  </h6>
                  <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`}>
                    For bug reports and feature requests, you can also create an issue on our GitHub repository.
                  </p>
                  <Button
                    href="https://github.com/Abdi-Suufi/TinyBrosBlog/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-secondary"
                    size="sm"
                    className="w-100"
                  >
                    <i className="bi bi-box-arrow-up-right me-2"></i>
                    Open GitHub Issues
                  </Button>
                </div>

                <div>
                  <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                    <i className="bi bi-question-circle me-2"></i>
                    FAQ
                  </h6>
                  <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`}>
                    Check our frequently asked questions for quick answers to common issues.
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100"
                  >
                    <i className="bi bi-book me-2"></i>
                    View FAQ
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Support; 