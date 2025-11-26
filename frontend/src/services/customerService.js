import axios from 'axios';

// Müşteri API endpoint'lerinin temel URL'si
const API_URL = 'http://3.234.236.12:8080/api/v1/customers';

/**
 * Backend'den müşterileri sayfalı olarak getirir.
 * @param {number} page - İstenen sayfa numarası (0'dan başlar).
 * @param {number} size - Sayfa başına kayıt sayısı.
 * @param {string} sort - Sıralama kriteri (örn: "name,asc" veya "id,desc").
 * @returns {Promise<object>} Başarılı olursa Spring Page nesnesini ({ content: [], totalElements: ..., ... }) döner.
 */
const getCustomers = async (page = 0, size = 10, sort = 'id,asc') => {
  try {
    // Axios GET isteği atıyoruz. Parametreleri 'params' objesi içinde gönderiyoruz.
    // Axios interceptor'ımız (AuthContext'te tanımlandı) Authorization header'ını otomatik ekleyecek.
    const response = await axios.get(API_URL, {
      params: {
        page: page,
        size: size,
        sort: sort,
      },
    });
    // API'den dönen Page nesnesini döndür
    return response.data;
  } catch (error) {
    console.error("Get Customers API error:", error.response ? error.response.data : error.message);
    // Hata durumunda frontend'e bilgi vermek için hatayı tekrar fırlat
    throw new Error(error.response?.data?.message || 'Müşteriler getirilirken bir hata oluştu.');
  }
};

/**
 * Backend'e yeni bir müşteri ekleme isteği atar.
 * @param {object} customerData - Yeni müşterinin bilgileri (örn: { name: '...', email: '...' }).
 * @returns {Promise<object>} Başarılı olursa oluşturulan müşterinin DTO'sunu döner.
 */
const createCustomer = async (customerData) => {
  try {
    // Axios POST isteği atıyoruz. Gövdede (body) müşteri verisini gönderiyoruz.
    const response = await axios.post(API_URL, customerData);
    return response.data;
  } catch (error) {
    console.error("Create Customer API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Müşteri oluşturulurken bir hata oluştu.');
  }
};

// Servis fonksiyonlarımızı export edelim
const customerService = {
  getCustomers,
  createCustomer,
  // İleride buraya getCustomerById, updateCustomer, deleteCustomer gibi fonksiyonlar eklenebilir.
};

export default customerService;