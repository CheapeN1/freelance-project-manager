package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.ProjectDto;
import java.util.List;

public interface ProjectService {

    ProjectDto createProjectTemplate(ProjectDto projectDto);

    List<ProjectDto> getProjectTemplates();

    ProjectDto assignProjectToCustomer(Long templateId, Long customerId);

    // TODO: Müşterinin kendi projelerini görme servisi eklenecek
    // List<ProjectDto> getProjectsForCustomer(Long customerId);
}