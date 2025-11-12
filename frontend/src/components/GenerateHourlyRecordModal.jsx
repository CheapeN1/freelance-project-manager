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
function GenerateHourlyRecordModal({ open, handleClose, onRecordGenerated, paymentPlan }) {
  // Form state'leri
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startDate || !endDate) {
      setError("Lütfen başlangıç ve bitiş tarihlerini seçin.");
      return;
    }
    setLoading(true);
    setError(null);

    const recordDetails = {
      startDate,
      endDate,
      notes: notes || `Saatlik Çalışma (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`,
    };

    try {
      // Backend'deki yeni servisi çağır
      await paymentPlanService.generateHourlyRecord(paymentPlan.id, recordDetails);
      setLoading(false);
      onRecordGenerated(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'Saatlik fatura oluşturulurken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setStartDate(null);
    setEndDate(null);
    setNotes('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  if (!paymentPlan) return null; // Eğer plan bilgisi yoksa modalı render etme

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr}>
      <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
        <DialogTitle>Saatlik Çalışma Faturası Oluştur</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="subtitle1" gutterBottom>
              Plan: <strong>{paymentPlan.notes || 'Saatlik Plan'}</strong>
            </Typography>
            <Typography variant="body1" gutterBottom>
              Saatlik Ücret: <strong>{paymentPlan.hourlyRate} TL</strong>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Başlangıç Tarihi"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                disabled={loading}
              />
              <DatePicker
                label="Bitiş Tarihi"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                disabled={loading}
              />
            </Box>

            <TextField
              margin="dense"
              id="record-notes"
              label="Fatura Notu (Opsiyonel)"
              type="text"
              fullWidth
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              sx={{ mt: 2 }}
            />
            
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

export default GenerateHourlyRecordModal;