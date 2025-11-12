package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.project.*;
import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final CreateProjectTemplateBean createProjectTemplateBean;
    private final GetProjectTemplatesBean getProjectTemplatesBean;
    private final AssignProjectToCustomerBean assignProjectToCustomerBean;
    private final GetProjectsByCustomerBean getProjectsByCustomerBean;
    private final GetProjectByIdBean getProjectByIdBean;

    @Override
    @Transactional
    public ProjectDto createProjectTemplate(ProjectDto projectDto) {
        return createProjectTemplateBean.create(projectDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectTemplates() {
        return getProjectTemplatesBean.get();
    }

    @Override
    @Transactional
    public ProjectDto assignProjectToCustomer(Long templateId, Long customerId) {
        return assignProjectToCustomerBean.assign(templateId, customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDto> getProjectsByCustomerId(Long customerId, Pageable pageable) {
        return getProjectsByCustomerBean.get(customerId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long projectId) {
        return getProjectByIdBean.get(projectId);
    }
}