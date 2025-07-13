import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import PostCard from '../components/PostCard';
import { getBackendAssetUrl } from '../utils/config';

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
  const [followersData, setFollowersData] = useState<User[]>([]);
  const [followingData, setFollowingData] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const userId = id || currentUser?.id;
  const isOwnProfile = !id || currentUser?.id === id;

  useEffect(() => {
    console.log('Profile useEffect - id:', id, 'currentUser:', currentUser, 'userId:', userId);
    
    // If we're on /profile (no ID) and currentUser is not loaded yet, wait
    if (!id && !currentUser) {
      console.log('Waiting for auth to load...');
      return; // Don't redirect yet, wait for auth to load
    }
    
    if (!userId) {
      console.log('No userId, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Fetching user profile for userId:', userId);
    fetchUserProfile();
  }, [userId, currentUser, id]);

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

  const fetchFollowersData = async () => {
    if (!user || user.followers.length === 0) return;
    
    try {
      setLoadingFollowers(true);
      const followers = await Promise.all(
        user.followers.map(async (follower: any) => {
          try {
            // If it's already a populated user object, use it directly
            if (typeof follower === 'object' && follower.username) {
              return follower;
            }
            // If it's a string ID, fetch the user
            const userId = typeof follower === 'string' ? follower : follower._id;
            return await userService.getUserProfile(userId);
          } catch (err) {
            console.error('Failed to fetch follower:', err);
            return null;
          }
        })
      );
      setFollowersData(followers.filter(Boolean) as User[]);
    } catch (err) {
      console.error('Failed to fetch followers data:', err);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingData = async () => {
    if (!user || user.following.length === 0) return;
    
    try {
      setLoadingFollowing(true);
      const following = await Promise.all(
        user.following.map(async (followingUser: any) => {
          try {
            // If it's already a populated user object, use it directly
            if (typeof followingUser === 'object' && followingUser.username) {
              return followingUser;
            }
            // If it's a string ID, fetch the user
            const userId = typeof followingUser === 'string' ? followingUser : followingUser._id;
            return await userService.getUserProfile(userId);
          } catch (err) {
            console.error('Failed to fetch following user:', err);
            return null;
          }
        })
      );
      setFollowingData(following.filter(Boolean) as User[]);
    } catch (err) {
      console.error('Failed to fetch following data:', err);
    } finally {
      setLoadingFollowing(false);
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
          ? [...prev.followers, { _id: currentUser.id, username: currentUser.username, displayName: currentUser.displayName, profilePicture: currentUser.profilePicture }]
          : prev.followers.filter(follower => 
              typeof follower === 'string' ? follower !== currentUser.id : follower._id !== currentUser.id
            )
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

  const handleTabSelect = (tabKey: string | null) => {
    if (tabKey === 'followers' && followersData.length === 0) {
      fetchFollowersData();
    } else if (tabKey === 'following' && followingData.length === 0) {
      fetchFollowingData();
    }
    setActiveTab(tabKey || 'posts');
  };

  // Check if current user is following the profile user
  const isFollowing = user && currentUser ? 
    user.followers.some(follower => 
      typeof follower === 'string' ? follower === currentUser.id : follower._id === currentUser.id
    ) : false;

  // Show loading spinner while auth is loading or profile is loading
  if (loading || (!currentUser && !id)) {
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
                    src={user.profilePicture ? getBackendAssetUrl(user.profilePicture) : 'https://via.placeholder.com/150'}
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
            onSelect={handleTabSelect}
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
                  ) : loadingFollowers ? (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Loading followers...</span>
                    </div>
                  ) : (
                    <div>
                      {followersData.map((follower) => (
                        <div key={follower._id} className="d-flex align-items-center mb-3 p-2 border rounded">
                          <img
                            src={follower.profilePicture ? getBackendAssetUrl(follower.profilePicture) : 'https://via.placeholder.com/40'}
                            alt={follower.displayName}
                            className="rounded-circle me-3"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{follower.displayName}</div>
                            <div className="text-muted small">@{follower.username}</div>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/profile/${follower._id}`)}
                          >
                            View Profile
                          </Button>
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
                  ) : loadingFollowing ? (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Loading following...</span>
                    </div>
                  ) : (
                    <div>
                      {followingData.map((followingUser) => (
                        <div key={followingUser._id} className="d-flex align-items-center mb-3 p-2 border rounded">
                          <img
                            src={followingUser.profilePicture ? getBackendAssetUrl(followingUser.profilePicture) : 'https://via.placeholder.com/40'}
                            alt={followingUser.displayName}
                            className="rounded-circle me-3"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{followingUser.displayName}</div>
                            <div className="text-muted small">@{followingUser.username}</div>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/profile/${followingUser._id}`)}
                          >
                            View Profile
                          </Button>
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