package com.freelance.project_manager.bean.request;

import com.freelance.project_manager.dto.AdditionalRequestDto;
import com.freelance.project_manager.mapper.AdditionalRequestMapper;
import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.repository.AdditionalRequestRepository;
import com.freelance.project_manager.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateRequestBean {

    private final AdditionalRequestRepository requestRepository;
    private final ProjectRepository projectRepository;
    private final AdditionalRequestMapper requestMapper;

    // GÜVENLİK KURALI: Sadece Admin VEYA bu projenin sahibi olan müşteri (#projectId) bu metodu çalıştırabilir.
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    public AdditionalRequestDto create(AdditionalRequestDto requestDto, Long projectId) {
        // 1. İsterin ekleneceği projeyi bul.
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Proje bulunamadı: " + projectId));

        // 2. DTO'yu Entity'ye çevir (projeyi de içine set ederek).
        AdditionalRequest request = requestMapper.toEntity(requestDto, project);

        // 3. Kaydet ve DTO olarak geri döndür.
        AdditionalRequest savedRequest = requestRepository.save(request);
        return requestMapper.toDto(savedRequest);
    }
}