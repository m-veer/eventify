// components/Admin/Layout/AdminLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import Breadcrumbs from '../../Common/Breadcrumbs/Breadcrumbs';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: 0,
      backgroundColor: '#f5f5f5'
    }}>
      <AdminNavbar />
      <Breadcrumbs />
      <Box component="main" sx={{ 
        flex: 1,
        width: '100%',
        padding: { xs: '16px', sm: '24px' },
        marginTop: '64px'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;