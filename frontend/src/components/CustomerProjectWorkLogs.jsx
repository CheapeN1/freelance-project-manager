import React, { useState, useEffect, useCallback } from 'react';
import workLogService from '../services/workLogService'; // Hazırladığımız servisi kullanıyoruz
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
function CustomerProjectWorkLogs({ projectId }) {
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20; // Raporlama sayfası

  // Kayıtları getiren fonksiyon (Admin'dekiyle aynı)
  const fetchWorkLogs = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki @PreAuthorize kuralı bu isteği (Müşteri veya Admin)
      // zaten güvence altına alıyor.
      const data = await workLogService.getWorkLogsByProjectId(projectId, currentPage, pageSize);
      setWorkLogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Component yüklendiğinde veriyi çek
  useEffect(() => {
    fetchWorkLogs(0); // 0. sayfayı getir
  }, [fetchWorkLogs]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchWorkLogs(value - 1); // MUI 1'den başlar, API 0'dan
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Çalışma Kayıtları Raporu
      </Typography>
      {/* Müşteri panelinde "Yeni Kayıt Ekle" butonu yok (read-only) */}

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
                  <TableCell>Açıklama</TableCell>
                  <TableCell>İster ID</TableCell>
                  <TableCell align="right">Harcanan Saat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Bu proje için çalışma kaydı bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  workLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>#{log.requestId}</TableCell>
                      <TableCell align="right">{log.hoursWorked} sa</TableCell>
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
          <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
            Toplam {totalElements} kayıt bulundu.
          </Typography>
        </>
      )}
    </Box>
  );
}

export default CustomerProjectWorkLogs;