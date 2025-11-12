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
import workLogService from '../services/workLogService'; // Yeni servisimizi kullanacağız

// Gerekli prop'lar: open, handleClose, onWorkLogAdded
// requestToLog: Hangi istere eklendiğini bilmek için (id ve requestText içerir)
function AddWorkLogModal({ open, handleClose, onWorkLogAdded, requestToLog }) {
  // Form state'leri
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [hoursWorked, setHoursWorked] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const workLogData = {
      description,
      date,
      hoursWorked: parseFloat(hoursWorked) || 0,
      requestId: requestToLog.id // Hangi istere ait olduğu
    };

    try {
      await workLogService.createWorkLog(requestToLog.id, workLogData);
      setLoading(false);
      onWorkLogAdded(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'Çalışma kaydı eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setDescription('');
    setDate(new Date());
    setHoursWorked('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr}>
      <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
        <DialogTitle>Çalışma Kaydı Ekle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="subtitle1" gutterBottom>
              İster: <strong>{requestToLog?.requestText || ''}</strong> (ID: {requestToLog?.id})
            </Typography>
            
            <TextField
              autoFocus
              required
              margin="dense"
              id="worklog-description"
              label="Açıklama"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Çalışma Tarihi"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                disabled={loading}
              />
              <TextField
                required
                margin="dense"
                id="hours-worked"
                label="Harcanan Saat"
                type="number"
                fullWidth
                variant="outlined"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Box>
            
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

export default AddWorkLogModal;