import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Container,
  Button,
} from '@mui/material';
import dashboardService from '../services/dashboardService'; // Servisimizi import ettik
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddUserModal from '../components/AddUserModal';

// İstatistik Kartı Bileşeni (Tasarım)
function StatCard({ title, value, description, color }) {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        height: 160,
        justifyContent: 'space-between',
        borderRadius: 2,
        borderLeft: `6px solid ${color || '#1976d2'}` // Sol tarafa renkli şerit
      }}
    >
      <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography component="p" variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  
  // Başlangıç state'leri
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalCustomers: 0,
    pendingPayments: '0,00 TL',
    totalRequests: 0 
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Modal için state
  const [openUserModal, setOpenUserModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Backend'den veriyi çek
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard verisi çekilemedi:", err);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Yükleniyor durumu
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Başlık ve Hoşgeldin Mesajı */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
             Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Hoş geldin, {user?.fullName || user?.username || 'Yönetici'}. İşte sistem özeti:
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<PersonAddIcon />} // İkonu silebilirsin hata verirse
          onClick={() => setOpenUserModal(true)}
        >
          Yeni Kullanıcı Ekle
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Kart 1: Aktif Projeler */}
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Aktif Projeler" 
            value={stats.activeProjects} 
            description="Şablon olmayan devam eden projeler"
            color="#1976d2" // Mavi
          />
        </Grid>

        {/* Kart 2: Toplam Müşteriler */}
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Toplam Müşteriler" 
            value={stats.totalCustomers} 
            description="Sistemdeki kayıtlı tüm müşteriler"
            color="#2e7d32" // Yeşil
          />
        </Grid>
        
        {/* Kart 3: Bekleyen Ödemeler */}
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Bekleyen Ödemeler" 
            value={stats.pendingPayments} 
            description="Taksit ve fatura toplamı"
            color="#ed6c02" // Turuncu
          />
        </Grid>

        {/* Kart 4: Toplam Talepler */}
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Toplam Talepler" 
            value={stats.totalRequests} 
            description="Ek istek ve taleplerin sayısı"
            color="#9c27b0" // Mor
          />
        </Grid>
      </Grid>

      <AddUserModal 
        open={openUserModal} 
        onClose={() => setOpenUserModal(false)} 
        onSuccess={() => {
            console.log("Kullanıcı eklendi, belki dashboard verilerini yenilemek istersin?");
            // fetchDashboardData(); // İstersen istatistikleri yeniletebilirsin
        }}
      />
    </Container>
  );
}

export default DashboardPage;