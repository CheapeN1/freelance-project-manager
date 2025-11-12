import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import AddProjectTemplateModal from '../components/AddProjectTemplateModal';
import {
  Container,
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
  Box,
  Button,
  // TODO: Yeni şablon eklemek için bir Modal component'i (AddProjectTemplateModal)
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function ProjectTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Şablon eklendikten sonra listeyi yenile
  const handleTemplateAdded = () => {
    fetchTemplates(); // Listeyi yenile
  };

  // Veri getirme fonksiyonu
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Servisten veriyi çek (Paging yok, direkt liste gelecek)
      const data = await projectService.getProjectTemplates();
      setTemplates(data || []);
    } catch (err) {
      setError(err.message || 'Şablonlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Component ilk yüklendiğinde veriyi getir
  useEffect(() => {
    fetchTemplates();
  }, []); // Sadece ilk render'da çalışsın

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom component="div">
          Proje Şablonları
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Yeni Şablon Ekle
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="project templates table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.200' }}>
                <TableCell>ID</TableCell>
                <TableCell>Şablon Adı</TableCell>
                <TableCell>Açıklama</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Gösterilecek proje şablonu bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow
                    key={template.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{template.id}</TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.description || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddProjectTemplateModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        onTemplateAdded={handleTemplateAdded}
      />
    </Container>
  );
}

export default ProjectTemplatesPage;