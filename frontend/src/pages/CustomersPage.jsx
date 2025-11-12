import React, { useState, useEffect } from "react";
import customerService from "../services/customerService";
import AddCustomerModal from "../components/AddCustomerModal";
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
  Pagination,
  Box,
  Button,
  IconButton,
  Tooltip, // İkonun üzerine gelince açıklama için
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useNavigate } from 'react-router-dom';

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Müşteri eklendikten sonra listeyi yenilemek için fonksiyon
  const handleCustomerAdded = () => {
    // Genellikle en son eklenen verinin ilk sayfada görünmesi istenir,
    // bu yüzden 0. sayfayı tekrar çekiyoruz.
    // Veya mevcut sayfayı tekrar çekmek isterseniz fetchCustomers(page) kullanın.
    fetchCustomers(0);
    // İsteğe bağlı: Başarı mesajı gösterebilirsiniz (Snackbar ile daha şık olur)
    // alert('Müşteri başarıyla eklendi!');
  };

  const navigate = useNavigate();

  // Müşterinin proje sayfasına yönlendiren fonksiyon
  const handleGoToProjects = (customerId) => {
    navigate(`/admin/customers/${customerId}/projects`);
  };

  // Müşterileri getiren fonksiyon
  const fetchCustomers = async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers(
        currentPage,
        pageSize,
        "name,asc"
      );
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.number || 0);
    } catch (err) {
      console.error("Fetch error:", err); // Debug için
      setError(err.message || "Müşteriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Component ilk yüklendiğinde müşterileri getir
  useEffect(() => {
    fetchCustomers(0); // Her zaman 0. sayfadan başla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece ilk render'da çalışsın

  // Sayfa numarası değiştiğinde çalışacak fonksiyon
  const handlePageChange = (event, value) => {
    const newPage = value - 1;
    fetchCustomers(newPage);
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
          Müşteriler
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal} // Modal'ı açar
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

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
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.200" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Adı Soyadı / Firma Adı</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Gösterilecek müşteri bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {customer.id}
                      </TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phoneNumber || "-"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Müşteri Projelerini Yönet">
                          <IconButton
                            color="primary"
                            onClick={() => handleGoToProjects(customer.id)}
                          >
                            <FolderOpenIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
      <AddCustomerModal
        open={isModalOpen} // Modal'ın açık/kapalı durumunu state'e bağla
        handleClose={handleCloseModal} // Kapatma fonksiyonunu yolla
        onCustomerAdded={handleCustomerAdded} // Başarılı ekleme sonrası listeyi yenileme fonksiyonunu yolla
      />
    </Container>
  );
}

export default CustomersPage;
