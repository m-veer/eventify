// PaymentForm.tsx
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Typography,
  Modal,
  Paper,
  IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import API_URLS from '../../constants/apiUrls';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface PaymentFormProps {
  onSuccess?: () => void;
  eventId?: string;
}

interface User {
  firstName: string;
  lastName: string;
  createdAt: string;
  location: string;
  profilePhotoURL: string;
  updatedAt: string;
  email: string;
  token: string;
  isAuthenticated: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, eventId }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
  const user = useSelector((state: RootState) => state.user as User);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { paymentIntent, error: submitError } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment.');
        setPaymentStatus('error');
        setShowModal(true);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          console.log(eventId);
          const response = await fetch(API_URLS.USER_REGISTER_EVENT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({ "eventId": eventId })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Ticket not purchased");
          }
        } catch (error) {
          console.log(error);
        }

        setPaymentStatus('success');
        setShowModal(true);
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setPaymentStatus('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (paymentStatus === 'success') {
      // Additional cleanup if needed
    }
  };

  const modalContent = (
    <Modal
      open={showModal}
      onClose={handleCloseModal}
      aria-labelledby="payment-status-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: 400,
          p: 4,
          outline: 'none',
          borderRadius: 2
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={handleCloseModal}
        >
          <CloseIcon />
        </IconButton>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {paymentStatus === 'success' ? (
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 60, color: 'success.main' }}
              />
              <Typography variant="h5" textAlign="center">
                Payment Successful!
              </Typography>
              <Typography variant="body1" textAlign="center">
                Thank you for your payment. Your transaction has been completed successfully.
              </Typography>
            </>
          ) : (
            <>
              <ErrorOutlineIcon
                sx={{ fontSize: 60, color: 'error.main' }}
              />
              <Typography variant="h5" textAlign="center">
                Payment Failed
              </Typography>
              <Typography variant="body1" textAlign="center" color="error">
                {error || 'An error occurred during payment.'}
              </Typography>
            </>
          )}

          <Button
            variant="contained"
            onClick={() => {
              if (paymentStatus === 'success') {
                handleCloseModal;
                navigate('/');
              }
            }}

            sx={{
              mt: 2,
              bgcolor: '#f05123',
              '&:hover': {
                bgcolor: '#d84315'
              }
            }}
          >
            {paymentStatus === 'success' ? 'Close' : 'Try Again'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <PaymentElement />
      </Box>

      {error && !showModal && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading}
        sx={{
          bgcolor: '#f05123',
          '&:hover': {
            bgcolor: '#d84315'
          }
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>

      {modalContent}
    </Box>
  );
};

export default PaymentForm;