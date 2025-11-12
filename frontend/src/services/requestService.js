import axios from 'axios';

// Ek İsterler API endpoint'lerinin temel URL'si
const API_URL = 'http://localhost:8080/api/v1';

/**
 * Belirli bir projeye ait ek isterleri sayfalı olarak getirir.
 * @param {number} projectId Proje ID'si
 * @param {number} page Sayfa numarası (0'dan başlar)
 * @param {number} size Sayfa boyutu
 * @returns {Promise<object>} Spring Page nesnesi ({ content: [], ... })
 */
const getRequestsByProjectId = async (projectId, page = 0, size = 5, sort = 'requestDate,desc') => {
  try {
    const response = await axios.get(`${API_URL}/projects/${projectId}/requests`, {
      params: {
        page,
        size,
        sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get Requests API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'İsterler getirilirken bir hata oluştu.');
  }
};

/**
 * Belirli bir projeye yeni bir ek ister oluşturur.
 * @param {number} projectId Proje ID'si
 * @param {object} requestData Yeni isterin verileri
 * @returns {Promise<object>} Oluşturulan isterin DTO'su
 */
const createRequest = async (projectId, requestData) => {
  try {
    const response = await axios.post(`${API_URL}/projects/${projectId}/requests`, requestData);
    return response.data;
  } catch (error) {
    console.error("Create Request API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'İster oluşturulurken bir hata oluştu.');
  }
};

const requestService = {
  getRequestsByProjectId,
  createRequest,
};

export default requestService;