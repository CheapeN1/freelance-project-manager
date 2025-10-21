package com.freelance.project_manager.security;

import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.ProjectRepository;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("projectSecurityService") // Bu bean'e Spring'de 'projectSecurityService' adıyla erişeceğiz.
@RequiredArgsConstructor
public class ProjectSecurityService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Bu metot, giriş yapmış kullanıcının, verilen projectId'li projenin
     * sahibi olan müşteriye ait olup olmadığını kontrol eder.
     */
    public boolean isProjectOwner(Authentication authentication, Long projectId) {
        // 1. Giriş yapmış kullanıcının 'username' (e-posta) bilgisini al.
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElse(null);

        // 2. Kullanıcı bulunamazsa veya bir müşteriye bağlı değilse, yetkisi yoktur.
        if (user == null || user.getCustomer() == null) {
            return false;
        }

        // 3. Projeyi veritabanından bul.
        Project project = projectRepository.findById(projectId)
                .orElse(null);

        // 4. Proje bulunamazsa veya bir müşteriye bağlı değilse, yetki veremeyiz.
        if (project == null || project.getCustomer() == null) {
            return false;
        }

        // 5. Kullanıcının müşteri ID'si, projenin müşteri ID'sine eşit mi?
        //    Eşitse 'true' döner (Yetkisi var), eşit değilse 'false' (Yetkisi yok).
        return user.getCustomer().getId().equals(project.getCustomer().getId());
    }
}