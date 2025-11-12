import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // Login servisimizi kullanacağız
import axios from 'axios'; // Axios'u global olarak yapılandırmak için

// 1. Context'i oluştur
const AuthContext = createContext(null);

// 2. Provider Component'i oluştur (Bu component tüm uygulamayı saracak)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Token'ı state'te tut ve başlangıçta localStorage'dan al
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); // Kullanıcı bilgisini (username vb.) state'te tut
  const [loading, setLoading] = useState(true); // Başlangıçta durumu kontrol etmek için loading state'i

  // --- Axios Interceptor Ayarı ---
  // Uygulama yüklendiğinde veya token değiştiğinde çalışır.
  useEffect(() => {
    if (token) {
      // Eğer token varsa, tüm Axios isteklerinin Authorization header'ına otomatik ekle
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token); // Token'ı localStorage'a kaydet
    } else {
      // Eğer token yoksa, header'ı temizle ve localStorage'dan sil
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // --- Kullanıcı Bilgisini Saklama ---
  useEffect(() => {
    // Bu, localStorage'a NE YAZILDIĞINI bize gösterecek
    console.log("AuthContext useEffect [user]: localStorage'a yazılan user objesi:", user); 
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
  }, [user]);

   // --- Başlangıç Kontrolü ---
   // Uygulama ilk yüklendiğinde token'ın geçerliliğini kontrol et (opsiyonel ama iyi bir pratik)
   useEffect(() => {
      // Burada backend'e token ile bir "/validate" veya "/me" endpoint'i çağrısı yapılıp
      // token'ın hala geçerli olup olmadığı kontrol edilebilir.
      // Şimdilik bu adımı atlayıp sadece localStorage'daki token'a güveniyoruz.
      setLoading(false); // Kontrol bitti, yükleniyor durumunu kapat
   }, []);


  // --- LOGIN FONKSİYONU ---
  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      // Bu, API'den TAM OLARAK ne geldiğini bize gösterecek
      console.log("AuthContext login fonksiyonu: API'den gelen data:", data); 
      
      setToken(data.token); // Gelen token'ı state'e ata (bu useEffect'i tetikler)
      // Gelen 'roles' bilgisini de state'e kaydet
      setUser({ 
          token: data.token,
          username: data.username, 
          roles: data.roles, 
          customerId: data.customerId 
      });
      // Yönlendirme LoginPage'de yapılacak
    } catch (error) {
      console.error("AuthContext login error:", error);
      // Hatanın LoginPage'de yakalanması için tekrar fırlat
      throw error;
    }
  };

  // --- LOGOUT FONKSİYONU ---
  const logout = () => {
    setToken(null); // Token'ı state'ten sil (bu useEffect'i tetikler)
    setUser(null); // Kullanıcı bilgisini state'ten sil
    // localStorage temizliği useEffect içinde otomatik yapılacak
    // Yönlendirme (örn: /login'e) logout'u çağıran yerde yapılabilir.
  };

  const register = async (fullName, email, password) => {
    try {
      // Backend'deki register endpoint'ini çağırıyoruz.
      // authService.register fonksiyonunun backend'e 
      // { fullName, email, password } objesini göndermesi beklenir.
      const response = await authService.register({ fullName, email, password });
      
      // Başarılı olursa, response'u döndür (veya bir şey yapma).
      // RegisterPage.jsx zaten kullanıcıyı /login'e yönlendirecek.
      return response;

    } catch (err) {
      // Eğer backend'den bir hata (örn: "Email zaten kullanılıyor") gelirse,
      // bu hatayı RegisterPage.jsx'in yakalayıp göstermesi için fırlatıyoruz.
      throw err;
    }
  };

  // Context'in diğer component'lere sağlayacağı değerler
  const value = {
    token,
    user,
    isAuthenticated: !!token, // Token varsa kullanıcı giriş yapmış demektir
    loading, // Başlangıç yükleme durumu
    login,
    logout,
    register,
  };

  // Provider'ı ve sağladığı değeri döndür
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Context'i kolayca kullanmak için özel bir Hook oluştur
export const useAuth = () => {
  return useContext(AuthContext);
};