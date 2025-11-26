import axios from 'axios';

const API_URL = 'http://3.234.236.12:8080/api/dashboard';

const getStats = async () => {
  // 1. LocalStorage'dan ham stringi al
  const storedUser = localStorage.getItem('user');
  
  console.log("1. LocalStorage'dan gelen ham veri:", storedUser);

  if (!storedUser) {
    throw new Error("LocalStorage boş! Lütfen giriş yapın.");
  }

  // 2. JSON'a çevir
  const userObj = JSON.parse(storedUser);
  
  console.log("2. Parse edilmiş user objesi:", userObj);

  // 3. Token'ı doğru yerden almaya çalış (İhtimal 1: userObj.token, İhtimal 2: userObj.accessToken)
  // Login işleminde backend'den dönen JSON yapısına göre burası değişir.
  const token = userObj.token || userObj.accessToken || userObj.jwt;

  console.log("3. Backend'e gönderilecek Token:", token);

  if (!token) {
    throw new Error("Token bulunamadı! Obje yapısını kontrol edin.");
  }

  const response = await axios.get(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const dashboardService = {
  getStats,
};

export default dashboardService;