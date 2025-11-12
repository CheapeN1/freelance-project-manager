package com.freelance.project_manager.bean.project;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.mapper.ProjectMapper;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class GetProjectByIdBean {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // GÜVENLİK: Bu metodu sadece Admin VEYA
    // bu projenin sahibi olan müşteri (#projectId) çalıştırabilir.
    // (ProjectSecurityService'i burada yeniden kullanıyoruz)
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    @Transactional(readOnly = true)
    public ProjectDto get(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Proje bulunamadı: " + projectId));

        return projectMapper.toDto(project);
    }
}