import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { getBackendAssetUrl } from '../utils/config';
import { formatDate, formatFullDate } from '../utils/dateUtils';
import CommentItem from '../components/CommentItem';
import HamsterLoader from '../components/HamsterLoader';
import { useTheme } from '../context/ThemeContext';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const postData = await postService.getPost(id!);
      setPost(postData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;
    
    try {
      const updatedPost = await postService.likePost(post._id);
      setPost(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !commentText.trim()) return;

    setCommentLoading(true);
    try {
      const newComment = await postService.addComment(post._id, commentText);
      setPost(prev => prev ? {
        ...prev,
        comments: [newComment, ...prev.comments]
      } : null);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;
    
    try {
      await postService.deleteComment(post._id, commentId);
      setPost(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(comment => comment._id !== commentId)
      } : null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentUpdate = (updatedComment: Comment) => {
    if (!post) return;
    
    setPost(prev => prev ? {
      ...prev,
      comments: prev.comments.map(comment => 
        comment._id === updatedComment._id ? updatedComment : comment
      )
    } : null);
  };

  const handleDeletePost = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postService.deletePost(post._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <HamsterLoader theme={theme} />;
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Alert variant="warning">Post not found</Alert>
      </Container>
    );
  }

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isAuthor = user ? post.author._id === user.id : false;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={10} style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Post Header */}
          <Card className="mb-4" style={{ marginTop: '2rem' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <img
                    src={post.author.profilePicture ? getBackendAssetUrl(post.author.profilePicture) : 'https://placehold.co/600x400'}
                    alt={post.author.displayName}
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div>
                    <Link to={`/profile/${post.author._id}`} className="text-decoration-none">
                      <h5 className="mb-0">{post.author.displayName}</h5>
                    </Link>
                    <small className="text-muted">
                      {formatFullDate(post.createdAt)}
                    </small>
                  </div>
                </div>
                {isAuthor && (
                  <Button variant="outline-danger" size="sm" onClick={handleDeletePost}>
                    Delete
                  </Button>
                )}
              </div>

              <h2>{post.title}</h2>
              
              <img
                src={getBackendAssetUrl(post.image)}
                alt={post.title}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />

              <p className="lead">{post.body}</p>

              {post.restaurantName && (
                <div className="mb-2">
                  <strong>Restaurant:</strong> {post.restaurantName}
                </div>
              )}

              {post.location && (
                <div className="mb-2">
                  <strong>Location:</strong> {post.location}
                </div>
              )}

              <div className="mb-3">
                <span className="text-warning fs-4">{renderStars(post.rating)}</span>
                <span className="text-muted ms-2">({post.rating}/5)</span>
              </div>

              {post.tags.length > 0 && (
                <div className="mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="d-flex align-items-center mb-3">
                <Button
                  variant={isLiked ? 'danger' : 'outline-danger'}
                  size="sm"
                  onClick={handleLike}
                  disabled={!user}
                  className="me-3"
                >
                  ❤️ {post.likeCount}
                </Button>
                <span className="text-muted">
                  💬 {post.commentCount} comments
                </span>
              </div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card>
            <Card.Body>
              <h4>Comments</h4>
              
              {user && (
                <Form onSubmit={handleComment} className="mb-4">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={commentLoading}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={commentLoading || !commentText.trim()}
                    className="mt-2"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </Button>
                </Form>
              )}

              {post.comments.length === 0 ? (
                <p className="text-muted">No comments yet. Be the first to comment!</p>
              ) : (
                <div>
                  {post.comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      onCommentUpdate={handleCommentUpdate}
                      onCommentDelete={handleDeleteComment}
                      isAuthor={isAuthor}
                    />
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail; 