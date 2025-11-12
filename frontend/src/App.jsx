import React from 'react';
import { Routes, Route } from 'react-router-dom';

//? Public Pages
import LoginPage from './pages/LoginPage';
// import NotFoundPage from './pages/NotFoundPage'; 

//? Global Components
import ProtectedRoute from './components/ProtectedRoute';
import Root from './pages/Root'; // Giriş sonrası yönlendirici

//? Layouts
import AdminLayout from './layouts/AdminLayout'; // Admin Arayüzü
import CustomerLayout from './layouts/CustomerLayout'; // Müşteri Arayüzü

//! Admin Pages
import DashboardPage from './pages/DashboardPage'; // Admin Dashboard'u
import CustomersPage from './pages/CustomersPage';
import ProjectTemplatesPage from './pages/ProjectTemplatesPage';
import CustomerProjectsPage from './pages/CustomerProjectsPage'; // Admin'in gördüğü müşteri proje listesi
import ProjectDetailPage from './pages/ProjectDetailPage'; // Admin'in gördüğü proje detayı

//! Customer Pages
import CustomerDashboard from './pages/CustomerDashboard'; // Müşterinin ana sayfası
import CustomerProjectDetailPage from './pages/CustomerProjectDetailPage';

function App() {
  return (
    // Dıştaki div'i ve H1 başlığını kaldırıyoruz, artık Layout'lar bu işi yapacak
    <Routes>
      {/* ====================================================== */}
      {/* Korumasız Rota (Herkes erişebilir)                     */}
      {/* ====================================================== */}
      <Route path="/login" element={<LoginPage />} />

      {/* ====================================================== */}
      {/* Korumalı Rotalar (Giriş yapmış olmayı gerektirir)      */}
      {/* ====================================================== */}
      <Route element={<ProtectedRoute />}>
        
        {/* ANA YÖNLENDİRİCİ: 
          Kullanıcı / adresine geldiğinde (örn: login sonrası), 
          Bu component (Root.jsx) rolü kontrol eder ve /admin/dashboard veya /customer/dashboard'a yönlendirir.
        */}
        <Route path="/" element={<Root />} />

        {/* --- ADMİN DÜNYASI --- */}
        {/* '/admin' ile başlayan tüm yollar AdminLayout'u (yan menülü) kullanır. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:customerId/projects" element={<CustomerProjectsPage />} />
          <Route path="project-templates" element={<ProjectTemplatesPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          {/* Admin'in göreceği diğer tüm sayfalar buraya eklenecek */}
        </Route>

        {/* --- MÜŞTERİ DÜNYASI --- */}
        {/* '/customer' ile başlayan tüm yollar CustomerLayout'u (basit üst bar) kullanır. */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          {/* Müşterinin göreceği proje detayları */}
          <Route path="projects/:projectId" element={<CustomerProjectDetailPage />} />
        </Route>

      </Route>

      {/* Eşleşmeyen Rotalar (404)
        <Route path="*" element={<NotFoundPage />} /> 
      */}
    </Routes>
  );
}

export default App;