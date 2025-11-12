package com.freelance.project_manager.bean.project;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.mapper.ProjectMapper;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class GetProjectsByCustomerBean {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // GÜVENLİK: Sadece Admin VEYA bu müşteri ID'sinin sahibi olan kullanıcı
    // (ProjectSecurityService'e 'isCustomerOwner(auth, customerId)' gibi yeni bir metot eklememiz gerekebilir
    // veya şimdilik ProjectSecurityService'i kullanmayız.
    // DÜZELTME: Şimdilik @projectSecurityService.isProjectOwner kullanamayız çünkü elimizde projectId yok.
    // Daha basit bir güvenlik kuralı koyalım: Sadece Admin veya kimliği doğrulanmış kullanıcı.
    // İleride 'isCustomerOwner' bean'i yazabiliriz.

    // ŞİMDİLİK: Sadece Admin veya o müşterinin kendisi (principal.customer.id)
    // Bu, Spring Security'nin principal nesnesini bizim User entity'mizle doldurmasını gerektirir.
    // En sağlamı: Authentication nesnesini kullanan özel bir 'customerSecurityService' yazmak.
    // Şimdilik bunu basitleştirelim:
    @PreAuthorize("hasRole('ROLE_ADMIN') or @customerSecurityService.isOwner(authentication, #customerId)")
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional(readOnly = true)
    public Page<ProjectDto> get(Long customerId, Pageable pageable) {
        Page<Project> projectPage = projectRepository.findByCustomerId(customerId, pageable);
        return projectPage.map(projectMapper::toDto);
    }
}