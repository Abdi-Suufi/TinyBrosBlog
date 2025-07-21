import React, { useEffect, useState } from 'react';
import { getSupportMessages } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Table, Alert, Spinner } from 'react-bootstrap';

const AdminContacts: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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