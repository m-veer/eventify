// components/Layout/Layout.tsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (location.pathname === '/' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const formatPathName = (path: string) => {
    if (path === 'myTickets') return 'My Tickets';
    return path.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box 
      sx={{ 
        padding: '8px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        marginTop: '64px'
      }}
    >
      <Link 
        component={RouterLink} 
        to="/" 
        sx={{ 
          color: '#000000',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = formatPathName(name);

        return (
          <Typography component="span" key={routeTo}>
            <Typography component="span" sx={{ mx: 1 }}>/</Typography>
            {isLast ? (
              <Typography 
                component="span" 
                sx={{ color: '#0000FF' }}
              >
                {formattedName}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={routeTo}
                sx={{
                  color: '#000000',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {formattedName}
              </Link>
            )}
          </Typography>
        );
      })}
    </Box>
  );
};


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: 0
    }}>
      <Navbar />
      <Breadcrumbs />
      <Box component="main" sx={{ 
        flex: 1,
        width: '100%'
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;