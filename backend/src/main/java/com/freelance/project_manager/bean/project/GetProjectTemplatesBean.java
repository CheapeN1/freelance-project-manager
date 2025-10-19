package com.freelance.project_manager.bean.project;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.mapper.ProjectMapper;
import com.freelance.project_manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GetProjectTemplatesBean {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    // Bu metodu SADECE giriş yapmış (kimliği doğrulanmış) herhangi bir kullanıcı çalıştırabilir.
    @PreAuthorize("isAuthenticated()")
    public List<ProjectDto> get() {
        return projectRepository.findByIsTemplate(true)
                .stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }
}