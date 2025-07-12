import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { postService } from '../services/postService';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isAuthor = user ? post.author._id === user.id : false;

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const updatedPost = await postService.likePost(post._id);
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setLoading(true);
    try {
      const newComment = await postService.addComment(post._id, commentText);
      const updatedPost = { ...post, comments: [newComment, ...post.comments] };
      onPostUpdate?.(updatedPost);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await postService.deleteComment(post._id, commentId);
      const updatedPost = {
        ...post,
        comments: post.comments.filter(comment => comment._id !== commentId)
      };
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postService.deletePost(post._id);
      onPostDelete?.(post._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className={`border rounded mb-3 fade-in ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`} style={{ 
      maxWidth: '100%',
      color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)'
    }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src={post.author.profilePicture ? `http://localhost:5000${post.author.profilePicture}` : 'https://via.placeholder.com/32'}
            alt={post.author.displayName}
            className="rounded-circle me-2"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          <div>
                    <Link to={`/profile/${post.author._id}`} className="text-decoration-none">
          <div className={`fw-bold small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{post.author.displayName}</div>
        </Link>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
          </div>
        </div>
        {isAuthor && (
          <Button variant="outline-danger" size="sm" onClick={handleDeletePost} style={{ fontSize: '0.75rem' }}>
            Delete
          </Button>
        )}
      </div>

      {/* Image */}
      <img
        src={`http://localhost:5000${post.image}`}
        alt={post.title}
        className="w-100"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
      />

      {/* Content */}
      <div className="p-2">
        <Link to={`/post/${post._id}`} className={`text-decoration-none ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
          <h6 className="mb-1 fw-bold">{post.title}</h6>
        </Link>
        
        <p className={`${theme === 'dark' ? 'text-light' : 'text-muted'} mb-2`} style={{ fontSize: '0.875rem' }}>{post.body}</p>

        {/* Restaurant & Location */}
        {(post.restaurantName || post.location) && (
          <div className="mb-2">
            {post.restaurantName && (
              <div className={`small ${theme === 'dark' ? 'text-light' : 'text-muted'} mb-1`}>
                <strong>📍 {post.restaurantName}</strong>
              </div>
            )}
            {post.location && (
              <div className={`small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                <strong>🌍 {post.location}</strong>
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="mb-2">
          <span className="text-warning" style={{ fontSize: '0.875rem' }}>{renderStars(post.rating)}</span>
          <span className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small ms-1`}>({post.rating}/5)</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} bg={theme === 'dark' ? 'secondary' : 'light'} text={theme === 'dark' ? 'white' : 'dark'} className="me-1" style={{ fontSize: '0.7rem' }}>
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex align-items-center mb-2">
          <Button
            variant={isLiked ? 'danger' : 'outline-danger'}
            size="sm"
            onClick={handleLike}
            disabled={!user}
            className="me-3"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            ❤️ {post.likeCount}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            💬 {post.commentCount}
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="border-top pt-2">
            {user && (
              <Form onSubmit={handleComment} className="mb-2">
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={loading}
                    size="sm"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <Button 
                    type="submit" 
                    disabled={loading || !commentText.trim()} 
                    size="sm"
                    className="ms-2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {loading ? '...' : 'Post'}
                  </Button>
                </div>
              </Form>
            )}

            <div>
              {post.comments.map((comment) => {
                const profilePictureUrl = comment.user.profilePicture 
                  ? `http://localhost:5000${comment.user.profilePicture}`
                  : 'https://via.placeholder.com/24/6c757d/ffffff?text=' + (comment.user.displayName?.charAt(0) || 'U');
                
                return (
                  <div key={comment._id} className="d-flex align-items-start mb-2">
                    <img
                      src={profilePictureUrl}
                      alt={comment.user.displayName || 'User'}
                      className="rounded-circle me-2"
                      style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/24/6c757d/ffffff?text=' + (comment.user.displayName?.charAt(0) || 'U');
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Link to={`/profile/${comment.user._id}`} className="text-decoration-none">
                            <span className={`fw-bold small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                              {comment.user.displayName || comment.user.username || 'Unknown User'}
                            </span>
                          </Link>
                          <div className={`small ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{comment.text}</div>
                          <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {(user?.id === comment.user._id || isAuthor) && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            style={{ fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 