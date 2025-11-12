package com.freelance.project_manager.bean.worklog;

import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.mapper.WorkLogMapper;
import com.freelance.project_manager.repository.WorkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class GetWorkLogsByProjectBean {

    private final WorkLogRepository workLogRepository;
    private final WorkLogMapper workLogMapper;

    // Güvenlik: Sadece Admin veya Proje Sahibi
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    @Transactional(readOnly = true)
    public Page<WorkLogDto> get(Long projectId, Pageable pageable) {
        return workLogRepository.findByProjectId(projectId, pageable)
                .map(workLogMapper::toDto);
    }
}