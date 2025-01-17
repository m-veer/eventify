// CheckoutPage.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
} from '@mui/material';
import StripeProvider from './StripeProvider';

interface LocationState {
  amount: number;
  eventId: string | number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const amount = state?.amount || 1000;
  const eventId = state?.eventId;

  console.log(eventId);


  const handlePaymentSuccess = () => {
    // Handle successful payment (e.g., clear cart, update order status)
    console.log('Payment successful');
    // Add your success handling logic here
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          <Typography variant="body1">
            Amount to pay: ${(amount / 100).toFixed(2)}
          </Typography>
        </Box>

        <StripeProvider 
          amount={amount} 
          onSuccess={handlePaymentSuccess}
          eventId={eventId}
        />
      </Paper>
    </Container>
  );
};

export default CheckoutPage;