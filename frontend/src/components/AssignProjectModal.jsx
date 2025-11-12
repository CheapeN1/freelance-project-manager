import React, { useState, useEffect, useMemo } from 'react';
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
  FormControl, // Select'i sarmalamak için
  InputLabel,
  Select,
  Box,
} from '@mui/material';
import projectService from '../services/projectService'; // Hem şablonları getirmek hem de atamak için

// Gerekli prop'lar: open, handleClose, onProjectAssigned, customerId
function AssignProjectModal({ open, handleClose, onProjectAssigned, customerId }) {
  const [allTemplates, setAllTemplates] = useState([]); // Tüm proje şablonlarını tutar
  const [customerProjects, setCustomerProjects] = useState([]); // Müşterinin mevcut projelerini tutar
  const [selectedTemplateId, setSelectedTemplateId] = useState(''); // Seçilen şablonun ID'si
  const [loading, setLoading] = useState(true); // Başlangıçta true
  const [error, setError] = useState(null);

  // Modal açıldığında (ve 'open' prop'u true olduğunda) GEREKLİ TÜM VERİLERİ GETİR
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);

      // İki API isteğini aynı anda (paralel) yap
      const fetchModalData = async () => {
        try {
          const [templatesData, customerProjectsData] = await Promise.all([
            // 1. Tüm proje şablonlarını getir
            projectService.getProjectTemplates(),
            // 2. Bu müşteriye ait tüm projeleri getir (Paging'i atlamak için yüksek size)
            projectService.getProjectsByCustomer(customerId, 0, 1000) 
          ]);

          setAllTemplates(templatesData || []);
          setCustomerProjects(customerProjectsData.content || []); // Page objesinden 'content'i al
        } catch (err) {
          setError('Gerekli veriler yüklenirken bir hata oluştu: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchModalData();
    }
  }, [open, customerId]); // 'open' veya 'customerId' değiştiğinde tetiklenir

  // --- FİLTRELEME MANTIĞI ---
  // Müşterinin zaten sahip olduğu proje isimlerini bir Set'e al (hızlı kontrol için)
  const existingProjectNames = useMemo(() => 
    new Set(customerProjects.map(p => p.name)), 
    [customerProjects]
  );

  // Şablon listesini, müşterinin zaten sahip olmadığı projelere göre filtrele
  const availableTemplates = useMemo(() => 
    allTemplates.filter(template => !existingProjectNames.has(template.name)),
    [allTemplates, existingProjectNames]
  );
  // 'useMemo' kullanarak bu filtrelemenin sadece listeler değiştiğinde yapılmasını sağlıyoruz.


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTemplateId) {
      setError('Lütfen bir proje şablonu seçin.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Servisi çağır: (şablonId, müşteriId)
      await projectService.assignProjectToCustomer(selectedTemplateId, customerId);
      setLoading(false);
      onProjectAssigned(); // Başarı sonrası listeyi yenile
      handleCloseAndReset(); // Modalı kapat
    } catch (err) {
      setError(err.message || 'Proje atanırken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setSelectedTemplateId('');
    setError(null);
    setLoading(false);
    setAllTemplates([]); // State'i sıfırla
    setCustomerProjects([]); // State'i sıfırla
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseAndReset} disableEscapeKeyDown={loading} fullWidth maxWidth="sm">
      <DialogTitle>Müşteriye Şablondan Proje Ata</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {loading ? ( // Yükleniyorsa
             <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
             </Box>
          ) : ( // Yükleme bittiyse
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="template-select-label">Proje Şablonu Seçin</InputLabel>
              <Select
                labelId="template-select-label"
                id="template-select"
                value={selectedTemplateId}
                label="Proje Şablonu Seçin"
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                disabled={loading} // Yüklenirken de disable olmalı
              >
                <MenuItem value="" disabled>
                  <em>Lütfen seçin...</em>
                </MenuItem>
                
                {/* Filtrelenmiş 'availableTemplates' listesini kullan */}
                {availableTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    {template.name}
                  </MenuItem>
                ))}

                {/* Bilgi Mesajları */}
                {availableTemplates.length === 0 && allTemplates.length > 0 && (
                  <MenuItem disabled>Tüm şablonlar bu müşteriye zaten atanmış.</MenuItem>
                )}
                 {availableTemplates.length === 0 && allTemplates.length === 0 && !loading && (
                  <MenuItem disabled>Sistemde proje şablonu bulunamadı.</MenuItem>
                )}

              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseAndReset} disabled={loading} color="secondary">
            İptal
          </Button>
          {/* 'disabled' koşulunu 'availableTemplates'e göre güncelle */}
          <Button type="submit" disabled={loading || availableTemplates.length === 0} variant="contained" color="primary">
            {loading ? <CircularProgress size={24} /> : 'Ata'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AssignProjectModal;