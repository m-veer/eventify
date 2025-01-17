// StripeProvider.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  amount: number;
  onSuccess: () => void;
  eventId: string | number;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ amount, onSuccess, eventId }) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/payments/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount,
            currency: 'usd'
          })
        });
        
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      }
    };

    fetchPaymentIntent();
  }, [amount]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#f05123',
      },
    },
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm 
          onSuccess={onSuccess}
          eventId={eventId?.toString()}
          />
        </Elements>
      )}
    </div>
  );
};

export default StripeProvider;