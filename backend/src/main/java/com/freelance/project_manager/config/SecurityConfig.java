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

@Configuration // Bu sınıfın bir Spring konfigürasyon sınıfı olduğunu belirtir.
@EnableWebSecurity // Spring Security'yi web katmanında aktif eder.
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    // YENİ ALAN: Kendi UserDetailsService'imizi buraya enjekte ediyoruz.
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt, şifreleri hash'lemek için en yaygın ve güvenli yöntemlerden biridir.
        // Her şifre için farklı bir "salt" değeri üreterek güvenliği artırır.
        return new BCryptPasswordEncoder();
    }

    // --- YENİ EKLENECEK BEAN ---
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


    // --- YENİ EKLENECEK BEAN ---
    /**
     * AuthenticationManager'ı (kimlik doğrulama yöneticisi)
     * Spring konteynerine bir Bean olarak ekliyoruz.
     * Login Bean'imiz buna ihtiyaç duyacak.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF'i devre dışı bırak
                .authorizeHttpRequests(auth -> auth
                        // 1. Kayıt ve Giriş endpoint'lerine izinsiz erişime izin ver.
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // 2. Geriye kalan TÜM istekler kimlik doğrulaması gerektirsin.
                        .anyRequest().authenticated()
                )
                // 3. Oturum yönetimini STATELESS (durumsuz) yap.
                //    REST API'ler oturum tutmaz (Session kullanmaz). Her istek JWT ile doğrulanır.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Bizim kimlik doğrulama sağlayıcımızı kullan.
                .authenticationProvider(authenticationProvider())

                // 5. Bizim JWT filtremizi, standart filtreden (UsernamePasswordAuthenticationFilter)
                //    HEMEN ÖNCE çalışacak şekilde zincire ekle.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}