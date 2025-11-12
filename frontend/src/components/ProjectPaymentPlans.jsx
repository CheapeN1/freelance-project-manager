import React, { useState, useEffect, useCallback } from 'react';
import paymentPlanService from '../services/paymentPlanService';
import {
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
  Pagination,
  Box,
  Button,
  Chip, // Durumları (Status) göstermek için
  IconButton, // Taksitleri ödendi yapmak için
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCardIcon from '@mui/icons-material/AddCard';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import AddPaymentPlanModal from './AddPaymentPlanModal'; // Yeni hakediş ekleme modalı
import GenerateRecordModal from './GenerateRecordModal'; // Abonelik Faturası Modalı
import GenerateHourlyRecordModal from './GenerateHourlyRecordModal';
import { useAuth } from '../context/AuthContext'; // Admin mi diye kontrol etmek için



// Bu component, 'projectId'yi prop olarak alacak
function ProjectPaymentPlans({ projectId }) {
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const { user } = useAuth(); // Kullanıcı rolünü kontrol etmek için
  const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

  // --- Modal State'leri ---
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false); // Yeni Hakediş Modalı
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false); // Yeni Fatura Modalı
  const [isHourlyModalOpen, setIsHourlyModalOpen] = useState(false); // Saatlik Fatura Modalı
  const [selectedPlan, setSelectedPlan] = useState(null); // Hangi plana fatura ekleneceğini tutar

  const handleOpenModal = () => {
  setIsPlanModalOpen(true);  // isModalOpen yerine isPlanModalOpen
};

