// components/About/WhatWeOffer.tsx
import { Box, Grid, Typography } from '@mui/material';

interface OfferItemProps {
  title: string;
  description: string;
}

const OfferItem: React.FC<OfferItemProps> = ({ title, description }) => (
  <Grid item xs={12} md={6}>
    <Box 
      sx={{
        textAlign: 'center',
        p: 4,
        height: '100%',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#f05123',
          mb: 2,
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1">
        {description}
      </Typography>
    </Box>
  </Grid>
);

const WhatWeOffer: React.FC = () => {
  const offerings = [
    {
      title: 'Event Management',
      description: 'Create, update, and manage your events effortlessly.'
    },
    {
      title: 'Secure Ticket Booking',
      description: 'Book tickets with QR codes for hassle-free check-ins.'
    },
    {
      title: 'Email Notifications',
      description: 'Stay updated with event details and reminders.'
    },
    {
      title: 'Admin Controls',
      description: 'Full control over your events and participants.'
    }
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          textAlign: 'center',
          color: '#f05123',
          fontStyle: 'italic',
          fontWeight: 'bold',
          mb: 6
        }}
      >
        What We Offer
      </Typography>
      <Grid 
        container 
        spacing={4} 
        sx={{ 
          maxWidth: '1200px', 
          mx: 'auto',
          px: 3
        }}
      >
        {offerings.map((offer, index) => (
          <OfferItem 
            key={index}
            title={offer.title}
            description={offer.description}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default WhatWeOffer;