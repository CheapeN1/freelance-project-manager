import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      {/* Üst Menü Barı (AppBar) */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Müşteri Paneli
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2 }}>
                Hoş geldin, {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sayfa İçeriği */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Müşterinin sayfaları (örn: CustomerDashboard) buraya gelecek */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default CustomerLayout;