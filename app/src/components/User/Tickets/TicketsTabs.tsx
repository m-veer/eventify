import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const TicketsTabs: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: 'divider',
      '& .MuiTab-root': {
        color: '#666',
        '&.Mui-selected': {
          color: 'red'
        }
      },
      '& .MuiTabs-indicator': {
        backgroundColor: 'red'
      }
    }}>
      <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
        <Tab label="Past Events" />
        <Tab label="Future Events" />
      </Tabs>
    </Box>
  );
};

export default TicketsTabs;