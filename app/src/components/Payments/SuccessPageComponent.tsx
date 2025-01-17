// pages/SuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/verify-payment/${sessionId}`);
        const data = await response.json();
        
        if (!data.success) {
          navigate('/checkout');
        }
      } catch (error) {
        navigate('/checkout');
      } finally {
        setVerifying(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        {verifying ? (
          <CircularProgress />
        ) : (
          <>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Thank you for your purchase.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#f05123',
                '&:hover': {
                  bgcolor: '#d84315'
                }
              }}
            >
              Return to Home
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SuccessPage;