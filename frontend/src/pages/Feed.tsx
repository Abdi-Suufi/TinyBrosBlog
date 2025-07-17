import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Spinner, Alert, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post, User } from '../types';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FollowingSidebar from '../components/FollowingSidebar';
import HamsterLoader from '../components/HamsterLoader';
import { userService } from '../services/userService';
import { getBackendAssetUrl } from '../utils/config';

const Feed: React.FC = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortType, setSortType] = useState<'feed' | 'following'>('feed');
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [userPostsMap, setUserPostsMap] = useState<{ [userId: string]: Post[] }>({});
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const fetchPosts = async (page: number = 1, type: 'feed' | 'following' = sortType) => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (type === 'feed') {
        data = await postService.getPosts(page, 10);
      } else {
        data = await postService.getUserFeed(page, 10);
      }
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
    fetchPosts(1, sortType);
    // eslint-disable-next-line
  }, [sortType]);

  const handleSortChange = (type: 'feed' | 'following') => {
    setSortType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(page, sortType);
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

  // Debounced search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setUserPostsMap({});
      setSearchError('');
      setShowSearchDropdown(false);
      return;
    }
    setSearchLoading(true);
    setSearchError('');
    setShowSearchDropdown(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const users = await userService.searchUsers(searchQuery.trim());
        setSearchResults(users);
        setUserPostsMap({});
        // Fetch recent posts for each user (limit 2)
        const postsMap: { [userId: string]: Post[] } = {};
        await Promise.all(
          users.map(async (user: User) => {
            try {
              const data = await postService.getUserPosts(user._id, 1, 2);
              postsMap[user._id] = data.posts;
            } catch {
              postsMap[user._id] = [];
            }
          })
        );
        setUserPostsMap(postsMap);
      } catch (err: any) {
        setSearchError(err.response?.data?.message || 'Failed to search users');
        setSearchResults([]);
        setUserPostsMap({});
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    // eslint-disable-next-line
  }, [searchQuery]);

  // Helper: is current user following target user
  const isFollowing = (targetUser: User) => {
    if (!user || !targetUser || !Array.isArray(targetUser.followers)) return false;
    // Defensive: compare as strings
    const currentUserId = String(user.id);
    return targetUser.followers.some(f => {
      if (typeof f === 'string') return f === currentUserId;
      if (f && typeof f === 'object' && f._id) return String(f._id) === currentUserId;
      return false;
    });
  };

  // Helper: is current user the target user
  const isOwnProfile = (targetUser: User) => user && targetUser._id === user.id;

  // Hide dropdown on blur
  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchDropdown(false), 200);
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
          {/* Search bar */}
          <div className="w-100 position-relative" style={{ maxWidth: '1100px', marginTop: '2rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search users by username or display name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              onBlur={handleSearchBlur}
              style={{ padding: '0.75rem 1rem', fontSize: '1rem', borderRadius: 8, border: '1px solid #ccc', marginBottom: 8, marginRight: '10px' }}
            />
            {showSearchDropdown && (
              <div
                className="position-absolute w-100 bg-white border rounded shadow"
                style={{ zIndex: 100, top: '110%', left: 0, maxHeight: 400, overflowY: 'auto' }}
              >
                {searchLoading && (
                  <div className="p-3 text-center">
                    <Spinner animation="border" size="sm" /> Searching...
                  </div>
                )}
                {searchError && (
                  <div className="p-3 text-danger text-center">{searchError}</div>
                )}
                {!searchLoading && !searchError && searchResults.length === 0 && (
                  <div className="p-3 text-muted text-center">No users found.</div>
                )}
                {!searchLoading && !searchError && searchResults.map(u => {
                  return (
                    <div key={u._id} className="p-3 border-bottom" style={{ background: theme === 'dark' ? '#23272f' : '#fff' }}>
                      <div className="d-flex align-items-center mb-2">
                        <Link to={`/profile/${u._id}`} className="d-flex align-items-center text-decoration-none me-2">
                          <img
                            src={u.profilePicture ? getBackendAssetUrl(u.profilePicture) : 'https://placehold.co/600x400'}
                            alt={u.displayName}
                            className="rounded-circle"
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                        </Link>
                        <div className="flex-grow-1">
                          <Link to={`/profile/${u._id}`} className="fw-bold text-decoration-none" style={{ color: theme === 'dark' ? '#fff' : '#212529' }}>{u.displayName}</Link>
                          <div className="text-muted small">@{u.username}</div>
                        </div>
                      </div>
                      {/* User's recent posts */}
                      {userPostsMap[u._id] && userPostsMap[u._id].length > 0 && (
                        <div className="mb-2">
                          {userPostsMap[u._id].map(post => (
                            <div key={post._id} className="mb-2">
                              <PostCard post={post} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feed header and sort dropdown */}
          <div className="d-flex align-items-center justify-content-between w-100" style={{ maxWidth: '1100px', marginTop: '1rem', marginBottom: '2rem' }}>
            <h4 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-0`}>Feed</h4>
            <div className="d-flex align-items-center">
              <div className={`${theme === 'dark' ? 'text-light' : 'text-muted'} small`} style={{ marginRight: '1rem' }}>
                {totalPosts} posts
              </div>
              {user && (
                <Dropdown style={{ marginRight: '10px' }}>
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
                    <span style={{ fontWeight: 700 }}>{sortType === 'feed' ? 'Feed' : 'Following'}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" style={{ backgroundColor: theme === 'dark' ? '#23272f' : '#ffffff' }}>
                    <Dropdown.Item active={sortType === 'feed'} style={{ color: theme === 'dark' ? '#fff' : undefined }} onClick={() => handleSortChange('feed')}>Feed</Dropdown.Item>
                    <Dropdown.Item active={sortType === 'following'} style={{ color: theme === 'dark' ? '#fff' : undefined }} onClick={() => handleSortChange('following')}>Following</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
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
        <div className="feed-right-sidebar d-none d-lg-block" style={{ width: '280px', flexShrink: 0, alignSelf: 'flex-start', marginLeft: '1.5rem' }}>
          <FollowingSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed; 