import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

/**
 * Belirli bir projeye ait ödeme planlarını sayfalı olarak getirir.
 * @param {number} projectId Proje ID'si
 * @param {number} page Sayfa numarası
 * @param {number} size Sayfa boyutu
 * @returns {Promise<object>} Spring Page nesnesi
 */
const getPaymentPlansByProjectId = async (projectId, page = 0, size = 5, sort = 'id,desc') => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/payment-plans`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Get Payment Plans API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Ödeme planları getirilirken bir hata oluştu.');
  }
};

/**
 * Belirli bir projeye yeni bir ödeme planı oluşturur.
 * @param {number} projectId Proje ID'si
 * @param {object} planData Yeni ödeme planı verileri
 * @returns {Promise<object>} Oluşturulan ödeme planı DTO'su
 */
const createPaymentPlan = async (projectId, planData) => {
  try {
    const response = await axios.post(`${API_URL}/projects/${projectId}/payment-plans`, planData);
    return response.data;
  } catch (error) {
    console.error("Create Payment Plan API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Ödeme planı oluşturulurken bir hata oluştu.');
  }
};

/**
 * Bir taksiti "Ödendi" olarak işaretler (Sadece Admin).
 * @param {number} installmentId Taksit ID'si
 * @returns {Promise<object>} Güncellenen taksit DTO'su
 */
const markInstallmentAsPaid = async (installmentId) => {
  try {
    const response = await axios.patch(`${API_URL}/installments/${installmentId}/mark-paid`);
    return response.data;
  } catch (error) {
    console.error("Mark Installment Paid API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Taksit güncellenirken bir hata oluştu.');
  }
};


/**
 * Tek seferlik bir ödeme planını "Ödendi" (COMPLETED) olarak işaretler (Sadece Admin).
 * @param {number} planId Ödeme Planı ID'si
 * @returns {Promise<object>} Güncellenen ödeme planı DTO'su
 */
const markPlanAsPaid = async (planId) => {
  try {
    const response = await axios.patch(`${API_URL}/payment-plans/${planId}/mark-paid`);
    return response.data;
  } catch (error) {
    console.error("Mark Plan As Paid API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Ödeme planı güncellenirken bir hata oluştu.');
  }
};

/**
 * Bir ödeme planını "İptal Edildi" (CANCELLED) olarak işaretler (Sadece Admin).
 * @param {number} planId Ödeme Planı ID'si
 * @returns {Promise<object>} Güncellenen ödeme planı DTO'su
 */
const cancelPaymentPlan = async (planId) => {
  try {
    const response = await axios.patch(`${API_URL}/payment-plans/${planId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Cancel Plan API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Ödeme planı iptal edilirken bir hata oluştu.');
  }
};

/**
 * Bir ABONELİK planı için yeni bir aylık fatura (PaymentRecord) oluşturur.
 * @param {number} planId Ana ödeme planının ID'si
 * @param {object} recordDetails Fatura detayları (notes, issueDate, dueDate)
 * @returns {Promise<object>} Oluşturulan ödeme kaydı DTO'su
 */
const generateSubscriptionRecord = async (planId, recordDetails) => {
  try {
    const response = await axios.post(`${API_URL}/payment-plans/${planId}/records`, recordDetails);
    return response.data;
  } catch (error) {
    console.error("Generate Subscription Record API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Abonelik kaydı oluşturulurken bir hata oluştu.');
  }
};

/**
 * Bir ödeme kaydını (PaymentRecord) "Ödendi" olarak işaretler.
 * @param {number} recordId Ödeme kaydı ID'si
 * @returns {Promise<object>} Güncellenen ödeme kaydı DTO'su
 */
const markPaymentRecordAsPaid = async (recordId) => {
  try {
    const response = await axios.patch(`${API_URL}/payment-records/${recordId}/mark-paid`);
    return response.data;
  } catch (error) {
    console.error("Mark Payment Record Paid API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Ödeme kaydı güncellenirken bir hata oluştu.');
  }
};

/**
 * Bir SAATLİK plan için, çalışılan saatlere göre yeni bir fatura (PaymentRecord) oluşturur.
 * @param {number} planId Ana ödeme planının ID'si
 * @param {object} recordDetails { startDate, endDate, notes }
 * @returns {Promise<object>} Oluşturulan ödeme kaydı DTO'su
 */
const generateHourlyRecord = async (planId, recordDetails) => {
  try {
    // Backend'de oluşturduğumuz yeni endpoint'i çağırıyoruz
    const response = await axios.post(`${API_URL}/payment-plans/${planId}/generate-hourly-record`, recordDetails);
    return response.data;
  } catch (error) {
    console.error("Generate Hourly Record API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Saatlik fatura oluşturulurken bir hata oluştu.');
  }
};

const paymentPlanService = {
  getPaymentPlansByProjectId,
  createPaymentPlan,
  markInstallmentAsPaid,
  markPlanAsPaid,
  cancelPaymentPlan,
  generateSubscriptionRecord,
  markPaymentRecordAsPaid,
  generateHourlyRecord,
};

export default paymentPlanService;