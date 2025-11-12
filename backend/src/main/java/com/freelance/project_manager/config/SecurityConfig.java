package com.freelance.project_manager.config;

import com.freelance.project_manager.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// --- CORS İÇİN GEREKLİ IMPORTLAR ---
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
// --- HttpSecurity'nin cors() metodu için static import ---
import static org.springframework.security.config.Customizer.withDefaults;


@Configuration // Bu sınıfın bir Spring konfigürasyon sınıfı olduğunu belirtir.
@EnableWebSecurity // Spring Security'yi web katmanında aktif eder.
// @EnableMethodSecurity(prePostEnabled = true) // Bu satırda @EnableMethodSecurity yeterli, prePostEnabled=true varsayılanıdır
@EnableMethodSecurity // Metot seviyesinde güvenlik (@PreAuthorize vb.) için gereklidir
@RequiredArgsConstructor
public class SecurityConfig {

    // Kendi UserDetailsService'imizi buraya enjekte ediyoruz.
    private final CustomUserDetailsService customUserDetailsService;
    // JWT filtreleme mekanizmamızı buraya enjekte ediyoruz.
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt, şifreleri hash'lemek için en yaygın ve güvenli yöntemlerden biridir.
        // Her şifre için farklı bir "salt" değeri üreterek güvenliği artırır.
        return new BCryptPasswordEncoder();
    }

    /**
     * Spring Security'ye kimlik doğrulama sağlayıcımızı (provider) bildiriyoruz.
     * Bu provider, bizim UserDetailsService'imizi ve PasswordEncoder'ımızı kullanacak.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }


    /**
     * AuthenticationManager'ı (kimlik doğrulama yöneticisi)
     * Spring konteynerine bir Bean olarak ekliyoruz.
     * Login Bean'imiz buna ihtiyaç duyacak.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // --- YENİ EKLENEN CORS YAPILANDIRMA BEAN'İ ---
    /**
     * CORS (Cross-Origin Resource Sharing) ayarlarını tanımlar.
     * Frontend uygulamasının (localhost:5173) backend'e (localhost:8080)
     * güvenli bir şekilde istek atabilmesini sağlar.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Frontend'in çalıştığı adrese (origin) izin veriyoruz.
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // İzin verilen HTTP metotları
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // İzin verilen tüm başlıklar (*)
        configuration.setAllowedHeaders(List.of("*"));
        // Tarayıcının kimlik bilgileriyle (örn: token) istek göndermesine izin ver
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Bu yapılandırmayı tüm API yolları (/**) için kaydet
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    // --- CORS YAPILANDIRMA BEAN'İ SONU ---

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // --- CORS'u Aktif Et ---
                .cors(withDefaults()) // corsConfigurationSource Bean'ini kullanır

                .csrf(csrf -> csrf.disable()) // CSRF'i devre dışı bırak

                // --- YETKİLENDİRME KURALLARI (DAHA DETAYLI) ---
                .authorizeHttpRequests(auth -> auth
                        // 1. Önce TÜM 'OPTIONS' isteklerine (CORS ön kontrolü için) izin ver.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Sonra '/api/v1/auth/' altındaki POST isteklerine (login ve register için) izin ver.
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()

                        // 3. Geriye kalan TÜM diğer istekler kimlik doğrulaması gerektirsin (authenticated).
                        .anyRequest().authenticated()
                )
                // --- YETKİLENDİRME SONU ---

                // Oturum yönetimini STATELESS yap (JWT için gerekli)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Bizim kimlik doğrulama sağlayıcımızı kullan
                .authenticationProvider(authenticationProvider())

                // JWT filtremizi doğru yere ekle
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}