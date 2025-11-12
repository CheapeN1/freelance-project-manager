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
} from '@mui/material';
import projectService from '../services/projectService'; // Proje servisimizi kullanacağız

// Gerekli prop'lar: open, handleClose, onTemplateAdded
function AddProjectTemplateModal({ open, handleClose, onTemplateAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const templateData = {
      name,
      description,
      // isTemplate: true (bunu backend'deki bean otomatik olarak ayarlıyor)
    };

    try {
      await projectService.createProjectTemplate(templateData);
      setLoading(false);
      onTemplateAdded(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat ve formu sıfırla
    } catch (err) {
      setError(err.message || 'Şablon eklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setName('');
    setDescription('');
    setError(null);
    setLoading(false);
    handleClose(); // Ana component'ten gelen kapatma fonksiyonu
  };

  return (
    <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
      <DialogTitle>Yeni Proje Şablonu Ekle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            required
            margin="dense"
            id="template-name"
            label="Şablon Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="dense"
            id="template-description"
            label="Açıklama (Opsiyonel)"
            type="text"
            fullWidth
            multiline // Çok satırlı metin alanı
            rows={4} // 4 satır yükseklik
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
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
  );
}

export default AddProjectTemplateModal;