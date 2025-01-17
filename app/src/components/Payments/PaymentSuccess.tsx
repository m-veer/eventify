// PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentStatusContent: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      setStatus('failed');
      setMessage('No payment information found.');
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          setStatus('failed');
          setMessage('Payment provider not available.');
          return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        
        switch (paymentIntent?.status) {
          case 'succeeded':
            setStatus('success');
            setMessage('Payment successful! Thank you for your purchase.');
            break;
          case 'processing':
            setStatus('loading');
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setStatus('failed');
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setStatus('failed');
            setMessage('Something went wrong.');
            break;
        }
      } catch (err) {
        setStatus('failed');
        setMessage('An error occurred while confirming your payment.');
      }
    };

    fetchPaymentStatus();
  }, []);

  const handleNavigate = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <CircularProgress size={60} sx={{ color: '#f05123' }} />
            <Typography variant="h6">Processing your payment...</Typography>
          </Box>
        );

      case 'success':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 60, color: 'success.main' }}
            />
            <Typography variant="h5" textAlign="center">
              Payment Successful!
            </Typography>
            <Alert severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              onClick={handleNavigate}
              sx={{
                bgcolor: '#f05123',
                '&:hover': {
                  bgcolor: '#d84315'
                }
              }}
            >
              Return to Home
            </Button>
          </Box>
        );

      case 'failed':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <ErrorOutlineIcon
              sx={{ fontSize: 60, color: 'error.main' }}
            />
            <Typography variant="h5" textAlign="center">
              Payment Failed
            </Typography>
            <Alert severity="error" sx={{ width: '100%' }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              onClick={handleNavigate}
              sx={{
                bgcolor: '#f05123',
                '&:hover': {
                  bgcolor: '#d84315'
                }
              }}
            >
              Try Again
            </Button>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

const PaymentSuccess: React.FC = () => {
  const options = {
    clientSecret: '',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#f05123',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentStatusContent />
    </Elements>
  );
};

export default PaymentSuccess;