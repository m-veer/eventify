// pages/PrivacyPolicy.tsx
import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Privacy Policy
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 0 },
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          At Eventify, we are committed to protecting your privacy. This Privacy Policy outlines the types of personal information we collect, how we use and protect it, and your rights regarding your data.
        </Typography>
      </Box>

      {/* Information Collection Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Information We Collect
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 0 } }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We may collect the following information:
          </Typography>
          <Box sx={{ textAlign: 'left', pl: { xs: 2, md: 4 } }}>
            <Typography component="div" sx={{ mb: 1 }}>• Personal details such as name, email address, and contact information</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Payment information for ticket bookings</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Event-related preferences and feedback</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Browser and device information for analytics purposes</Typography>
          </Box>
        </Box>
      </Box>

      {/* Information Usage Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          How We Use Your Information
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 0 } }}>
          <Box sx={{ textAlign: 'left', pl: { xs: 2, md: 4 } }}>
            <Typography component="div" sx={{ mb: 1 }}>• Provide, manage, and improve our services</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Process event registrations and ticket bookings</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Send notifications, updates, and promotional materials</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Ensure the security of our platform</Typography>
          </Box>
        </Box>
      </Box>

      {/* Data Protection Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          How We Protect Your Data
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}
        >
          We implement strict security measures to protect your personal information, including encryption, secure servers, and limited access to authorized personnel only.
        </Typography>
      </Box>

      {/* Contact Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}
        >
          If you have any questions or concerns about this Privacy Policy, please contact us at support@eventify.com
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 8, pb: 4 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          © 2024 Eventify. All Rights Reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;