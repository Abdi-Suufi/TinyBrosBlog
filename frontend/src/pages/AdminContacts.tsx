import React, { useEffect, useState } from 'react';
import { getSupportMessages, updateSupportMessageStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Table, Alert, Spinner, Form } from 'react-bootstrap';

const statusOptions = ['open', 'in progress', 'closed'];

const AdminContacts: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

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

  if (!user || user.role !== 'admin') {
    return <Container className="mt-5"><Alert variant="danger">Access denied. Admins only.</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Support Messages</h2>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : messages.length === 0 ? (
            <Alert variant="info">No support messages found.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg._id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.category}</td>
                    <td>{msg.subject}</td>
                    <td>{msg.message}</td>
                    <td>
                      <Form.Select
                        value={msg.status || 'open'}
                        onChange={e => handleStatusChange(msg._id, e.target.value)}
                        disabled={statusUpdating === msg._id}
                        size="sm"
                        style={{ minWidth: 120 }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminContacts; 