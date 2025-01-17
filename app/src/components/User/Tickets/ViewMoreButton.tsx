import React from 'react';
import { Button, Box } from '@mui/material';

const ViewMoreButton: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Button 
        variant="text" 
        sx={{ 
          color: '#ff0000',
          textTransform: 'none',
          fontSize: '14px',
          fontWeight: 400,
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            color: '#e60000'
          }
        }}
      >
        View More
      </Button>
    </Box>
  );
};

export default ViewMoreButton;