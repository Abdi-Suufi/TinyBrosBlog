import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
import { User } from '../types';
import { getBackendAssetUrl } from '../utils/config';

const FollowingSidebar: React.FC = () => {
  const { user, onlineUsers } = useAuth();
  const { theme } = useTheme();
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchFollowing();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      setError('');
      const followingData = await userService.getFollowing(user!.id);
      setFollowing(followingData);
    } catch (err: any) {
      console.error('Error fetching following:', err);
      setError(`Failed to load following list: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show sidebar if not authenticated
  }

  return (
    <div className="following-sidebar" style={{ 
      width: '280px', 
      padding: '1rem',
      marginTop: '6.5rem',
      backgroundColor: theme === 'dark' ? '#23272f' : '#ffffff',
      borderLeft: `1px solid ${theme === 'dark' ? 'var(--border)' : 'var(--border)'}`,
      overflowY: 'auto',
      position: 'sticky', // Add this line
      top: '2rem' // Add this line and adjust the value as needed
    }}>
      <Card style={{ border: 'none', backgroundColor: theme === 'dark' ? '#23272f' : '#ffffff' }}>
        <Card.Header style={{ borderColor: theme === 'dark' ? 'var(--border)' : 'var(--border)', backgroundColor: theme === 'dark' ? '#23272f' : '#ffffff', color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)' }}>
          <h6 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Following ({following.length})
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-3">
              <Spinner animation="border" size="sm" />
              <div className="mt-2 small text-muted">Loading...</div>
            </div>
          ) : error ? (
            <Alert variant="danger" className="m-2">
              {error}
            </Alert>
          ) : following.length === 0 ? (
            <div className="text-center p-3">
              <i className="bi bi-people text-muted" style={{ fontSize: '2rem' }}></i>
              <div className="mt-2 small text-muted">Not following anyone yet</div>
              <div className="small text-muted">Discover new food bloggers!</div>
            </div>
          ) : (
            <ListGroup variant="flush">
              {following.map((followedUser) => (
                <ListGroup.Item 
                  key={followedUser._id}
                  style={{ 
                    background: theme === 'dark' ? '#23272f' : '#ffffff',
                    borderColor: theme === 'dark' ? 'var(--border)' : 'var(--border)',
                    padding: '0.75rem 1rem',
                    color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)'
                  }}
                >
                  <Link 
                    to={`/profile/${followedUser._id}`} 
                    className="text-decoration-none d-flex align-items-center"
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={followedUser.profilePicture ? getBackendAssetUrl(followedUser.profilePicture) : 'https://via.placeholder.com/40'}
                        alt={followedUser.displayName}
                        className="rounded-circle me-3"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      {onlineUsers && onlineUsers.includes(followedUser._id) ? (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 6,
                            width: 12,
                            height: 12,
                            background: '#4caf50',
                            border: '1px solid #fff',
                            borderRadius: '50%',
                            zIndex: 2,
                            display: 'block',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 6,
                            width: 12,
                            height: 12,
                            background: '#bdbdbd',
                            border: '1px solid #fff',
                            borderRadius: '50%',
                            zIndex: 2,
                            display: 'block',
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className={`fw-bold ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                        {followedUser.displayName}
                      </div>
                      <div className="small text-muted">
                        @{followedUser.username}
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-people me-1"></i>
                        {followedUser.followers.length} followers
                      </div>
                    </div>
                    <Badge 
                      bg={theme === 'dark' ? 'secondary' : 'light'} 
                      text={theme === 'dark' ? 'white' : 'dark'}
                      className="ms-2"
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Following
                    </Badge>
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FollowingSidebar; 