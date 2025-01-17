// import express from 'express';
// // import { createCheckoutSession } from '../controllers/payment-controller';
// // import { verifyPayment } from '../controllers/payment-controller';

// const router = express.Router();
// //const paymentController = new PaymentController();

// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
// console.log(stripe);
// router.post('/create-checkout-session', async (req, res) => {
//     console.log("Post api is called");
//   try {
//     const { amount } = req.body;
    
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'Event Payment',
//             },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.json({ sessionId: session.id });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create checkout session' });
//   }
// });

// export default router;



// import express from 'express';
// import Stripe from 'stripe';

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-20.acacia' });

// router.post('/create-checkout-session', async (req, res) => {
//   console.log('Post API is called');
//   console.log('Request Body:', req.body);

//   try {
//     const { amount } = req.body;

//     console.log('Creating session with:', { amount });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: { name: 'Event Payment' },
//             unit_amount: amount,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     console.log('Checkout session created:', session.id);
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: 'Failed to create checkout session' });
//   }
// });

// export default router;


import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-20.acacia' });

// Ensure CLIENT_URL is set or fallback to localhost
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// router.post('/create-checkout-session', async (req, res) => {
//   console.log('Request Body:', req.body);

//   try {
//     const { amount } = req.body;

//     if (!amount || typeof amount !== 'number' || amount < 50) {
//       throw new Error('Invalid amount provided. Amount must be at least 50 cents.');
//     }
    
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: { name: 'Event Payment' },
//             unit_amount: amount, // Ensure amount is valid before this step
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${CLIENT_URL}/cancel`,
//     });
      
//     console.log('Checkout session created:', session.id);
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create checkout session' });
//   }
// });

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
