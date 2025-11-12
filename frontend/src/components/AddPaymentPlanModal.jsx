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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';


import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { tr } from 'date-fns/locale'; 
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import paymentPlanService from '../services/paymentPlanService';

// Gerekli prop'lar: open, handleClose, onPlanAdded, projectId
function AddPaymentPlanModal({ open, handleClose, onPlanAdded, projectId }) {
  // --- Ana Form State'leri ---
  const [planType, setPlanType] = useState('ONE_TIME'); // Varsayılan tip
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- STATE'LER (Abonelik için) ---
  const [recurringAmount, setRecurringAmount] = useState('');
  const [startDate, setStartDate] = useState(null); // Başlangıçta boş

  // --- Taksit (Installment) State'i ---
  const [installments, setInstallments] = useState([
    { amount: '', dueDate: null } // Başlangıçta bir boş taksit
  ]);

  // --- Saatlik ödeme için state
  const [hourlyRate, setHourlyRate] = useState('');

  // --- Taksit Fonksiyonları ---
  const handleAddInstallment = () => {
    setInstallments([...installments, { amount: '', dueDate: null }]);
  };

  const handleRemoveInstallment = (index) => {
    const newInstallments = installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = [...installments];
    newInstallments[index][field] = value;
    setInstallments(newInstallments);
  };
  
  // --- Ana Fonksiyonlar ---
  const handleCloseAndReset = () => {
    setPlanType('ONE_TIME');
    setTotalAmount('');
    setNotes('');
    setInstallments([{ amount: '', dueDate: null }]);
    setRecurringAmount('');
    setStartDate(null);
    setHourlyRate('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const planData = {
      projectId: projectId,
      planType: planType,
      status: (planType === 'SUBSCRIPTION') ? 'ACTIVE' : 'PENDING', // Abonelik başlar başlamaz 'ACTIVE' olsun
      notes: notes,
      
      // Tip'e göre ilgili alanları doldur
      totalAmount: (planType === 'ONE_TIME' || planType === 'INSTALLMENT') ? parseFloat(totalAmount) || 0 : null,
      recurringAmount: (planType === 'SUBSCRIPTION') ? parseFloat(recurringAmount) || 0 : null, // <-- YENİ
      startDate: (planType === 'SUBSCRIPTION') ? startDate : null, // <-- YENİ
      hourlyRate: (planType === 'HOURLY') ? parseFloat(hourlyRate) || 0 : null,
      
      installments: (planType === 'INSTALLMENT') ? installments.map(inst => ({
        ...inst,
        amount: parseFloat(inst.amount) || 0,
      })) : [],
    };

    if (planType === 'INSTALLMENT') {
      planData.installments = installments.map(inst => ({
        ...inst,
        amount: parseFloat(inst.amount) || 0,
      }));
    }

    try {
      await paymentPlanService.createPaymentPlan(projectId, planData);
      setLoading(false);
      onPlanAdded(); 
      handleCloseAndReset(); 
    } catch (err) {
      setError(err.message || 'Hakediş eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr}>
      <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
        <DialogTitle>Yeni Hakediş Ekle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="plan-type-label">Hakediş Tipi</InputLabel>
              <Select
                labelId="plan-type-label"
                id="plan-type"
                value={planType}
                label="Hakediş Tipi"
                onChange={(e) => setPlanType(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="ONE_TIME">Tek Seferlik Ödeme</MenuItem>
                <MenuItem value="INSTALLMENT">Parçalı Ödeme (Taksitli)</MenuItem>
                <MenuItem value="SUBSCRIPTION">Abonelik</MenuItem>
                <MenuItem value="HOURLY">Saatlik</MenuItem>
              </Select>
            </FormControl>

            {(planType === 'ONE_TIME' || planType === 'INSTALLMENT') && (
              <TextField
                required
                margin="dense"
                id="total-amount"
                label="Toplam Tutar (TL)"
                type="number"
                fullWidth
                variant="outlined"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.01 }}
              />
            )}

            {/* --- Sadece Abonelik --- */}
            {planType === 'SUBSCRIPTION' && (
              <Box sx={{ mt: 1 }}>
                <TextField
                  required
                  margin="dense"
                  id="recurring-amount"
                  label="Aylık Tutar (TL)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={recurringAmount}
                  onChange={(e) => setRecurringAmount(e.target.value)}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <DatePicker
                  label="Abonelik Başlangıç Tarihi"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, margin: 'dense', required: true } }}
                  disabled={loading}
                  sx={{ mt: 1 }} // Üstten boşluk
                />
              </Box>
            )}
            
            {planType === 'HOURLY' && (
              <Box sx={{ mt: 1 }}>
                <TextField
                  required
                  margin="dense"
                  id="hourly-rate"
                  label="Saatlik Ücret (TL)"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>
            )}

            {planType === 'INSTALLMENT' && (
              <Box sx={{ mt: 2, border: '1px solid', borderColor: 'grey.300', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" fontSize="1rem" gutterBottom>Taksit Detayları</Typography>
                {installments.map((inst, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      required
                      label={`Taksit ${index + 1} Tutar (TL)`}
                      type="number"
                      size="small"
                      sx={{ flexGrow: 1, mr: 1 }}
                      value={inst.amount}
                      onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                    <DatePicker
                      label="Vade Tarihi"
                      value={inst.dueDate}
                      onChange={(newValue) => handleInstallmentChange(index, 'dueDate', newValue)}
                      slotProps={{ textField: { size: 'small', required: true, sx: { width: '170px' } } }}
                    />
                    {installments.length > 1 && (
                      <IconButton onClick={() => handleRemoveInstallment(index)} color="error" sx={{ ml: 0.5 }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddInstallment}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Taksit Ekle
                </Button>
              </Box>
            )}

            <TextField
              margin="dense"
              id="notes"
              label="Notlar (Opsiyonel)"
              type="text"
              fullWidth
              multiline
              rows={3}
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
              {loading ? <CircularProgress size={24} /> : 'Kaydet'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}

export default AddPaymentPlanModal;