import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Spinner, Alert, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FollowingSidebar from '../components/FollowingSidebar';
import HamsterLoader from '../components/HamsterLoader';

const Feed: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await postService.getPosts(page, 10);
      setPosts(data.posts);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(page);
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
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          />
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {items}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
          <Pagination.Last
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          />
        </Pagination>
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return <HamsterLoader theme={theme} />;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div
        className="feed-layout d-flex flex-row justify-content-center align-items-start mx-auto"
        style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', minHeight: '100vh' }}
      >
        {/* Main feed content */}
        <div
          className="feed-main-content d-flex flex-column align-items-center"
          style={{ maxWidth: '1100px', width: '100%', minHeight: '100vh', zIndex: 1 }}
        >
          <div className="d-flex align-items-center justify-content-between w-100" style={{ maxWidth: '1100px', marginTop: '2rem', marginBottom: '2rem' }}>
            <h4 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-0`}>Feed</h4>
            <div className="d-flex align-items-center">
              <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`} style={{ marginRight: '1rem' }}>
                {totalPosts} posts
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="sort-dropdown"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    color: theme === 'dark' ? '#fff' : '#212529',
                    textDecoration: 'none',
                    padding: 0,
                    fontWeight: 500
                  }}
                >
                  <span style={{ marginRight: 6 }}>Sort</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ backgroundColor: theme === 'dark' ? '#23272f' : '#ffffff' }}>
                  <Dropdown.Item style={{ color: theme === 'dark' ? '#fff' : undefined }}>Feed</Dropdown.Item>
                  <Dropdown.Item style={{ color: theme === 'dark' ? '#fff' : undefined }}>Following</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3 w-100" style={{ maxWidth: '1100px' }}>
              {error}
            </Alert>
          )}

          {posts.length === 0 && !loading ? (
            <Alert variant="info" className="w-100" style={{ maxWidth: '1100px' }}>
              No posts found. Be the first to share your food experience!
            </Alert>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post._id} className="w-100 d-flex justify-content-center" style={{ maxWidth: '1100px' }}>
                  <PostCard
                    post={post}
                    onPostUpdate={handlePostUpdate}
                    onPostDelete={handlePostDelete}
                  />
                </div>
              ))}

              {loading && (
                <div className="text-center my-3 w-100" style={{ maxWidth: '1100px' }}>
                  <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}

              {renderPagination()}
            </>
          )}
        </div>
        {/* Right sidebar (FollowingSidebar) */}
        <div className="feed-right-sidebar d-none d-lg-block" style={{ width: '280px', flexShrink: 0, alignSelf: 'flex-start' }}>
          <FollowingSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed; 