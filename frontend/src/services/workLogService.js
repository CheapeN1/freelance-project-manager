import axios from 'axios';

const API_URL = 'http://3.234.236.12:8080/api/v1';

/**
 * Belirli bir İSTERE ait çalışma kayıtlarını sayfalı olarak getirir.
 * @param {number} requestId İster ID'si
 * @param {number} page Sayfa numarası
 * @param {number} size Sayfa boyutu
 * @returns {Promise<object>} Spring Page nesnesi
 */
const getWorkLogsByRequestId = async (requestId, page = 0, size = 5, sort = 'date,desc') => {
  try {
    const response = await axios.get(`${API_URL}/requests/${requestId}/worklogs`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Get WorkLogs by Request API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Çalışma kayıtları getirilirken bir hata oluştu.');
  }
};

/**
 * Belirli bir İSTERE yeni bir çalışma kaydı oluşturur.
 * @param {number} requestId İster ID'si
 * @param {object} workLogData Yeni çalışma kaydı verileri
 * @returns {Promise<object>} Oluşturulan çalışma kaydı DTO'su
 */
const createWorkLog = async (requestId, workLogData) => {
  try {
    const response = await axios.post(`${API_URL}/requests/${requestId}/worklogs`, workLogData);
    return response.data;
  } catch (error) {
    console.error("Create WorkLog API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Çalışma kaydı oluşturulurken bir hata oluştu.');
  }
};

/**
 * Belirli bir PROJEYE ait TÜM çalışma kayıtlarını sayfalı olarak getirir (Raporlama için).
 * @param {number} projectId Proje ID'si
 * @param {number} page Sayfa numarası
 * @param {number} size Sayfa boyutu
 * @returns {Promise<object>} Spring Page nesnesi
 */
const getWorkLogsByProjectId = async (projectId, page = 0, size = 20, sort = 'date,desc') => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/worklogs`, {
      params: { page, size, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Get WorkLogs by Project API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Proje çalışma kayıtları getirilirken bir hata oluştu.');
  }
};


const workLogService = {
  getWorkLogsByRequestId,
  createWorkLog,
  getWorkLogsByProjectId, // <-- YENİ EKLENEN EXPORT
};

export default workLogService;