const handleCloseModal = () => {
  setIsPlanModalOpen(false);  // isModalOpen yerine isPlanModalOpen
};

  // Hakediş eklendikten sonra listeyi yenile
  const handlePlanAdded = () => {
    fetchPaymentPlans(0); // 0. sayfayı getir
  };

  // Hakedişleri getiren fonksiyon
  const fetchPaymentPlans = useCallback(async (currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentPlanService.getPaymentPlansByProjectId(projectId, currentPage, pageSize);
      setPaymentPlans(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Component yüklendiğinde veriyi çek
  useEffect(() => {
    fetchPaymentPlans(0);
  }, [fetchPaymentPlans]);

  // Sayfa numarası değiştiğinde
  const handlePageChange = (event, value) => {
    fetchPaymentPlans(value - 1);
  };
  
  // Taksiti "Ödendi" olarak işaretle
  const handleMarkAsPaid = async (installmentId, planStatus) => {
    // GÜVENLİK KONTROLÜ: Eğer plan zaten tamamlanmış veya iptal edilmişse işlem yapma.
    if (planStatus === 'COMPLETED' || planStatus === 'CANCELLED') {
      setError("Bu plan üzerinde işlem yapamazsınız.");
      return; 
    }
    try {
      await paymentPlanService.markInstallmentAsPaid(installmentId);
      fetchPaymentPlans(page); // Listeyi yenile
    } catch (err) {
      setError(err.message || 'Taksit güncellenemedi.');
    }
  };

  // Tek seferlik ödeme planını "Ödendi" (COMPLETED) olarak işaretle
  const handleMarkPlanAsPaid = async (planId) => {
    try {
      await paymentPlanService.markPlanAsPaid(planId);
      fetchPaymentPlans(page); // Listeyi yenile
    } catch (err) {
      setError(err.message || 'Ödeme planı güncellenemedi.');
    }
  };

  // Ödeme planını "İptal Et"
  const handleCancelPlan = async (planId) => {
    // Güvenlik için bir onay isteyelim
    if (window.confirm("Bu ödeme planını iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      try {
        await paymentPlanService.cancelPaymentPlan(planId);
        fetchPaymentPlans(page); // Listeyi yenile
      } catch (err) {
        setError(err.message || 'Ödeme planı iptal edilemedi.');
      }
    }
  };

  // --- PaymentRecord Fonksiyonları ---
  const handleOpenRecordModal = (plan) => {
    setSelectedPlan(plan);
    setIsRecordModalOpen(true);
  };

  const handleCloseRecordModal = () => {
    setIsRecordModalOpen(false);
    setSelectedPlan(null);
  };

  const handleRecordGenerated = () => {
    fetchPaymentPlans(page); // Listeyi yenile
    handleCloseRecordModal();
  };

  const handleMarkRecordPaid = async (recordId, planStatus) => {
    if (planStatus === 'COMPLETED' || planStatus === 'CANCELLED') return;
    try {
      await paymentPlanService.markPaymentRecordAsPaid(recordId);
      fetchPaymentPlans(page);
    } catch (err) {
      setError(err.message || 'Ödeme kaydı güncellenemedi.');
    }
  };


  const handleOpenHourlyModal = (plan) => {
      setSelectedPlan(plan);
      setIsHourlyModalOpen(true);
    };

    const handleCloseHourlyModal = () => {
      setIsHourlyModalOpen(false);
      setSelectedPlan(null);
    };

    const handleHourlyRecordGenerated = () => {
      fetchPaymentPlans(page); // Listeyi yenile
      handleCloseHourlyModal();
    };


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Hakedişler (Ödeme Planları)</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal} // Artık modal'ı açıyor
        >
          Yeni Hakediş Ekle
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}
      {!loading && !error && (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>Tip</TableCell>
                  <TableCell>Toplam Tutar / Aylık</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Notlar</TableCell>
                  <TableCell>Taksitler / Detaylar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Bu proje için ödeme planı bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentPlans.map((plan) => (
                    <TableRow key={plan.id} hover>
                      <TableCell>{plan.planType}</TableCell>
                      <TableCell>
                        {/* Koşulu güncelliyoruz:
                          1. Eğer tip 'SUBSCRIPTION' (Abonelik) ise, aylık tutarı göster.
                          2. Eğer tip 'HOURLY' (Saatlik) ise, saatlik ücreti (hourlyRate) göster.
                          3. Diğer durumlarda (ONE_TIME, INSTALLMENT) toplam tutarı (totalAmount) göster.
                        */}
                        {plan.planType === 'SUBSCRIPTION'
                          ? `${plan.recurringAmount} TL (Aylık)`
                          : plan.planType === 'HOURLY'
                            ? `${plan.hourlyRate} TL (Saatlik)`
                            : `${plan.totalAmount} TL`}
                      </TableCell>
                      <TableCell>
                        <Chip label={plan.status} color={plan.status === 'COMPLETED' ? 'success' : (plan.status === 'ACTIVE' ? 'primary' : 'default')} size="small" />
                      </TableCell>
                      <TableCell>{plan.notes || '-'}</TableCell>
                      <TableCell>
                        {/* --- KOŞUL 1: EĞER PLAN TAKSİTLİ İSE --- */}
                        {plan.planType === 'INSTALLMENT' && (
                          <Box>
                            {plan.installments.map(inst => (
                              <Box key={inst.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                {inst.paid ? (
                                  <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 1 }} />
                                ) : (
                                  <AccessTimeIcon color="disabled" sx={{ fontSize: 16, mr: 1 }} />
                                )}
                                <Typography variant="body2" sx={{ mr: 1, textDecoration: inst.paid ? 'line-through' : 'none' }}>
                                  {inst.amount} TL - Vade: {inst.dueDate}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {/* Koşul 2: Abonelik VEYA Saatlik Plan (Faturaları listeler) */}
                        {(plan.planType === 'SUBSCRIPTION' || plan.planType === 'HOURLY') && plan.paymentRecords.map(rec => (
                          <Box key={rec.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                            {rec.status === 'PAID' ? <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 1 }} /> : <AccessTimeIcon color="disabled" sx={{ fontSize: 16, mr: 1 }} />}
                            <Typography variant="body2" sx={{ mr: 1, textDecoration: rec.status === 'PAID' ? 'line-through' : 'none' }}>
                              {rec.amount} TL - {rec.notes || rec.issueDate} (Vade: {rec.dueDate})
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                      {/* --- İŞLEMLER SÜTUNU (TÜM EYLEMLER BURADA) --- */}
                      <TableCell align="center">
                        {/* Sadece Admin ve plan "canlı" ise (COMPLETED veya CANCELLED değilse) eylem gösterebilir */}
                        {isAdmin && plan.status !== 'COMPLETED' && plan.status !== 'CANCELLED' && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            
                            {/* Tek Seferlik Ödeme Butonu */}
                            {plan.planType === 'ONE_TIME' && plan.status === 'PENDING' && (
                              <Tooltip title="Planı Ödendi Olarak İşaretle">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() => handleMarkPlanAsPaid(plan.id)}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Taksit Ödeme Butonları */}
                            {plan.planType === 'INSTALLMENT' && (
                              // Ödenmemiş ilk taksiti bul ve onun için bir buton göster
                              // (Daha basit: Ödenmemiş tüm taksitler için buton göster)
                              plan.installments.filter(inst => !inst.paid).map(unpaidInst => (
                                <Tooltip key={unpaidInst.id} title={`${unpaidInst.amount} TL Taksiti Öde`}>
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => handleMarkAsPaid(unpaidInst.id, plan.status)} // Fonksiyona planın durumunu da yolla
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                              ))
                            )}

                            {/* Abonelik Faturası Oluştur */}
                            {plan.planType === 'SUBSCRIPTION' && (
                              <Tooltip title="Aylık Fatura Oluştur">
                                <IconButton color="primary" size="small" onClick={() => handleOpenRecordModal(plan)}>
                                  <AddCardIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Abonelik Faturası Öde */}
                            {plan.planType === 'SUBSCRIPTION' &&
                              plan.paymentRecords.filter(rec => rec.status === 'UNPAID').map(unpaidRec => (
                                <Tooltip key={unpaidRec.id} title={`${unpaidRec.amount} TL Faturayı Öde`}>
                                  <IconButton color="success" size="small" onClick={() => handleMarkRecordPaid(unpaidRec.id, plan.status)}>
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                              ))
                            }

                            {plan.planType === 'HOURLY' && (
                              <Tooltip title="Saatlik Çalışma Faturası Oluştur">
                                <IconButton color="primary" size="small" onClick={() => handleOpenHourlyModal(plan)}>
                                  <QueryBuilderIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Saatlik Fatura Öde */}
                            {plan.planType === 'HOURLY' &&
                              plan.paymentRecords.filter(rec => rec.status === 'UNPAID').map(unpaidRec => (
                                <Tooltip key={unpaidRec.id} title={`${unpaidRec.amount} TL Faturayı Öde (${unpaidRec.notes})`}>
                                  <IconButton color="success" size="small" onClick={() => handleMarkRecordPaid(unpaidRec.id, plan.status)}>
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                              ))
                            }

                            {/* İptal Et Butonu */}
                            <Tooltip title="Planı İptal Et">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleCancelPlan(plan.id)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                        
                        {/* Plan tamamlanmış veya iptal edilmişse metin göster */}
                        {plan.status === 'COMPLETED' && (
                           <Typography variant="caption" color="success.main">Tamamlandı</Typography>
                        )}
                        {plan.status === 'CANCELLED' && (
                           <Typography variant="caption" color="error">İptal Edildi</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Sayfalama Kontrolü */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
      
      <AddPaymentPlanModal
        open={isPlanModalOpen}
        handleClose={() => setIsPlanModalOpen(false)}
        onPlanAdded={() => fetchPaymentPlans(0)}
        projectId={projectId}
      />

      {selectedPlan && (
        <GenerateRecordModal
          open={isRecordModalOpen}
          handleClose={handleCloseRecordModal}
          onRecordGenerated={handleRecordGenerated}
          paymentPlan={selectedPlan}
        />
      )}

      {selectedPlan && isHourlyModalOpen && (
        <GenerateHourlyRecordModal
          open={isHourlyModalOpen}
          handleClose={handleCloseHourlyModal}
          onRecordGenerated={handleHourlyRecordGenerated} // Aynı "generated" fonksiyonunu kullanabiliriz
          paymentPlan={selectedPlan}
        />
      )}
    </Box>
  );
}

export default ProjectPaymentPlans;