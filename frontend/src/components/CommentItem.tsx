import React, { useState } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Comment, Reply, User } from '../types';
import { getBackendAssetUrl } from '../utils/config';
import { formatDate, formatFullDate } from '../utils/dateUtils';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onCommentUpdate: (updatedComment: Comment) => void;
  isAuthor: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, onCommentUpdate, isAuthor }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const isLiked = user && comment.likes.includes(user.id);
  const likeCount = comment.likes.length;
  const replyCount = comment.replies.length;

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const updatedComment = await postService.likeComment(postId, comment._id);
      onCommentUpdate(updatedComment);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    setLoading(true);
    try {
      const newReply = await postService.addReply(postId, comment._id, replyText);
      const updatedComment = {
        ...comment,
        replies: [newReply, ...comment.replies]
      };
      onCommentUpdate(updatedComment);
      setReplyText('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await postService.deleteComment(postId, comment._id);
      // The parent component should handle the comment removal
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const profilePictureUrl = comment.user.profilePicture 
    ? getBackendAssetUrl(comment.user.profilePicture)
    : 'https://via.placeholder.com/32/6c757d/ffffff?text=' + (comment.user.displayName?.charAt(0) || 'U');

  return (
    <div className="mb-3">
      <div className="d-flex align-items-start">
        <img
          src={profilePictureUrl}
          alt={comment.user.displayName || 'User'}
          className="rounded-circle me-2"
          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/32/6c757d/ffffff?text=' + (comment.user.displayName?.charAt(0) || 'U');
          }}
        />
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <Link to={`/profile/${comment.user._id}`} className="text-decoration-none">
                <span className={`fw-bold small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  {comment.user.displayName || comment.user.username || 'Unknown User'}
                </span>
              </Link>
              <div className={`small ${theme === 'dark' ? 'text-light' : 'text-dark'} mb-1`}>
                {comment.text}
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                  {formatDate(comment.createdAt)}
                </div>
                <Button
                  variant={isLiked ? 'danger' : 'outline-danger'}
                  size="sm"
                  onClick={handleLike}
                  disabled={!user}
                  style={{ fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}
                >
                  ❤️ {likeCount}
                </Button>
                {user && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    style={{ fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}
                  >
                    Reply
                  </Button>
                )}
                {replyCount > 0 && (
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                    style={{ fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}
                  >
                    {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </div>
            {user?.id === comment.user._id && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDeleteComment}
                style={{ fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}
              >
                ×
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && user && (
            <Form onSubmit={handleReply} className="mb-2">
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={loading}
                  size="sm"
                  style={{ fontSize: '0.875rem' }}
                />
                <Button 
                  type="submit" 
                  disabled={loading || !replyText.trim()} 
                  size="sm"
                  className="ms-2"
                  style={{ fontSize: '0.75rem' }}
                >
                  {loading ? '...' : 'Reply'}
                </Button>
              </div>
            </Form>
          )}

          {/* Replies */}
          {showReplies && comment.replies.length > 0 && (
            <div className="ms-3 border-start ps-3">
              {comment.replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  postId={postId}
                  commentId={comment._id}
                  onReplyUpdate={(updatedReply) => {
                    const updatedReplies = comment.replies.map(r => 
                      r._id === updatedReply._id ? updatedReply : r
                    );
                    onCommentUpdate({ ...comment, replies: updatedReplies });
                  }}
                  onReplyDelete={(replyId) => {
                    const updatedReplies = comment.replies.filter(r => r._id !== replyId);
                    onCommentUpdate({ ...comment, replies: updatedReplies });
                  }}
                  isAuthor={isAuthor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReplyItemProps {
  reply: Reply;
  postId: string;
  commentId: string;
  onReplyUpdate: (updatedReply: Reply) => void;
  onReplyDelete: (replyId: string) => void;
  isAuthor: boolean;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, postId, commentId, onReplyUpdate, onReplyDelete, isAuthor }) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isLiked = user && reply.likes.includes(user.id);
  const likeCount = reply.likes.length;

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const updatedReply = await postService.likeReply(postId, commentId, reply._id);
      onReplyUpdate(updatedReply);
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleDeleteReply = async () => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    
    try {
      await postService.deleteReply(postId, commentId, reply._id);
      onReplyDelete(reply._id);
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const profilePictureUrl = reply.user.profilePicture 
    ? getBackendAssetUrl(reply.user.profilePicture)
    : 'https://via.placeholder.com/24/6c757d/ffffff?text=' + (reply.user.displayName?.charAt(0) || 'U');

  return (
    <div className="d-flex align-items-start mb-2">
      <img
        src={profilePictureUrl}
        alt={reply.user.displayName || 'User'}
        className="rounded-circle me-2"
        style={{ width: '24px', height: '24px', objectFit: 'cover' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/24/6c757d/ffffff?text=' + (reply.user.displayName?.charAt(0) || 'U');
        }}
      />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Link to={`/profile/${reply.user._id}`} className="text-decoration-none">
              <span className={`fw-bold small ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                {reply.user.displayName || reply.user.username || 'Unknown User'}
              </span>
            </Link>
            <div className={`small ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
              {reply.text}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>
                {formatDate(reply.createdAt)}
              </div>
              <Button
                variant={isLiked ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={handleLike}
                disabled={!user}
                style={{ fontSize: '0.65rem', padding: '0.1rem 0.2rem' }}
              >
                ❤️ {likeCount}
              </Button>
            </div>
          </div>
          {user?.id === reply.user._id && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDeleteReply}
              style={{ fontSize: '0.65rem', padding: '0.1rem 0.2rem' }}
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 