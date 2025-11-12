import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Navigate yönlendirme için, Outlet iç içe route'ları render etmek için
import { useAuth } from '../context/AuthContext'; // Giriş durumunu kontrol etmek için

/**
 * Bu component, bir route'un sadece giriş yapmış kullanıcılar tarafından
 * erişilebilir olmasını sağlar.
 * Eğer kullanıcı giriş yapmamışsa, onu login sayfasına yönlendirir.
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth(); // Context'ten giriş durumunu ve yükleme durumunu al

  // AuthContext başlangıçta token'ı kontrol ederken (loading=true),
  // henüz bir şey render etme, bekle. Bu, sayfa yenilendiğinde
  // kısa süreliğine login sayfasına atılmayı engeller.
  if (loading) {
    return <div>Yükleniyor...</div>; // Veya daha şık bir loading spinner
  }

  // Eğer yükleme bittiyse ve kullanıcı giriş yapmamışsa (isAuthenticated=false),
  // Navigate component'i ile /login sayfasına yönlendir.
  // 'replace' prop'u, tarayıcı geçmişinde login sayfasını bir önceki sayfanın yerine koyar,
  // böylece geri tuşu beklenmedik şekilde çalışmaz.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa (isAuthenticated=true),
  // <Outlet /> component'i, bu ProtectedRoute'un altındaki asıl route'u
  // (örn: <DashboardPage />) render eder.
  return <Outlet />;
}

export default ProtectedRoute;