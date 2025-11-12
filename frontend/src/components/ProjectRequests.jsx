import React, { useState, useEffect, useCallback } from 'react';
import requestService from '../services/requestService';
import AddRequestModal from './AddRequestModal';
import AddWorkLogModal from './AddWorkLogModal';
import {
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
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
// TODO: Yeni ister eklemek için bir Modal (AddRequestModal)

// Bu component, 'projectId'yi prop olarak alacak
function ProjectRequests({ projectId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5; // İsterler için sayfa başına 5 kayıt

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // İster eklendikten sonra listeyi yenile
  const handleRequestAdded = () => {
    fetchRequests(0); // 0. sayfayı (en yeni kayıtlar) getir
  };

  // !--- "SAAT EKLE" MODAL'I İÇİN STATE'LER ---
  const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Hangi istere saat ekleneceğini tutar

  const handleOpenWorkLogModal = (request) => {
    setSelectedRequest(request); // Hangi istere tıkladığımızı state'e ata
    setIsWorkLogModalOpen(true);
  };

  const handleCloseWorkLogModal = () => {
    setIsWorkLogModalOpen(false);
    setSelectedRequest(null); // State'i temizle
  };

  // Çalışma kaydı eklendikten sonra listeyi yenile
  const handleWorkLogAdded = () => {
    fetchRequests(page); // Sadece mevcut sayfayı yenile (toplam saat güncellensin)
    // Veya 0. sayfaya gitmek için fetchRequests(0)
  };
  // !--- STATE'LER SONU ---

  // İsterleri getiren fonksiyon
  const fetchRequests = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getRequestsByProjectId(projectId, currentPage, pageSize);
      setRequests(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]); // projectId değişirse bu fonksiyon yeniden oluşturulur

  // Component yüklendiğinde veya 'fetchRequests' fonksiyonu değiştiğinde veriyi çek
  useEffect(() => {
    fetchRequests(0); // 0. sayfayı getir
  }, [fetchRequests]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchRequests(value - 1); // MUI 1'den başlar, API 0'dan
  };

  // TODO: Modal state'leri ve 'handleRequestAdded' fonksiyonu
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const handleRequestAdded = () => fetchRequests(0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ek İsterler</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal} // modalı açıyor
        >
          Yeni İster Ekle
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}
      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>İstek</TableCell>
                  <TableCell>Tahmini Saat</TableCell>
                  <TableCell>Gerçekleşen Saat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Bu proje için ek ister bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow key={req.id} hover>
                      <TableCell>{req.requestDate}</TableCell>
                      <TableCell>{req.requestType === 'NEW_FEATURE' ? 'Yeni Özellik' : 'Değişiklik Talebi'}</TableCell>
                      <TableCell>{req.requestText}</TableCell>
                      <TableCell align="right">{req.estimatedHours || 0} sa</TableCell>
                      <TableCell align="right">
                        <strong style={{ color: req.actualHours > req.estimatedHours ? 'red' : 'green' }}>
                          {req.actualHours || 0} sa
                        </strong>
                      </TableCell>
                      {/* Çalışma kaydı ekleme kısmı */}
                      <TableCell align="center">
                        <Tooltip title="Çalışma Kaydı Ekle">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenWorkLogModal(req)} // Tıklanan 'req' nesnesini fonksiyona yolla
                          >
                            <AddAlarmIcon />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <AddRequestModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onRequestAdded={handleRequestAdded}
        projectId={projectId} // Modal'ın hangi projeye ekleneceğini bilmesi için
      />

      {/* --- "SAAT EKLE" MODALI --- */}
      {selectedRequest && ( // Sadece bir ister seçiliyse modalı render et
        <AddWorkLogModal
          open={isWorkLogModalOpen}
          handleClose={handleCloseWorkLogModal}
          onWorkLogAdded={handleWorkLogAdded}
          requestToLog={selectedRequest} // Hangi istere ekleneceği bilgisini yolla
        />
      )}
    </Box>
  );
}

export default ProjectRequests;