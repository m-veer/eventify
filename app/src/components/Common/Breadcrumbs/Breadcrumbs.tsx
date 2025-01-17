// components/Breadcrumbs/Breadcrumbs.tsx
import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't render breadcrumbs for home page
  if (location.pathname === '/') {
    return null;
  }

  const formatPathName = (path: string) => {
    const pathMappings: { [key: string]: string } = {
      'admin-users': 'User Management',
      'admin-events': 'Event Management',
      'admin-reported-events': 'Reported Events',
      'myTickets': 'My Tickets',
      'browseEvents': 'Browse Events',
      'accountSettings': 'Account Settings',
      'create-event': 'Create Event'
    };

    return pathMappings[path] || path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box sx={{ 
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      marginTop: '64px'
    }}>
      <MUIBreadcrumbs aria-label="breadcrumb">
        <Link 
          component={RouterLink} 
          to="/"
          sx={{ 
            color: '#000000',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {location.pathname.startsWith('/admin') ? 'Admin Dashboard' : 'Home'}
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const formattedValue = formatPathName(value);

          if (value === 'admin') return null;

          return last ? (
            <Typography 
              key={to}
              sx={{ color: '#ff0000' }}
            >
              {formattedValue}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={to}
              key={to}
              sx={{
                color: '#000000',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {formattedValue}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;