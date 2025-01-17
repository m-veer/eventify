// pages/AboutUs.tsx
import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import WhatWeOffer from './WhatWeOffer';

const AboutUs: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4 
          }}
        >
          About Us
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 6 }}>
          Welcome to Eventify, your one-stop solution for managing and exploring events seamlessly. We aim to make event organization and participation as effortless as possible, leveraging cutting-edge technology and a user-friendly interface.
        </Typography>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Our Mission
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          At Eventify, we believe that connecting people through events creates lasting memories and meaningful experiences. Our mission is to empower event organizers and attendees with tools that simplify event management, ticket booking, and participant engagement.
        </Typography>
      </Box>

      <WhatWeOffer />

      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Meet the Team
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
          Eventify is built by a passionate team of developers and event enthusiasts committed to enhancing your event experience. We're constantly innovating and improving to bring you the best tools for all your event needs.
        </Typography>
      </Box>

      <Box>
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Our Vision
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          To become the world's most trusted event management platform, fostering connections and simplifying event experiences worldwide.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;