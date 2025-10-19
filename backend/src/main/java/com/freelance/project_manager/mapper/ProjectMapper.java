package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.model.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    public ProjectDto toDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setTemplate(project.isTemplate());
        if (project.getCustomer() != null) {
            dto.setCustomerId(project.getCustomer().getId());
        }
        return dto;
    }

    public Project toEntity(ProjectDto dto) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setTemplate(dto.isTemplate());
        // Not: Customer'ı ID'den set etmek için Servis katmanında
        // customerRepository'den bulup set etmemiz gerekecek.
        return project;
    }
}