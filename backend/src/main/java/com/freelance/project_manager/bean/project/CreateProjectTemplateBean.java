package com.freelance.project_manager.bean.project;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.mapper.ProjectMapper;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateProjectTemplateBean {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // @EnableMethodSecurity sayesinde bu anotasyon çalışır.
    // Bu metodu SADECE "ROLE_ADMIN" rolüne sahip kullanıcılar çalıştırabilir.
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProjectDto create(ProjectDto projectDto) {
        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setTemplate(true); // Bu bir şablondur
        project.setCustomer(null); // Şablonun müşterisi olmaz

        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }
}