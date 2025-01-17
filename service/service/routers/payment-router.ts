import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-20.acacia' });

// Ensure CLIENT_URL is set or fallback to localhost
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
}

router.post('/create-payment-intent', async (req: express.Request, res: express.Response) => {
  try {
    const { amount, currency }: PaymentIntentRequest = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
