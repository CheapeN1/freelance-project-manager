package com.freelance.project_manager.bean.auth;

import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.service.CustomUserDetailsService;
import com.freelance.project_manager.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoginBean {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthResponseDto login(AuthRequestDto request) {
        // 1. Spring Security'nin 'AuthenticationManager'ı ile kimlik doğrulama yap.
        // Bu metot, arka planda bizim 'CustomUserDetailsService'imizi ve 'PasswordEncoder'ımızı kullanır.
        // Eğer şifre veya kullanıcı adı yanlışsa, burada bir 'BadCredentialsException' fırlatılır
        // ve metot 401 Unauthorized hatasıyla otomatik olarak durur.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        // 2. Kimlik doğrulama başarılıysa, kullanıcı 'UserDetails'ini tekrar al
        // (Token'a koymak için taze ve doğru bilgilere ihtiyacımız var).
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // 3. JwtUtil'i kullanarak bu kullanıcı için bir token üret.
        // 'generateToken' metodunu İLK KEZ burada kullanıyoruz!
        final String token = jwtUtil.generateToken(userDetails);

        // 4. Token'ı ve kullanıcı adını DTO ile geri döndür.
        return AuthResponseDto.builder()
                .token(token)
                .username(userDetails.getUsername())
                .build();
    }
}