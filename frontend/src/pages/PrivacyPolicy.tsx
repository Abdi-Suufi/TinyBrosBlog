import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicy: React.FC = () => {
  const { theme } = useTheme();

  const lastUpdated = 'Sept 2025';

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, post content, or contact us. This may include your name, email address, username, profile picture, and any other information you choose to provide.'
        },
        {
          subtitle: 'Content You Post',
          text: 'We collect the content you post on our platform, including reviews, recipes, comments, and any other information you share publicly or privately.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your use of our services, including your IP address, browser type, operating system, pages visited, time spent on pages, and other usage statistics.'
        },
        {
          subtitle: 'Device Information',
          text: 'We may collect information about the device you use to access our services, including device type, operating system, and browser information.'
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Provide Our Services',
          text: 'We use your information to provide, maintain, and improve our services, including processing your posts, managing your account, and providing customer support.'
        },
        {
          subtitle: 'Personalize Your Experience',
          text: 'We use your information to personalize your experience, such as showing you relevant content, recommendations, and advertisements.'
        },
        {
          subtitle: 'Communicate With You',
          text: 'We may use your information to send you updates, newsletters, and other communications related to our services.'
        },
        {
          subtitle: 'Ensure Security',
          text: 'We use your information to detect, prevent, and address fraud, abuse, and other security issues.'
        }
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'Public Content',
          text: 'Content you post publicly on our platform may be visible to other users and may be shared or reposted by others.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who help us operate our services, such as hosting providers, analytics services, and customer support tools.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law or if we believe such action is necessary to comply with legal processes or protect our rights and safety.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.'
        }
      ]
    },
    {
      title: 'Cookies and Tracking Technologies',
      content: [
        {
          subtitle: 'What Are Cookies',
          text: 'Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences and provide a better user experience.'
        },
        {
          subtitle: 'How We Use Cookies',
          text: 'We use cookies to authenticate users, remember your preferences, analyze site traffic, and provide personalized content and advertisements.'
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'We may use third-party cookies for analytics, advertising, and other purposes. These cookies are subject to the privacy policies of the third parties that set them.'
        },
        {
          subtitle: 'Managing Cookies',
          text: 'You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our services.'
        }
      ]
    },
    {
      title: 'Data Security',
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data.'
        },
        {
          subtitle: 'Data Breaches',
          text: 'In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by law.'
        }
      ]
    },
    {
      title: 'Your Rights and Choices',
      content: [
        {
          subtitle: 'Access and Update',
          text: 'You can access and update your personal information through your account settings or by contacting us directly.'
        },
        {
          subtitle: 'Delete Your Account',
          text: 'You can delete your account and associated data at any time through your account settings or by contacting us.'
        },
        {
          subtitle: 'Opt-Out of Communications',
          text: 'You can opt out of marketing communications by following the unsubscribe instructions in our emails or by updating your preferences in your account settings.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You may request a copy of your personal information in a portable format by contacting us.'
        }
      ]
    },
    {
      title: 'Children\'s Privacy',
      content: [
        {
          subtitle: 'Age Requirements',
          text: 'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.'
        },
        {
          subtitle: 'Parental Consent',
          text: 'If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information and obtain parental consent if required.'
        }
      ]
    },
    {
      title: 'International Data Transfers',
      content: [
        {
          subtitle: 'Global Operations',
          text: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information.'
        },
        {
          subtitle: 'Data Protection Laws',
          text: 'We comply with applicable data protection laws and regulations, including the General Data Protection Regulation (GDPR) where applicable.'
        }
      ]
    },
    {
      title: 'Changes to This Policy',
      content: [
        {
          subtitle: 'Policy Updates',
          text: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.'
        },
        {
          subtitle: 'Continued Use',
          text: 'Your continued use of our services after any changes to this policy constitutes acceptance of the updated policy.'
        }
      ]
    }
  ];

  return (
    <Container className="d-flex justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '1000px', width: '100%', marginTop: '2rem' }}>
        {/* Header */}
        <Card className={`mb-5 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="text-center p-5">
            <h1 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              <i className="bi bi-shield-check me-3" style={{ color: 'var(--accent)' }}></i>
              Privacy Policy
            </h1>
            <p className="lead mb-2">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your information.
            </p>
            <p className="text-muted mb-0">
              Last updated: {lastUpdated}
            </p>
          </Card.Body>
        </Card>

        {/* Introduction */}
        <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h4 className={`mb-3 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              Introduction
            </h4>
            <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'} mb-3`}>
              At TinyBrosBlog, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you 
              use our website and services.
            </p>
            <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'} mb-0`}>
              By using our services, you agree to the collection and use of information 
              in accordance with this policy. If you have any questions about this 
              Privacy Policy, please contact us.
            </p>
          </Card.Body>
        </Card>

        {/* Policy Sections */}
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className={`mb-4 ${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
            borderColor: theme === 'dark' ? 'var(--border)' : undefined,
            backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
          }}>
            <Card.Body className="p-4">
              <h4 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                {section.title}
              </h4>
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-4">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                    {item.subtitle}
                  </h6>
                  <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'} mb-0`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))}

        {/* Contact Information */}
        <Card className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`} style={{
          borderColor: theme === 'dark' ? 'var(--border)' : undefined,
          backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : undefined
        }}>
          <Card.Body className="p-4">
            <h4 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
              Contact Us
            </h4>
            <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'} mb-3`}>
              If you have any questions about this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                    <i className="bi bi-envelope me-2" style={{ color: 'var(--accent)' }}></i>
                    Email
                  </h6>
                  <a 
                    href="mailto:privacy@tinybrosblog.com" 
                    className="text-decoration-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    privacy@tinybrosblog.com
                  </a>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <h6 className={`${theme === 'dark' ? 'text-white' : 'text-dark'} mb-2`}>
                    <i className="bi bi-chat-dots me-2" style={{ color: 'var(--accent)' }}></i>
                    Contact Form
                  </h6>
                  <a 
                    href="/contact" 
                    className="text-decoration-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    Contact Us Page
                  </a>
                </div>
              </Col>
            </Row>
            <div className="mt-4 p-3" style={{ 
              backgroundColor: theme === 'dark' ? 'var(--bg-tertiary)' : '#f8f9fa',
              borderRadius: '8px',
              border: `1px solid ${theme === 'dark' ? 'var(--border)' : '#dee2e6'}`
            }}>
              <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'} mb-0 small`}>
                <strong>Note:</strong> This Privacy Policy is effective as of {lastUpdated} and will 
                remain in effect except with respect to any changes in its provisions in the future, 
                which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default PrivacyPolicy; 