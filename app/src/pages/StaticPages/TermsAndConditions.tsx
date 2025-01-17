// pages/TermsAndConditions.tsx
import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const TermsAndConditions: React.FC = () => {
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
          Terms and Conditions
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
          Welcome to Eventify. By using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.
        </Typography>
      </Box>

      {/* Terms Sections */}
      <Box sx={{ maxWidth: '800px', mx: 'auto', px: { xs: 2, md: 0 } }}>
        {/* Acceptance Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            By accessing or using Eventify, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree, you must stop using the platform immediately.
          </Typography>
        </Box>

        {/* User Responsibilities Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            2. User Responsibilities
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography component="div" sx={{ mb: 1 }}>• Provide accurate and up-to-date information during registration</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Maintain the confidentiality of your account credentials</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Use the platform for lawful purposes only</Typography>
            <Typography component="div" sx={{ mb: 1 }}>• Avoid activities that disrupt or harm the platform's integrity</Typography>
          </Box>
        </Box>

        {/* Event Organizer Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            3. Event Organizer Obligations
          </Typography>
          <Typography variant="body1">
            If you create or manage events on Eventify, you are responsible for ensuring that the event details are accurate and comply with applicable laws and regulations.
          </Typography>
        </Box>

        {/* Limitation of Liability Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            4. Limitation of Liability
          </Typography>
          <Typography variant="body1">
            Eventify is not responsible for any loss or damage arising from the use of our platform, including but not limited to event cancellations, inaccurate event information, or technical issues.
          </Typography>
        </Box>

        {/* Intellectual Property Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            5. Intellectual Property
          </Typography>
          <Typography variant="body1">
            All content on Eventify, including text, images, and logos, is the property of Eventify and protected by copyright laws. Unauthorized use of this content is prohibited.
          </Typography>
        </Box>

        {/* Contact Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              fontWeight: 'bold',
              mb: 2
            }}
          >
            6. Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions or concerns about these Terms and Conditions, please contact us at support@eventify.com
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
      </Box>
    </Container>
  );
};

export default TermsAndConditions;