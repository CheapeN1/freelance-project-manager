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
  MenuItem, // Select (açılır menü) için
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';


import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Tarih seçici için
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tr } from 'date-fns/locale'; // Tarih seçiciyi Türkçeleştirmek için
import requestService from '../services/requestService';// İster servisimizi kullanacağız

// Gerekli prop'lar: open, handleClose, onRequestAdded, projectId
function AddRequestModal({ open, handleClose, onRequestAdded, projectId }) {
  // Form state'leri
  const [requestText, setRequestText] = useState('');
  const [requestType, setRequestType] = useState('NEW_FEATURE'); // Varsayılan değer
  const [requestDate, setRequestDate] = useState(new Date()); // Varsayılan: bugün
  const [estimatedHours, setEstimatedHours] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tarih seçiciler için MUI'nin yeni paketlerini kurmamız gerekebilir
  // npm install @mui/x-date-pickers date-fns

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const requestData = {
      requestText,
      requestType,
      requestDate, // date-fns bunu 'YYYY-MM-DD' formatına yakın bir stringe çevirir, Spring Boot anlar
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0, // Sayıya çevir
    };

    try {
      await requestService.createRequest(projectId, requestData);
      setLoading(false);
      onRequestAdded(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'İster eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setRequestText('');
    setRequestType('NEW_FEATURE');
    setRequestDate(new Date());
    setEstimatedHours('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  return (
    // Tarih seçicinin düzgün çalışması için LocalizationProvider ile sarmalıyoruz
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr}>
      <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
        <DialogTitle>Projeye Yeni İster Ekle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              autoFocus
              required
              margin="dense"
              id="request-text"
              label="İstek Metni"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              disabled={loading}
            />
            
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="request-type-label">İster Tipi</InputLabel>
              <Select
                labelId="request-type-label"
                id="request-type"
                value={requestType}
                label="İster Tipi"
                onChange={(e) => setRequestType(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="NEW_FEATURE">Yeni Özellik (Ek İster)</MenuItem>
                <MenuItem value="CHANGE_REQUEST">Değişiklik Talebi</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="İstek Tarihi"
              value={requestDate}
              onChange={(newValue) => setRequestDate(newValue)}
              slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
              disabled={loading}
            />

            <TextField
              margin="dense"
              id="estimated-hours"
              label="Tahmini Çalışma Saati (Opsiyonel)"
              type="number" // Sadece sayı girişi
              fullWidth
              variant="outlined"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              disabled={loading}
              inputProps={{ min: 0, step: 0.5 }} // 0.5'lik artışlara izin ver
            />
            
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button onClick={handleCloseAndReset} disabled={loading} color="secondary">
              İptal
            </Button>
            <Button type="submit" disabled={loading} variant="contained" color="primary">
              {loading ? <CircularProgress size={24} /> : 'Kaydet'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default AddRequestModal;