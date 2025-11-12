import React, { useState } from 'react';
import {
  Button,
  Dialog, // Modal pencere için ana component
  DialogActions, // Modal'ın altındaki buton alanı (Kaydet, İptal)
  DialogContent, // Modal'ın ana içerik alanı (form elemanları)
  DialogContentText, // İçerik metni (opsiyonel)
  DialogTitle, // Modal başlığı
  TextField, // MUI'nin input bileşeni
  CircularProgress, // Yükleniyor göstergesi
  Alert, // Hata mesajı için
} from '@mui/material';
import customerService from '../services/customerService'; // Servisimizi kullanacağız

// Bu component'e dışarıdan şu prop'lar gelecek:
// open: Modal'ın açık olup olmadığını belirten boolean
// handleClose: Modal'ı kapatma fonksiyonu
// onCustomerAdded: Müşteri başarıyla eklendikten sonra çağrılacak fonksiyon (listeyi yenilemek için)
function AddCustomerModal({ open, handleClose, onCustomerAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const customerData = {
      name,
      email,
      phoneNumber,
    };

    try {
      await customerService.createCustomer(customerData);
      setLoading(false);
      onCustomerAdded(); // Başarılı ekleme sonrası ana component'e haber ver
      handleCloseAndReset(); // Modal'ı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'Müşteri eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  // Modal kapatıldığında formu sıfırlayan fonksiyon
  const handleCloseAndReset = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonunu çağır
  };

  return (
    // backdropClick: Dışarı tıklayınca kapanmasın
    // fullWidth: Modal'ın genişliğini ayarlar
    // maxWidth: Modal'ın maksimum genişliği
    <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} >
      <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* <DialogContentText>
            Lütfen yeni müşterinin bilgilerini girin.
          </DialogContentText> */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus // Açıldığında otomatik olarak bu alana odaklansın
            required // Zorunlu alan
            margin="dense" // Daha sıkışık görünüm
            id="name"
            label="Adı Soyadı / Firma Adı"
            type="text"
            fullWidth // Tam genişlik
            variant="outlined" // Kenarlıklı stil
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label="E-posta Adresi"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="dense"
            id="phone"
            label="Telefon Numarası (Opsiyonel)"
            type="tel" // Telefon tipi
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}> {/* Butonlara padding verelim */}
          <Button onClick={handleCloseAndReset} disabled={loading} color="secondary">
            İptal
          </Button>
          <Button type="submit" disabled={loading} variant="contained" color="primary">
            {loading ? <CircularProgress size={24} /> : 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddCustomerModal;