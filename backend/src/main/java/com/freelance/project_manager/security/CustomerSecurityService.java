package com.freelance.project_manager.security;

import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("customerSecurityService") // Bean'in adı SpEL'deki (@customerSecurityService) ile eşleşmeli
@RequiredArgsConstructor
public class CustomerSecurityService {

    private final UserRepository userRepository;

    /**
     * Giriş yapmış kullanıcının, talep edilen 'customerId' ile
     * aynı 'customerId'ye sahip olup olmadığını kontrol eder.
     */
    @Transactional(readOnly = true) // Veritabanından 'User' çekeceğimiz için transaction başlatalım
    public boolean isOwner(Authentication authentication, Long customerId) {
        // 1. Giriş yapmış kullanıcının 'username' (e-posta) bilgisini al.
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        // 2. Kullanıcı bulunamazsa veya bir müşteriye bağlı değilse, yetkisi yoktur.
        if (user == null || user.getCustomer() == null) {
            return false;
        }

        // 3. Kullanıcının kendi müşteri ID'si, talep edilen müşteri ID'sine eşit mi?
        return user.getCustomer().getId().equals(customerId);
    }
}