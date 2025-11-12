import React, { useState, useEffect, useCallback } from 'react';
import requestService from '../services/requestService'; // Admin için yazdığımız servisin aynısını kullanıyoruz
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
} from '@mui/material';

// Bu component, 'projectId'yi prop olarak alacak
function CustomerProjectRequests({ projectId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // İsterleri getiren fonksiyon
  const fetchRequests = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki @PreAuthorize("...isProjectOwner...") kuralı
      // bu isteği bizim için zaten güvence altına alıyor.
      const data = await requestService.getRequestsByProjectId(projectId, currentPage, pageSize);
      setRequests(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Component yüklendiğinde veya 'fetchRequests' fonksiyonu değiştiğinde veriyi çek
  useEffect(() => {
    fetchRequests(0); // 0. sayfayı getir
  }, [fetchRequests]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchRequests(value - 1); // MUI 1'den başlar, API 0'dan
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Proje İsterleri
      </Typography>
      {/* Müşteri panelinde "Yeni İster Ekle" butonu yok (read-only) */}

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
                      {/* Müşteri panelinde "İşlem" (Saat Ekle) sütunu yok */}
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
    </Box>
  );
}

export default CustomerProjectRequests;