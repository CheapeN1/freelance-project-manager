import axios from 'axios';

// Proje API endpoint'lerinin temel URL'si
const API_URL = 'http://3.234.236.12:8080/api/v1/projects';
const CUSTOMER_API_URL = 'http://3.234.236.12:8080/api/v1/customers';

/**
 * Backend'den tüm "Hazır Proje Şablonlarını" getirir.
 * Şablon sayısı çok fazla olmayacağı için şimdilik sayfalama (paging) eklemeyebiliriz.
 * Gerekirse daha sonra eklenebilir.
 * @returns {Promise<Array>} Başarılı olursa proje şablonu DTO'ları listesini döner.
 */
const getProjectTemplates = async () => {
  try {
    // Interceptor'ımız token'ı otomatik ekleyecek
    const response = await axios.get(`${API_URL}/templates`);
    return response.data; // Dönen veri bir liste olmalı (Page nesnesi değil)
  } catch (error) {
    console.error("Get Project Templates API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Proje şablonları getirilirken bir hata oluştu.');
  }
};

/**
 * Backend'e yeni bir proje şablonu ekleme isteği atar.
 * @param {object} templateData - { name: '...', description: '...' }
 * @returns {Promise<object>} Başarılı olursa oluşturulan şablon DTO'sunu döner.
 */
const createProjectTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${API_URL}/templates`, templateData);
    return response.data;
  } catch (error) {
    console.error("Create Project Template API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Proje şablonu oluşturulurken bir hata oluştu.');
  }
};

/**
 * Belirli bir müşteriye ait projeleri sayfalı olarak getirir.
 */
const getProjectsByCustomer = async (customerId, page = 0, size = 10) => {
  try {
    // Backend'de /api/v1/customers/{customerId}/projects endpoint'ini oluşturmuştuk
    const response = await axios.get(`${CUSTOMER_API_URL}/${customerId}/projects`, {
      params: { page, size, sort: 'id,desc' }
    });
    return response.data;
  } catch (error) {
    console.error("Get Projects by Customer API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Müşteri projeleri getirilirken hata oluştu.');
  }
};

/**
 * Bir proje şablonunu bir müşteriye atar (kopyalar).
 */
const assignProjectToCustomer = async (templateId, customerId) => {
  try {
    const response = await axios.post(
      `${API_URL}/assign`,
      null,
      { params: { templateId, customerId } }
    );
    return response.data;
  } catch (error) {
    console.error("Assign Project API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Proje atanırken bir hata oluştu.');
  }
};

/**
 * Tek bir projenin detaylarını ID ile getirir.
 * @param {number} projectId Proje ID'si
 * @returns {Promise<object>} Proje DTO'su
 */
const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Get Project By ID API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Proje detayları getirilirken bir hata oluştu.');
  }
};

const projectService = {
  getProjectTemplates,
  createProjectTemplate,
  getProjectsByCustomer,
  assignProjectToCustomer,
  getProjectById,
};

export default projectService;