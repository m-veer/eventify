import axios from 'axios';

export const createCheckoutSession = async (amount: number) => {
  try {
    const response = await axios.post('/api/create-checkout-session', { amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};