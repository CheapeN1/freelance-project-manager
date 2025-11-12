import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext'; // Rolleri kontrol etmek için
import projectService from '../services/projectService'; // Proje adını almak için

// Not: Bu alt component'leri de oluşturmamız gerekecek (Admin'dekilerin 'read-only' versiyonları)
import CustomerProjectRequests from '../components/CustomerProjectRequests';
import CustomerProjectPaymentPlans from '../components/CustomerProjectPaymentPlans';
import CustomerProjectWorkLogs from '../components/CustomerProjectWorkLogs';

// Sekme panellerini göstermek için yardımcı component (ProjectDetailPage'den kopyalayabiliriz)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
    </div>
  );
}

function CustomerProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Rol kontrolü için

  // --- ROL KONTROLÜ ---
  const isOwner = user?.roles?.includes('ROLE_CUSTOMER_OWNER');
  const isAccountant = user?.roles?.includes('ROLE_CUSTOMER_ACCOUNTANT');

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(isOwner ? 0 : 1); // Muhasebeci ise Hakedişler'den başla

  // Proje adını çek
  useEffect(() => {
    setLoading(true);
    setError(null);
    projectService.getProjectById(projectId)
      .then(data => setProject(data))
      .catch(err => setError(err.message)) // Backend güvenliği (isOwner) zaten koruyor
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customer/dashboard')} // Müşteri dashboard'una dön
            sx={{ mr: 2 }}
        >
            Geri
        </Button>
        <Typography variant="h4" gutterBottom component="div">
          Proje: {project?.name}
        </Typography>
      </Box>

      {/* --- ROL BAZLI SEKMELER --- */}
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {isOwner && <Tab label="Ek İsterler" id="tab-0" />} 
          {(isOwner || isAccountant) && <Tab label="Hakedişler" id="tab-1" />}
          {isOwner && <Tab label="Çalışma Kayıtları" id="tab-2" />}
        </Tabs>
      </Box>

      {/* Sekme İçerikleri */}
      {isOwner && (
        <TabPanel value={activeTab} index={0}>
           <CustomerProjectRequests projectId={projectId} /> 
        </TabPanel>
      )}
      {(isOwner || isAccountant) && (
        <TabPanel value={activeTab} index={isOwner ? 1 : 0}> {/* Muhasebeci için index 0 olur */}
           <CustomerProjectPaymentPlans projectId={projectId} /> 
        </TabPanel>
      )}
      {isOwner && (
        <TabPanel value={activeTab} index={isOwner ? 2 : -1}> {/* Muhasebeci için bu index'e ulaşılamaz */}
          <CustomerProjectWorkLogs projectId={projectId} />
        </TabPanel>
      )}

    </Container>
  );
}

export default CustomerProjectDetailPage;