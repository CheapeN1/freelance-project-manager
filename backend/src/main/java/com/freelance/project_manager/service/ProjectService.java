package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.ProjectDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectService {

    ProjectDto createProjectTemplate(ProjectDto projectDto);

    List<ProjectDto> getProjectTemplates();

    ProjectDto assignProjectToCustomer(Long templateId, Long customerId);

    Page<ProjectDto> getProjectsByCustomerId(Long customerId, Pageable pageable);

    ProjectDto getProjectById(Long projectId);
}