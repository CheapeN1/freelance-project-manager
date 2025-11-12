import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import userService from '../services/userService';

// YENİ PROP: defaultCustomerId (Owner paneli için)
export default function AddUserModal({ open, onClose, onSuccess, defaultCustomerId }) {
  
  // Form state'i
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    customerId: '', 
    roleName: 'ROLE_CUSTOMER_ACCOUNTANT'
  });
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Eğer defaultCustomerId geldiyse (Owner açtıysa), state'i güncelle
  useEffect(() => {
    if (defaultCustomerId) {
      setFormData(prev => ({ ...prev, customerId: defaultCustomerId }));
    }
  }, [defaultCustomerId, open]); // Modal açıldığında veya ID değiştiğinde çalışır

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    try {
      await userService.addUserToCustomer({
        username: formData.username,
        password: formData.password,
        customerId: Number(formData.customerId), 
        roleName: formData.roleName
      });
      
      setSuccessMsg("Kullanıcı başarıyla eklendi!");
      
      setTimeout(() => {
        onSuccess && onSuccess();
        // Formu sıfırla (ancak default ID varsa onu koru)
        setFormData({ 
            username: '', 
            password: '', 
            customerId: defaultCustomerId || '', 
            roleName: 'ROLE_CUSTOMER_ACCOUNTANT' 
        });
        setSuccessMsg(null);
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2, mt: 1 }}>{successMsg}</Alert>}

        <TextField
          autoFocus
          margin="dense"
          name="username"
          label="E-posta Adresi"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.username}
          onChange={handleChange}
        />
        
        <TextField
          margin="dense"
          name="password"
          label="Şifre"
          type="password"
          fullWidth
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
        />

        {/* KRİTİK NOKTA: Eğer defaultCustomerId YOKSA (Adminse) bu alanı göster.
            Varsa (Owner ise) gizle, zaten arka planda state'te tutuyoruz. */}
        {!defaultCustomerId && (
            <TextField
            margin="dense"
            name="customerId"
            label="Müşteri ID"
            type="number"
            fullWidth
            variant="outlined"
            helperText="Hangi müşteriye eklenecek?"
            value={formData.customerId}
            onChange={handleChange}
            />
        )}

        <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
          <InputLabel>Rol Seçin</InputLabel>
          <Select
            name="roleName"
            value={formData.roleName}
            label="Rol Seçin"
            onChange={handleChange}
          >
            <MenuItem value="ROLE_CUSTOMER_ACCOUNTANT">Muhasebeci (Accountant)</MenuItem>
            {/* Owner kendi yerine başka Owner ekleyebilir mi? Genelde evet, ama opsiyonel */}
            <MenuItem value="ROLE_CUSTOMER_OWNER">Ortak/Yönetici (Owner)</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">İptal</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}