import React from 'react';
import Hero from '../../components/User/Hero/Hero';
import EventCards from '../../components/User/EventCard/EventCards';
import { Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ mt: '64px' }}>
      <Hero/>
      <EventCards/>
    </Box>
  );
};

export default Home;