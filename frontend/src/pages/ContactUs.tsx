import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ContactUs: React.FC = () => {
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
      // Simulate sending contact form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submission:', formData);
      
      setSuccess('Thank you for your message! We will get back to you within 24 hours.');
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: '',
        category: 'general'
      }));
    } catch (err: any) {
      setError('Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'press', label: 'Press & Media' },
    { value: 'other', label: 'Other' }
  ];

  const contactInfo = [
    {
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'hello@tinybrosblog.com',
      icon: 'bi-envelope-fill',
      link: 'mailto:hello@tinybrosblog.com'
    },
    {
      title: 'Support Hours',
      description: 'We\'re here to help',
      value: '24/7 Support',
      icon: 'bi-clock-fill',
      link: null
    },
    {
      title: 'Response Time',
      description: 'We aim to respond quickly',
      value: 'Within 24 hours',
      icon: 'bi-lightning-fill',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/tinybrosblog',
      icon: 'bi-twitter',
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/tinybrosblog',
      icon: 'bi-instagram',
      color: '#E4405F'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/tinybrosblog',
      icon: 'bi-facebook',
      color: '#1877F2'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/tinybrosblog',
      icon: 'bi-linkedin',
      color: '#0A66C2'
    }
  ];

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '1000px', width: '100%', marginTop: '2rem' }}>
        {/* Header */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="text-center p-5">
            <h1 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              <i className="bi bi-chat-dots me-3" style={{ color: 'var(--accent)' }}></i>
              Contact Us
            </h1>
            <p className="lead mb-0">
              We'd love to hear from you! Whether you have a question, feedback, 
              or just want to say hello, we're here to help.
            </p>
          </Card.Body>
        </Card>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-4">
            <Card className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body className="p-4">
                <h3 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-send me-2" style={{ color: 'var(--accent)' }}></i>
                  Send us a Message
                </h3>
                
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
                      {contactCategories.map(category => (
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
                      placeholder="What's this about?"
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
                      placeholder="Tell us more about your inquiry..."
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

          {/* Contact Information */}
          <Col lg={4}>
            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body className="p-4">
                <h4 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-info-circle me-2" style={{ color: 'var(--accent)' }}></i>
                  Get in Touch
                </h4>
                
                {contactInfo.map((info, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className={`${info.icon} me-2`} style={{ color: 'var(--accent)', fontSize: '1.2rem' }}></i>
                      <h6 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                        {info.title}
                      </h6>
                    </div>
                    <p className="text-muted small mb-1">{info.description}</p>
                    {info.link ? (
                      <a 
                        href={info.link} 
                        className="text-decoration-none"
                        style={{ color: 'var(--accent)' }}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-muted mb-0">{info.value}</p>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Social Links */}
            <Card className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body className="p-4">
                <h5 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-share me-2" style={{ color: 'var(--accent)' }}></i>
                  Follow Us
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                      style={{ borderColor: social.color, color: social.color }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = social.color;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = social.color;
                      }}
                    >
                      <i className={`${social.icon} me-1`}></i>
                      {social.name}
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Card className={`mt-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h4 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              <i className="bi bi-question-circle me-2" style={{ color: 'var(--accent)' }}></i>
              Frequently Asked Questions
            </h4>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    How quickly do you respond?
                  </h6>
                  <p className="text-muted small mb-0">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    Can I submit a guest post?
                  </h6>
                  <p className="text-muted small mb-0">
                    Yes! We welcome guest contributions. Please email us with your proposal.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    Do you accept advertising?
                  </h6>
                  <p className="text-muted small mb-0">
                    We do accept relevant advertising. Contact us for partnership opportunities.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                    How can I report an issue?
                  </h6>
                  <p className="text-muted small mb-0">
                    Use the contact form above or email us directly for technical issues.
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ContactUs; 