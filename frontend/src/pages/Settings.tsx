import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/userService';
import { getBackendAssetUrl } from '../utils/config';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize form with current user data
    setFormData({
      displayName: user.displayName || '',
      bio: '' // We'll need to fetch this from the backend
    });
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('displayName', formData.displayName);
      data.append('bio', formData.bio);
      
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

      await userService.updateProfile(data);
      setSuccess('Profile updated successfully!');
      
      // Clear the profile picture preview after successful update
      if (profilePicture) {
        setProfilePicture(null);
        setProfilePicturePreview('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <Card className={theme === 'dark' ? 'bg-dark text-white' : ''} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body>
            <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>Settings</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4} className="text-center">
                  <div className="mb-3">
                    <img
                      src={
                        profilePicturePreview || 
                        (user.profilePicture ? getBackendAssetUrl(user.profilePicture) : 'https://via.placeholder.com/150')
                      }
                      alt="Profile"
                      className="rounded-circle mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <Form.Group>
                      <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Profile Picture</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                        style={{
                          backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                          color: theme === 'dark' ? 'var(--text-primary)' : undefined
                        }}
                      />
                      <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                        Upload a new profile picture
                      </Form.Text>
                    </Form.Group>
                  </div>
                </Col>
                
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Display Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter your display name..."
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
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                    <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                      {formData.bio.length}/500 characters
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={user.email}
                      disabled
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                    <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={theme === 'dark' ? 'text-white' : 'text-dark'}>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.username}
                      disabled
                      className={theme === 'dark' ? 'bg-dark text-white border-secondary' : ''}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : undefined,
                        borderColor: theme === 'dark' ? 'var(--border)' : undefined,
                        color: theme === 'dark' ? 'var(--text-primary)' : undefined
                      }}
                    />
                    <Form.Text className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                      Username cannot be changed
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Settings; 