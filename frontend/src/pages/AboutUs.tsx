import React from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const AboutUs: React.FC = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: 'The TinyBros Team',
      role: 'Founders & Developers',
      bio: 'Passionate food enthusiasts and tech innovators dedicated to creating a platform where honest food reviews and delicious recipes can be shared with the world.',
      image: 'https://via.placeholder.com/150x150/4dabf7/ffffff?text=TB'
    }
  ];

  const features = [
    {
      title: 'Honest Reviews',
      description: 'Share authentic experiences from restaurants and food spots you visit.',
      icon: 'bi-star-fill'
    },
    {
      title: 'Recipe Sharing',
      description: 'Post your favorite recipes and discover new ones from our community.',
      icon: 'bi-journal-text'
    },
    {
      title: 'Community Driven',
      description: 'Connect with fellow food lovers and build meaningful relationships.',
      icon: 'bi-people-fill'
    },
    {
      title: 'Visual Content',
      description: 'Share beautiful food photos and make your posts come alive.',
      icon: 'bi-camera-fill'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Happy Users' },
    { number: '5000+', label: 'Reviews Posted' },
    { number: '2000+', label: 'Recipes Shared' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '1000px', width: '100%', marginTop: '2rem' }}>
        {/* Hero Section */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="text-center p-5">
            <h1 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              <i className="bi bi-heart-fill me-3" style={{ color: 'var(--accent)' }}></i>
              About TinyBrosBlog
            </h1>
            <p className="lead mb-4">
              Welcome to TinyBrosBlog, your go-to platform for honest food reviews, 
              delicious recipes, and a vibrant community of food enthusiasts.
            </p>
            <p className="mb-0">
              We believe that food brings people together, and we're passionate about 
              creating a space where you can share your culinary adventures, discover 
              new flavors, and connect with fellow food lovers from around the world.
            </p>
          </Card.Body>
        </Card>

        {/* Mission Section */}
        <Row className="mb-5">
          <Col lg={6}>
            <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body className="p-4">
                <h3 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-bullseye me-2" style={{ color: 'var(--accent)' }}></i>
                  Our Mission
                </h3>
                <p>
                  To create the most trusted and engaging platform for food enthusiasts 
                  to share authentic experiences, discover new culinary delights, and 
                  build meaningful connections through the universal language of food.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
              borderColor: theme === 'dark' ? 'var(--border)' : undefined,
              backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
            }}>
              <Card.Body className="p-4">
                <h3 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  <i className="bi bi-eye me-2" style={{ color: 'var(--accent)' }}></i>
                  Our Vision
                </h3>
                <p>
                  To become the world's leading platform for authentic food experiences, 
                  where every review matters, every recipe inspires, and every connection 
                  enriches the global food community.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h3 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              What We Offer
            </h3>
            <Row>
              {features.map((feature, index) => (
                <Col lg={6} key={index} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="me-3" style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>
                      <i className={feature.icon}></i>
                    </div>
                    <div>
                      <h5 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                        {feature.title}
                      </h5>
                      <p className="mb-0 text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Stats Section */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h3 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              Our Community in Numbers
            </h3>
            <Row className="text-center">
              {stats.map((stat, index) => (
                <Col lg={3} md={6} key={index} className="mb-3">
                  <div>
                    <h2 className={`mb-1 ${theme === 'dark' ? 'text-white' : 'text-dark'}`} style={{ color: 'var(--accent)' }}>
                      {stat.number}
                    </h2>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Team Section */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h3 className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              Meet Our Team
            </h3>
            <Row className="justify-content-center">
              {teamMembers.map((member, index) => (
                <Col lg={6} key={index}>
                  <div className="text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h5 className={`mb-2 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                      {member.name}
                    </h5>
                    <Badge bg="primary" className="mb-3">{member.role}</Badge>
                    <p className="text-muted">
                      {member.bio}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* Contact CTA */}
        <Card className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="text-center p-4">
            <h4 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              Join Our Food Community
            </h4>
            <p className="mb-3">
              Ready to share your food adventures? Join thousands of food enthusiasts 
              who are already part of our growing community.
            </p>
            <p className="mb-0">
              <i className="bi bi-envelope me-2" style={{ color: 'var(--accent)' }}></i>
              Have questions? <a href="/contact" style={{ color: 'var(--accent)' }}>Contact us</a> anytime!
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default AboutUs; 