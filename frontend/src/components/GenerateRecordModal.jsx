import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tr } from 'date-fns/locale';
import paymentPlanService from '../services/paymentPlanService'; // Servisimizi kullanacağız

// Gerekli prop'lar: open, handleClose, onRecordGenerated, paymentPlan
function GenerateRecordModal({ open, handleClose, onRecordGenerated, paymentPlan }) {
  // Form state'leri
  const [notes, setNotes] = useState('');
  const [issueDate, setIssueDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date(new Date().setDate(new Date().getDate() + 15))); // Varsayılan 15 gün vade
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const recordDetails = {
      notes: notes || `${new Date().toLocaleString('tr', { month: 'long' })} Faturası`, // Varsayılan not
      issueDate,
      dueDate,
      amount: paymentPlan.recurringAmount, // Tutar ana plandan gelir
      status: 'UNPAID', // Backend de bunu yapar ama buradan göndermek netlik sağlar
    };

    try {
      await paymentPlanService.generateSubscriptionRecord(paymentPlan.id, recordDetails);
      setLoading(false);
      onRecordGenerated(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'Fatura oluşturulurken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setNotes('');
    setIssueDate(new Date());
    setDueDate(new Date(new Date().setDate(new Date().getDate() + 15)));
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  if (!paymentPlan) return null; // Eğer plan bilgisi yoksa modalı render etme

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr}>
      <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
        <DialogTitle>Abonelik Faturası Oluştur</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="subtitle1" gutterBottom>
              Plan: <strong>{paymentPlan.notes}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Aylık Tutar: <strong>{paymentPlan.recurringAmount} TL</strong>
            </Typography>

            <TextField
              autoFocus
              margin="dense"
              id="record-notes"
              label="Fatura Notu (örn: Kasım 2025)"
              type="text"
              fullWidth
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Fatura Tarihi"
                value={issueDate}
                onChange={(newValue) => setIssueDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                disabled={loading}
              />
              <DatePicker
                label="Son Ödeme Tarihi"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                disabled={loading}
              />
            </Box>
            
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button onClick={handleCloseAndReset} disabled={loading} color="secondary">
              İptal
            </Button>
            <Button type="submit" disabled={loading} variant="contained" color="primary">
              {loading ? <CircularProgress size={24} /> : 'Fatura Oluştur'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default GenerateRecordModal;