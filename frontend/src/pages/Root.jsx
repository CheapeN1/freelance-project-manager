import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material'; // Yükleme göstergesi için

/**
 * Bu component'in tek görevi, giriş yapmış kullanıcıyı
 * rolüne göre doğru dashboard'a yönlendirmektir.
 */
function Root() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // AuthContext'in kullanıcıyı yüklemesini bekle
    if (loading) {
      return; // Henüz yükleniyorsa bir şey yapma
    }

    if (user && user.roles) {
      // Rolü kontrol et
      if (user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.roles.includes('ROLE_CUSTOMER_OWNER') || user.roles.includes('ROLE_CUSTOMER_ACCOUNTANT')) {
        navigate('/customer/dashboard', { replace: true });
      } else {
        // Tanımsız bir rol varsa veya rolü yoksa (beklenmedik durum)
        navigate('/login', { replace: true });
      }
    } else if (!loading && !user) {
       // Yükleme bitti ama kullanıcı yoksa (token geçersizse vb.) login'e yolla
       navigate('/login', { replace: true });
    }

  }, [user, loading, navigate]);

  // Yönlendirme gerçekleşene kadar bir yükleme göstergesi göster
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default Root;