import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams -> URL'den :customerId'yi almak için
import projectService from "../services/projectService"; // Proje servisimizi kullanacağız
import customerService from "../services/customerService"; // Müşteri bilgisini almak için (opsiyonel)
import AssignProjectModal from "../components/AssignProjectModal";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  Pagination,
  // TODO: Şablondan proje eklemek için bir Modal (veya Select/Button)
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function CustomerProjectsPage() {
  // 1. URL'den customerId'yi al
  const { customerId } = useParams(); // Bu, :customerId ile eşleşir
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleOpenAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  // Proje atandıktan sonra listeyi yenile
  const handleProjectAssigned = () => {
    fetchProjects(0); // 0. sayfayı tekrar çek
  };

  // Müşterinin projelerini getiren fonksiyon
  const fetchProjects = useCallback(
    async (currentPage) => {
      setLoading(true);
      setError(null);
      try {
        // 2. Servisi customerId ve sayfa bilgisiyle çağır
        const data = await projectService.getProjectsByCustomer(
          customerId,
          currentPage,
          pageSize
        );
        setProjects(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPage(data.number || 0);
      } catch (err) {
        setError(
          err.message || "Müşteri projeleri yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    },
    [customerId]
  ); // customerId değişirse fonksiyonu yeniden oluştur

  // Component ilk yüklendiğinde projeleri getir
  useEffect(() => {
    fetchProjects(0); // 0. sayfayı getir
  }, [fetchProjects]); // fetchProjects (ve dolayısıyla customerId) değiştiğinde tekrar çalışır

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    const newPage = value - 1;
    fetchProjects(newPage);
  };

  // Bir projenin detay sayfasına gitmek için
  const handleGoToProjectDetail = (projectId) => {
    navigate(`/admin/projects/${projectId}`);
  };


  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom component="div">
          Müşteri Projeleri (ID: {customerId}) {/* Başlığı dinamik yap */}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAssignModal} // Modal'ı açar
        >
          Şablondan Proje Ekle
        </Button>
      </Box>

      {/* Yüklenme, Hata ve Tablo Gösterimi (CustomersPage'den kopyalandı) */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
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
                <TableRow sx={{ backgroundColor: "grey.200" }}>
                  <TableCell>Proje ID</TableCell>
                  <TableCell>Proje Adı</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>Şablon mu?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Bu müşteriye ait proje bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      hover // Üzerine gelince arkaplan rengini değiştir
                      onClick={() => handleGoToProjectDetail(project.id)} // Tıklama olayını ekle
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer' // Fare imlecini el işareti yap
                      }}
                    >
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.description || '-'}</TableCell>
                      <TableCell>{project.template ? 'Evet' : 'Hayır'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Sayfalama Kontrolü */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
            >
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
          <Typography variant="caption" display="block" align="center">
            Toplam {totalElements} kayıt bulundu.
          </Typography>
        </>
      )}

      {/* TODO: <AssignProjectModal ... /> component'i buraya gelecek */}
      <AssignProjectModal
        open={isAssignModalOpen}
        handleClose={handleCloseAssignModal}
        onProjectAssigned={handleProjectAssigned}
        customerId={Number(customerId)} // URL'den gelen customerId'yi (String) Number'a çevirerek yolla
      />
    </Container>
  );
}

export default CustomerProjectsPage;
