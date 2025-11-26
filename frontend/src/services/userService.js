import axios from 'axios';

const API_URL = 'http://3.234.236.12:8080/api/v1/users';

// Yeni kullanıcıyı mevcut bir müşteriye ekle
const addUserToCustomer = async (userData) => {
  // userData şunları içermeli: { username, password, customerId, roleName }
  try {
    const response = await axios.post(`${API_URL}/add`, userData);
    return response.data;
  } catch (error) {
    console.error("Add User API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Kullanıcı eklenirken bir hata oluştu.');
  }
};

const userService = {
  addUserToCustomer,
};

export default userService;