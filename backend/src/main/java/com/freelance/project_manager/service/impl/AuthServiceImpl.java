package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.auth.CreateUserAndCustomerBean;
import com.freelance.project_manager.bean.auth.LoginBean;
import com.freelance.project_manager.bean.auth.ValidateRegistrationBean;
import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.dto.RegistrationRequestDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.mapper.UserMapper;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final ValidateRegistrationBean validateRegistrationBean;
    private final CreateUserAndCustomerBean createUserAndCustomerBean;
    private final LoginBean loginBean; // YENİ ENJEKSİYON
    private final UserMapper userMapper;

    @Override
    @Transactional // Bu çok önemli! Eğer User oluşturulurken bir hata olursa,
    // oluşturulan Customer'ın da geri alınmasını (rollback) sağlar.
    // Bütün işlemin tek bir atomik parça olmasını garanti eder.
    public UserDto registerNewCustomer(RegistrationRequestDto request) {
        // 1. Adım: Validasyon yap.
        validateRegistrationBean.validate(request);

        // 2. Adım: Kullanıcı ve Müşteri oluşturma işini ilgili bean'e devret.
        User newUser = createUserAndCustomerBean.create(request);

        // 3. Adım: Sonucu DTO'ya çevir ve geri döndür.
        return userMapper.toDto(newUser);
    }

    // --- YENİ EKLENEN METOT ---
    @Override
    public AuthResponseDto login(AuthRequestDto request) {
        // Tüm işi 'LoginBean'e devrediyoruz.
        return loginBean.login(request);
    }
}