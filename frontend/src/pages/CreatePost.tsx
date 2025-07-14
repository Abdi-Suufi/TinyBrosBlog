import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { postService } from '../services/postService';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    rating: 5,
    restaurantName: '',
    location: '',
    tags: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      rating: parseInt(e.target.value)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
        e.target.value = ''; // Clear the input
        setImage(null);
        setImagePreview('');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Image file size must be less than 5MB');
        e.target.value = ''; // Clear the input
        setImage(null);
        setImagePreview('');
        return;
      }

      // Clear any previous errors
      setError('');
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please select an image');
      return;
    }

    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('body', formData.body);
      data.append('rating', formData.rating.toString());
      data.append('image', image);
      
      if (formData.restaurantName) {
        data.append('restaurantName', formData.restaurantName);
      }
      if (formData.location) {
        data.append('location', formData.location);
      }
      if (formData.tags) {
        data.append('tags', formData.tags);
      }

      await postService.createPost(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined,
          marginTop: '2rem',
        }}>
          <Card.Body>
            <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Create New Post</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter post title..."
                      required
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="body"
                      value={formData.body}
                      onChange={handleInputChange}
                      placeholder="Share your food experience..."
                      required
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Restaurant Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="restaurantName"
                          value={formData.restaurantName}
                          onChange={handleInputChange}
                          placeholder="Restaurant name..."
                          className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          style={{
                            backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                            borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                            color: theme === 'dark' ? 'var(--text-primary)' : undefined
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="City, Country..."
                          className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                          style={{
                            backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                            borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                            color: theme === 'dark' ? 'var(--text-primary)' : undefined
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Rating *</Form.Label>
                    <Form.Select
                      name="rating"
                      value={formData.rating}
                      onChange={handleRatingChange}
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    >
                      <option value={5}>5 Stars - Excellent</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Good</option>
                      <option value={2}>2 Stars - Fair</option>
                      <option value={1}>1 Star - Poor</option>
                    </Form.Select>
                    <div className="mt-2">
                      <span className="text-warning fs-5">{renderStars(formData.rating)}</span>
                      <span className={`${theme === 'dark' ? 'text-light' : 'text-muted'} ms-2`}>({formData.rating}/5)</span>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="pizza, italian, dinner (comma separated)"
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                    <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                      Add tags to help others find your post
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Food Image *</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      required
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                    <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                      Upload a photo of your food (JPEG, PNG, GIF, WebP - max 5MB)
                    </Form.Text>
                  </Form.Group>

                  {imagePreview && (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </Col>
              </Row>

              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Post...' : 'Create Post'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default CreatePost; 