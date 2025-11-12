import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService'; // Proje servisini import et
import { useNavigate } from 'react-router-dom'; // Proje detayına gitmek için
import VisibilityIcon from '@mui/icons-material/Visibility'; // "Gör" ikonu
import PersonAddIcon from '@mui/icons-material/PersonAdd'; 
import AddUserModal from '../components/AddUserModal';

function CustomerDashboard() {
  const { user } = useAuth(); // Giriş yapmış kullanıcıyı al
  const navigate = useNavigate();

  // Modal State'i
  const [openUserModal, setOpenUserModal] = useState(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;


  
  // Backend'deki güvenlik servisi (@customerSecurityService)
  // customerId'yi kontrol edeceği için, burada user.customer.id'yi
  // göndermemiz gerekiyor. ANCAK, AuthContext'teki user objemizde
  // customerId yok. Bunu eklememiz gerekecek.
  // *** Şimdilik backend'in user'dan customerId'yi alacağını varsayalım ***
  // *** VEYA AuthContext'i güncelleyelim. ***
  
  // --- DÜZELTME: AuthContext'in user objesinde customerId'ye ihtiyacımız var ---
  // (Bir sonraki adımda AuthContext'i güncelleyeceğiz)
  // ŞİMDİLİK user.customerId olduğunu varsayalım.
  const customerId = user?.customerId; // TODO: Bu alanı AuthContext'e eklemeliyiz.

  // Kullanıcı "Owner" mı kontrolü
  const isOwner = user?.roles?.includes('ROLE_CUSTOMER_OWNER');

  // Projeleri getiren fonksiyon
  const fetchProjects = useCallback(async (currentPage) => {
    if (!customerId) { // Eğer customerId yoksa (AuthContext güncellenmediyse) istek atma
        setLoading(false);
        setError("Kullanıcı bilgileri eksik. Projeler getirilemiyor.");
        return;
    }

    setLoading(true);
    setError(null);
    try {
      // Servisi customerId ve sayfa bilgisiyle çağır
      const data = await projectService.getProjectsByCustomer(customerId, currentPage, pageSize);
      setProjects(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message || 'Projeler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [customerId]); // customerId değişirse fonksiyonu yeniden oluştur

  // Component ilk yüklendiğinde projeleri getir
  useEffect(() => {
    fetchProjects(0); // 0. sayfayı getir
  }, [fetchProjects]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchProjects(value - 1); // MUI 1'den başlar, API 0'dan
  };

  // Proje detay sayfasına git (Müşteri versiyonu)
  const handleGoToProjectDetail = (projectId) => {
    // Müşteri dünyası için yeni rotamızı kullanıyoruz
    navigate(`/customer/projects/${projectId}`);
  };

  return (
    <div>
      {/* Başlık Alanı ve Buton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
            <Typography variant="h4" gutterBottom>
                Hoş Geldin, {user?.username}!
            </Typography>
            <Typography>
                Projelerinizi ve ekibinizi buradan yönetebilirsiniz.
            </Typography>
        </Box>

        {/* SADECE OWNER İSE BUTONU GÖSTER */}
        {isOwner && (
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<PersonAddIcon />}
                onClick={() => setOpenUserModal(true)}
            >
                Yeni Kullanıcı Ekle
            </Button>
        )}
      </Box>

      <Typography variant="h5" gutterBottom>
        Projelerim
      </Typography>

      {/* Yüklenme, Hata ve Tablo Gösterimi */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="customer projects table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>Proje ID</TableCell>
                  <TableCell>Proje Adı</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="center">Detaylar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Size atanmış bir proje bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} hover onClick={() => handleGoToProjectDetail(project.id)} // Tıklama olayı
                      sx={{ cursor: 'pointer' }}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.description || '-'}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Proje Detaylarını Gör">
                          <IconButton
                            color="primary"
                            onClick={() => handleGoToProjectDetail(project.id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Sayfalama Kontrolü */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
          <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
            Toplam {totalElements} kayıt bulundu.
          </Typography>
        </>
      )}

      <AddUserModal 
        open={openUserModal} 
        onClose={() => setOpenUserModal(false)} 
        defaultCustomerId={customerId} // Owner'ın ID'sini otomatik gönderiyoruz
        onSuccess={() => {
            // İstersen burada bir "Success" mesajı (Snackbar) gösterebilirsin.
            // Kullanıcı listesi bu sayfada olmadığı için tabloyu yenilemeye gerek yok.
            console.log("Kullanıcı eklendi.");
        }}
      />

    </div>
  );
}

export default CustomerDashboard;