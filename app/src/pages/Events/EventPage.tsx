// pages/EventPage.tsx
import React, { useState } from 'react';
import { Container, Box, Typography, IconButton, Button, styled } from '@mui/material';
import EventHeader from '../../components/User/Event/EventHeader';
import EventTitle from '../../components/User/Event/EventTitle';
import EventOrganizer from '../../components/User/Event/EventOrganizer';
import EventDetails from '../../components/User/Event/EventDetails';
import EventLocation from '../../components/User/Event/EventLocation';
import { BrowserRouter, Route, Router, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '../../services/stripeService';
//import CheckoutPage from 'components/Payments/CheckoutPage';
import { useLocation } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  organizerName: string;
  organizerCreatedAt: string;
  time?: string;
  venue?: string;
}

const stripePromise = loadStripe('your_publishable_key');

const StyledButton = styled(Button)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      bgcolor: '#f05123',
      '&:hover': {
        bgcolor: '#d84315'
      }
    },
  })
);
const EventPage: React.FC = () => {
  const location = useLocation();
  const event = location.state as Event;
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();

  const handleIncrement = () => {
    setTicketCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(prev => prev - 1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <EventHeader />
        
        <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
          <EventTitle date={event.date} name={event.name}/>
          <EventOrganizer organizerName={event.organizerName} organizerCreatedAt={event.organizerCreatedAt}/>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            p: 3
          }}>
            <Box sx={{ flex: '2' }}>
              <EventDetails id={event.id} name={event.name} description={event.description} date={event.date}/>
              <EventLocation location={event.location}/>
            </Box>
            
            <Box sx={{ 
              flex: '1',
              position: 'sticky',
              top: '84px',
              height: 'fit-content'
            }}>
              <Box sx={{ 
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <Typography variant="h6" gutterBottom>
                  General Admission
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography>Free</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={handleDecrement}
                      disabled={ticketCount <= 1}
                    >
                      -
                    </IconButton>
                    <Typography>{ticketCount}</Typography>
                    <IconButton 
                      size="small" 
                      onClick={handleIncrement}
                    >
                      +
                    </IconButton>
                  </Box>
                </Box>
              
                  <StyledButton 
                    variant="contained" 
                    fullWidth 
                    onClick={() => {
                      navigate('/checkout', { state: {
                        amount: Math.max(ticketCount * 1000, 50),
                        eventId: event.id,
                      }
                    });
                    }}
                  >
                    Reserve a spot
                  </StyledButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EventPage;