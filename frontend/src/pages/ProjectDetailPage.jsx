import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useParams -> URL'den :projectId'yi almak için
import {
  Container,
  Typography,
  Box,
  Tabs, // Sekme yapısı için
  Tab, // Her bir sekme başlığı
  CircularProgress,
  Alert,
  Button, // Geri dön butonu için
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import projectService from '../services/projectService';
import ProjectRequests from '../components/ProjectRequests';
import ProjectPaymentPlans from '../components/ProjectPaymentPlans';
import ProjectWorkLogs from '../components/ProjectWorkLogs';

// TODO: Bu sekmelerin içerik component'lerini daha sonra oluşturacağız
// import ProjectRequests from '../components/ProjectRequests';
// import ProjectPaymentPlans from '../components/ProjectPaymentPlans';
// import ProjectWorkLogs from '../components/ProjectWorkLogs';

// Sekme panellerini göstermek için yardımcı component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}> {/* Sekme içeriğine padding ver */}
          {children}
        </Box>
      )}
    </div>
  );
}


function ProjectDetailPage() {
  // URL'den projectId'yi al
  const { projectId } = useParams();
  const navigate = useNavigate();

  // TODO: Proje adını vs. getirmek için API isteği (şimdilik sadece ID'yi kullanalım)
  const [project, setProject] = useState(null); // Proje nesnesinin tamamını tutalım
  const [loading, setLoading] = useState(true); // Proje verisi için 'true' başlasın
  const [error, setError] = useState(null);

  // Hangi sekmenin aktif olduğunu tutan state
  const [activeTab, setActiveTab] = useState(0); // 0 = İlk sekme (Ek İsterler)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // TODO: useEffect ile /api/v1/projects/{projectId} gibi bir endpoint'ten
  // proje adını çekip başlıkta gösterebiliriz. Şimdilik bu adımı atlıyoruz.

  //! --- EKLENEN useEffect ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    // TODO: projectService'e getProjectById eklemeyi unutma
    projectService.getProjectById(projectId) 
      .then(data => setProject(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]); // Bağımlılık olarak projectId'yi ekle
  //! --- useEffect SONU ---

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)} // Tarayıcıda bir önceki sayfaya döner
            sx={{ mr: 2 }}
        >
            Geri
        </Button>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 0 }}>
          {/* Yüklenirken ID'yi, sonra proje adını göster */}
          {loading ? (
            `Proje Detayı (ID: ${projectId})`
          ) : project ? (
            `Proje: ${project.name}` // Proje adını göster
          ) : (
            `Proje Detayı (ID: ${projectId})` // Hata olursa veya veri gelmezse
          )}
        </Typography>
        {loading && <CircularProgress size={24} sx={{ ml: 2 }} />} {/* Yüklenirken spinner */}
      </Box>

      {/* Hata veya yüklenme durumu (proje ana bilgisi için) */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* Sekme (Tab) Yapısı */}
      {/* Sekmeleri sadece proje başarıyla yüklendiyse göster */}
      {!loading && project && (
        <>
          <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="Proje Detay Sekmeleri">
              <Tab label="Ek İsterler" id="project-tab-0" />
              <Tab label="Hakedişler" id="project-tab-1" />
              <Tab label="Çalışma Kayıtları" id="project-tab-2" />
            </Tabs>
          </Box>

          {/* Sekme İçerikleri */}
          <TabPanel value={activeTab} index={0}>
            {/* Placeholder Typography yerine gerçek component'i koyduk */}
            {/* ve ona 'projectId'yi prop olarak geçtik */}
            {projectId && <ProjectRequests projectId={projectId} />}
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {projectId && <ProjectPaymentPlans projectId={projectId} />}
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            {projectId && <ProjectWorkLogs projectId={projectId} />}
          </TabPanel>
        </>
      )}
    </Container>
  );
}

export default ProjectDetailPage;