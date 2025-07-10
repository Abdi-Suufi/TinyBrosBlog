import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import PostCard from '../components/PostCard';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');

  const userId = id || currentUser?.id;
  const isOwnProfile = !id || currentUser?.id === id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await userService.getUserProfile(userId!);
      setUser(userData);
      fetchUserPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (page: number = 1) => {
    try {
      const data = await userService.getUserPosts(userId!, page, 10);
      setPosts(data.posts);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (err: any) {
      console.error('Failed to fetch user posts:', err);
    }
  };

  const handleFollow = async () => {
    if (!user || !currentUser) return;

    try {
      const result = await userService.followUser(user._id);
      // Update the user's followers/following counts
      setUser(prev => prev ? {
        ...prev,
        followers: result.following 
          ? [...prev.followers, currentUser.id]
          : prev.followers.filter(id => id !== currentUser.id)
      } : null);
    } catch (err: any) {
      console.error('Failed to follow user:', err);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    setTotalPosts(prev => prev - 1);
  };

  const isFollowing = user && currentUser ? user.followers.includes(currentUser.id) : false;

  // Helper function to safely render user IDs
  const renderUserId = (userId: any) => {
    if (typeof userId === 'string') {
      return userId;
    }
    if (typeof userId === 'object' && userId._id) {
      return userId._id;
    }
    return 'Unknown User';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          {/* Profile Header */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <img
                    src={user.profilePicture ? `http://localhost:5000${user.profilePicture}` : 'https://via.placeholder.com/150'}
                    alt={user.displayName}
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={9}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h2>{user.displayName}</h2>
                      <p className="text-muted">@{user.username}</p>
                      {user.bio && <p>{user.bio}</p>}
                      <div className="mb-3">
                        <Badge bg="primary" className="me-2">
                          {user.followers.length} Followers
                        </Badge>
                        <Badge bg="secondary">
                          {user.following.length} Following
                        </Badge>
                      </div>
                    </div>
                    <div>
                      {!isOwnProfile && currentUser && (
                        <Button
                          variant={isFollowing ? 'outline-secondary' : 'primary'}
                          onClick={handleFollow}
                        >
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      )}
                      {isOwnProfile && (
                        <Button
                          variant="outline-primary"
                          onClick={() => navigate('/settings')}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'posts')}
            className="mb-4"
          >
            <Tab eventKey="posts" title={`Posts (${totalPosts})`}>
              {posts.length === 0 ? (
                <Alert variant="info">
                  {isOwnProfile ? 'You haven\'t posted anything yet.' : 'This user hasn\'t posted anything yet.'}
                </Alert>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onPostUpdate={handlePostUpdate}
                      onPostDelete={handlePostDelete}
                    />
                  ))}
                  
                  {/* Simple pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        variant="outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => fetchUserPosts(currentPage - 1)}
                        className="me-2"
                      >
                        Previous
                      </Button>
                      <span className="align-self-center mx-3">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchUserPosts(currentPage + 1)}
                        className="ms-2"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Tab>
            
            <Tab eventKey="followers" title={`Followers (${user.followers.length})`}>
              <Card>
                <Card.Body>
                  {user.followers.length === 0 ? (
                    <p className="text-muted">No followers yet.</p>
                  ) : (
                    <div>
                      {user.followers.map((followerId, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Follower"
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <span>User ID: {renderUserId(followerId)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="following" title={`Following (${user.following.length})`}>
              <Card>
                <Card.Body>
                  {user.following.length === 0 ? (
                    <p className="text-muted">Not following anyone yet.</p>
                  ) : (
                    <div>
                      {user.following.map((followingId, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Following"
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <span>User ID: {renderUserId(followingId)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 