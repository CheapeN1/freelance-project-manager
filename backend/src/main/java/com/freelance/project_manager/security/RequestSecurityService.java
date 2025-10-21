package com.freelance.project_manager.security;

import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.AdditionalRequestRepository;
import com.freelance.project_manager.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


@Component("requestSecurityService") // Spring'de bu bean'e 'requestSecurityService' adıyla erişeceğiz
@RequiredArgsConstructor
public class RequestSecurityService {

    private final AdditionalRequestRepository requestRepository;
    private final UserRepository userRepository;

    /**
     * Giriş yapmış kullanıcının, verilen 'requestId'ye sahip olan isterin
     * projesinin sahibi olup olmadığını kontrol eder.
     */

    public boolean isRequestOwner(Authentication authentication, Long requestId) {
        // 1. İsteri veritabanından bul.
        AdditionalRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("İster bulunamadı: " + requestId));

        // 2. İsterin projesinin sahibi olan 'Customer'ın ID'sini al.
        Long projectCustomerId = request.getProject().getCustomer().getId();

        // 3. Giriş yapmış kullanıcının 'username' (e-posta) bilgisini al.
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        // 4. Kullanıcı bulunamazsa veya bir müşteriye bağlı değilse, yetkisi yoktur.
        if (user == null || user.getCustomer() == null) {
            return false;
        }

        // 5. Kullanıcının müşteri ID'si, isterin projesinin müşteri ID'sine eşit mi?
        return user.getCustomer().getId().equals(projectCustomerId);
    }
}