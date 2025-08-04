import React, { useEffect, useState } from 'react';
import { getSupportMessages, updateSupportMessageStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Container, Card, Alert, Spinner, Form, Row, Col, Badge, Button, Collapse } from 'react-bootstrap';

const statusOptions = ['open', 'in progress', 'closed'];

const AdminContacts: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      getSupportMessages()
        .then(res => setMessages(res.data))
        .catch(err => setError(err.response?.data?.message || 'Failed to fetch support messages.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleStatusChange = async (id: string, status: string) => {
    setStatusUpdating(id);
    try {
      const res = await updateSupportMessageStatus(id, status);
      setMessages(msgs => msgs.map(m => m._id === id ? { ...m, status: res.data.status } : m));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(null);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in progress': return 'warning';
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return 'bi-question-circle';
      case 'technical': return 'bi-tools';
      case 'account': return 'bi-person-circle';
      case 'feature': return 'bi-lightbulb';
      case 'bug': return 'bi-bug';
      case 'other': return 'bi-chat-dots';
      default: return 'bi-chat-dots';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <i className="bi bi-shield-exclamation me-2"></i>
          Access denied. Admins only.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '1200px' }}>
      <div className="d-flex align-items-center mb-4">
        <div>
          <h2 className={`mb-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
            <i className="bi bi-headset me-3"></i>
            Support Messages
          </h2>
          <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-0`}>
            Manage and respond to user support requests
          </p>
        </div>
        <Badge 
          bg="primary" 
          className="ms-auto fs-6 px-3 py-2"
          style={{ backgroundColor: 'var(--accent) !important' }}
        >
          {messages.length} {messages.length === 1 ? 'ticket' : 'tickets'}
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: 'var(--accent)' }} />
          <p className={`mt-3 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            Loading support messages...
          </p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      ) : messages.length === 0 ? (
        <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted mb-3"></i>
            <h5 className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
              No support messages found
            </h5>
            <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
              When users submit support requests, they will appear here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {messages.map(msg => (
            <Col key={msg._id} xs={12}>
              <Card 
                className={`h-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`}
                style={{
                  borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                  backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--accent)',
                          color: 'white'
                        }}
                      >
                        <i className={`bi ${getCategoryIcon(msg.category)}`}></i>
                      </div>
                      <div>
                        <h6 className={`mb-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                          {msg.subject}
                        </h6>
                        <p className={`small mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                          {msg.name} • {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      bg={getStatusBadgeVariant(msg.status || 'open')}
                      className="ms-2"
                    >
                      {msg.status || 'open'}
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className={`bi ${getCategoryIcon(msg.category)} me-1 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}></i>
                      <span className={`small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                        {msg.category}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}
                      onClick={() => toggleExpanded(msg._id)}
                      aria-controls={`collapse-${msg._id}`}
                      aria-expanded={expandedTicketId === msg._id}
                    >
                      <i className={`bi ${expandedTicketId === msg._id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </Button>
                  </div>

                  <Collapse in={expandedTicketId === msg._id}>
                    <div id={`collapse-${msg._id}`}>
                      <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--border) !important' }}>
                        <div className="mb-3">
                          <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                            <i className="bi bi-envelope me-2"></i>
                            Contact Information
                          </h6>
                          <div className="row">
                            <div className="col-6">
                              <small className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Name</small>
                              <p className={`mb-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{msg.name}</p>
                            </div>
                            <div className="col-6">
                              <small className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Email</small>
                              <p className={`mb-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                                <a href={`mailto:${msg.email}`} className="text-decoration-none" style={{ color: 'var(--accent)' }}>
                                  {msg.email}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h6 className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`}>
                            <i className="bi bi-chat-text me-2"></i>
                            Message
                          </h6>
                          <div 
                            className="p-3 rounded"
                            style={{
                              backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f8f9fa',
                              border: `1px solid ${theme === 'dark' ? 'var(--border)' : '#dee2e6'}`
                            }}
                          >
                            <p className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                              {msg.message}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <small className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                              <i className="bi bi-clock me-1"></i>
                              {new Date(msg.createdAt).toLocaleString()}
                            </small>
                          </div>
                          <Form.Select
                            value={msg.status || 'open'}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(msg._id, e.target.value);
                            }}
                            disabled={statusUpdating === msg._id}
                            size="sm"
                            style={{ 
                              minWidth: 140,
                              backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                              color: theme === 'dark' ? 'var(--text-primary)' : undefined
                            }}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AdminContacts;