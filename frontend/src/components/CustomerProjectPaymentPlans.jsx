import React, { useState, useEffect, useCallback } from 'react';
import paymentPlanService from '../services/paymentPlanService'; // Backend servisini kullan
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
  Chip, // Durumları (Status) göstermek için
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // İkonlar
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// Not: Admin'e özel 'useAuth', 'Button', 'IconButton' vb. import edilmedi.

// Bu component, 'projectId'yi prop olarak alacak
function CustomerProjectPaymentPlans({ projectId }) {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // Hakedişleri getiren fonksiyon (Admin'dekiyle aynı)
  const fetchPaymentPlans = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki @PreAuthorize kuralı bu isteği (Müşteri veya Admin)
      // zaten güvence altına alıyor.
      const data = await paymentPlanService.getPaymentPlansByProjectId(projectId, currentPage, pageSize);
      setPaymentPlans(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Component yüklendiğinde veriyi çek
  useEffect(() => {
    fetchPaymentPlans(0);
  }, [fetchPaymentPlans]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchPaymentPlans(value - 1);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Hakedişler (Ödeme Planları)
      </Typography>
      {/* Müşteri panelinde "Yeni Hakediş Ekle" butonu yok */}

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
                  <TableCell>Tip</TableCell>
                  <TableCell>Toplam Tutar / Aylık</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Notlar</TableCell>
                  <TableCell>Taksitler / Detaylar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Bu proje için ödeme planı bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentPlans.map((plan) => (
                    <TableRow key={plan.id} hover>
                      <TableCell>{plan.planType}</TableCell>
                      <TableCell>
                      {/* Koşulu güncelliyoruz:
                          1. Eğer tip 'SUBSCRIPTION' (Abonelik) ise, aylık tutarı göster.
                          2. Eğer tip 'HOURLY' (Saatlik) ise, saatlik ücreti (hourlyRate) göster.
                          3. Diğer durumlarda (ONE_TIME, INSTALLMENT) toplam tutarı (totalAmount) göster.
                      */}
                        {plan.planType === 'SUBSCRIPTION'
                          ? `${plan.recurringAmount} TL (Aylık)`
                          : plan.planType === 'HOURLY'
                            ? `${plan.hourlyRate} TL (Saatlik)`
                            : `${plan.totalAmount} TL`}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={plan.status} 
                          color={
                            plan.status === 'COMPLETED' ? 'success' : 
                            (plan.status === 'ACTIVE' ? 'primary' : 
                            (plan.status === 'CANCELLED' ? 'error' : 'default'))
                          } 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{plan.notes || '-'}</TableCell>
                      <TableCell>
                        {/* Koşul 1: Taksitli Plan */}
                        {plan.planType === 'INSTALLMENT' && plan.installments.map(inst => (
                          <Box key={inst.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                            {inst.paid ? <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 1 }} /> : <AccessTimeIcon color="disabled" sx={{ fontSize: 16, mr: 1 }} />}
                            <Typography variant="body2" sx={{ mr: 1, textDecoration: inst.paid ? 'line-through' : 'none' }}>
                              {inst.amount} TL - Vade: {inst.dueDate}
                            </Typography>
                          </Box>
                        ))}

                        {/* // DEĞİŞİKLİK 2: Koşul 2, HOURLY tipi planları da içerecek şekilde güncellendi */}
                        {/* Koşul 2: Abonelik VEYA Saatlik Plan */}
                        {/* Bu plana bağlı PaymentRecord'ları (faturaları) listele */}
                        {(plan.planType === 'SUBSCRIPTION' || plan.planType === 'HOURLY') && plan.paymentRecords.map(rec => (
                          <Box key={rec.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                            {rec.status === 'PAID' ? <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 1 }} /> : <AccessTimeIcon color="disabled" sx={{ fontSize: 16, mr: 1 }} />}
                            <Typography variant="body2" sx={{ mr: 1, textDecoration: rec.status === 'PAID' ? 'line-through' : 'none' }}>
                              {rec.amount} TL - {rec.notes || rec.issueDate} (Vade: {rec.dueDate})
                            </Typography>
                          </Box>
                        ))}
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
    </Box>
  );
}

export default CustomerProjectPaymentPlans;