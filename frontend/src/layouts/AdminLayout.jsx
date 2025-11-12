import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard'; // İkonlar
import PeopleIcon from '@mui/icons-material/People'; // İkonlar
import FolderIcon from '@mui/icons-material/Folder'; // İkonlar

const drawerWidth = 240; // Yan menünün genişliği

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hangi sayfada olduğumuzu bilmek için

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menü elemanları
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Müşteriler', icon: <PeopleIcon />, path: '/admin/customers' },
    { text: 'Proje Şablonları', icon: <FolderIcon />, path: '/admin/project-templates' },
  ];

  return (
    // Box, tüm layout'u kapsar ve display: flex ile yan menü + içeriği hizalar
    <Box sx={{ display: 'flex' }}>
      {/* CSS sıfırlaması ve temel arkaplan rengi için */}
      <CssBaseline />

      {/* Üst Menü Barı (AppBar) */}
      <AppBar
        position="fixed" // Sayfa kaysa bile üstte sabit kal
        // Yan menünün (Drawer) genişliği kadar soldan boşluk bırak
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Hangi sayfadaysak onun başlığını gösterebiliriz (opsiyonel) */}
            {menuItems.find(item => item.path === location.pathname)?.text || 'Proje Yönetimi'}
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

      {/* Sol Yan Menü (Drawer) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent" // Kalıcı, her zaman açık
        anchor="left"
      >
        <Toolbar /> {/* AppBar'ın yüksekliği kadar boşluk bırakır */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path} // Aktif sayfayı vurgula
                  onClick={() => navigate(item.path)} // Tıklayınca ilgili sayfaya git
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Sayfa İçeriği */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, width: `calc(100% - ${drawerWidth}px)` }}
      >
        <Toolbar /> {/* Üst AppBar'ın yüksekliği kadar boşluk bırakır */}
        
        {/* ProtectedRoute altındaki asıl sayfa buraya gelir */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;