// components/CreateEvent/EventDateTime.tsx
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const EventDateTime: React.FC = () => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#f05123',
          mb: 3,
          fontWeight: 'bold'
        }}
      >
        Date and Time
      </Typography>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3 
        }}
      >
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="time"
          label="Start Time"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </Box>
  );
};

export default EventDateTime;