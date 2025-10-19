package com.freelance.project_manager.bean.auth;

import com.freelance.project_manager.dto.RegistrationRequestDto;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidateRegistrationBean {

    private final UserRepository userRepository;

    public void validate(RegistrationRequestDto request) {
        // Kullanıcı adı (e-posta) veritabanında mevcutsa, bir hata fırlat.
        userRepository.findByUsername(request.getUsername())
                .ifPresent(user -> {
                    throw new IllegalStateException("Bu e-posta adresi zaten kullanılıyor.");
                });

        // Gelecekte buraya şifre karmaşıklığı, e-posta formatı gibi başka kontroller de eklenebilir.
    }
}
