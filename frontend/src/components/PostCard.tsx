import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { postService } from '../services/postService';
import { getBackendAssetUrl } from '../utils/config';
import { formatDate } from '../utils/dateUtils';
import CommentItem from './CommentItem';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onPostDelete }) => {
  const { user, onlineUsers } = useAuth();
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
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={post.author.profilePicture ? getBackendAssetUrl(post.author.profilePicture) : 'https://placehold.co/600x400'}
              alt={post.author.displayName}
              className="rounded-circle me-2"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
              onError={(e) => {
                console.error('Profile picture failed to load:', post.author.profilePicture, 'Processed URL:', post.author.profilePicture ? getBackendAssetUrl(post.author.profilePicture) : '');
              }}
              onLoad={() => {
                console.log('Profile picture loaded successfully:', post.author.profilePicture, 'Processed URL:', post.author.profilePicture ? getBackendAssetUrl(post.author.profilePicture) : '');
              }}
            />
            {onlineUsers && onlineUsers.includes(post.author._id) ? (
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 4,
                  width: 10,
                  height: 10,
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
                  right: 4,
                  width: 10,
                  height: 10,
                  background: '#bdbdbd',
                  border: '1px solid #fff',
                  borderRadius: '50%',
                  zIndex: 2,
                  display: 'block',
                }}
              />
            )}
          </div>
          <div>
                    <Link to={`/profile/${post.author._id}`} className="text-decoration-none">
          <div className={`fw-bold small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>{post.author.displayName}</div>
        </Link>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          {formatDate(post.createdAt)}
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
        src={getBackendAssetUrl(post.image)}
        alt={post.title}
        className="w-100"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
        onError={(e) => {
          console.error('Image failed to load:', post.image, 'Processed URL:', getBackendAssetUrl(post.image));
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', post.image, 'Processed URL:', getBackendAssetUrl(post.image));
        }}
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
              {post.comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  onCommentUpdate={(updatedComment) => {
                    const updatedComments = post.comments.map(c => 
                      c._id === updatedComment._id ? updatedComment : c
                    );
                    onPostUpdate?.({ ...post, comments: updatedComments });
                  }}
                  isAuthor={isAuthor}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 