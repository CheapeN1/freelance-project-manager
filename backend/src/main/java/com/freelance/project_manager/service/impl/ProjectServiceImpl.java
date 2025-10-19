package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.project.AssignProjectToCustomerBean;
import com.freelance.project_manager.bean.project.CreateProjectTemplateBean;
import com.freelance.project_manager.bean.project.GetProjectTemplatesBean;
import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final CreateProjectTemplateBean createProjectTemplateBean;
    private final GetProjectTemplatesBean getProjectTemplatesBean;
    private final AssignProjectToCustomerBean assignProjectToCustomerBean;

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
}