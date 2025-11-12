import axios from 'axios';

// Backend API'mizin temel URL'si.
// Vite, geliştirme sırasında proxy ayarı yapmamıza izin verir,
// bu sayede CORS sorunları yaşamayız (bunu daha sonra ayarlayacağız).
// Şimdilik doğrudan backend adresini yazalım.
const API_URL = 'http://localhost:8080/api/v1/auth';

/**
 * Kullanıcı adı ve şifre ile backend'e login isteği atar.
 * Başarılı olursa { token, username } içeren bir nesne döner.
 * Başarısız olursa hata fırlatır.
 */
const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + '/login', {
      username: username,
      password: password,
    });
    // API'den dönen veriyi (AuthResponseDto) döndür
    return response.data; 
  } catch (error) {
    // Axios hatasını daha anlaşılır hale getirip tekrar fırlatabiliriz
    console.error("Login API error:", error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Giriş işlemi sırasında bir hata oluştu.');
  }
};


// Servis fonksiyonlarımızı export edelim
const authService = {
  login,
};

export default authService;