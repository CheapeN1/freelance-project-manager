package com.freelance.project_manager.bean.worklog;

import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.mapper.WorkLogMapper;
import com.freelance.project_manager.model.WorkLog;
import com.freelance.project_manager.repository.WorkLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GetWorkLogsByRequestBean {

    private final WorkLogRepository workLogRepository;
    private final WorkLogMapper workLogMapper;

    // GÜVENLİK: Sadece Admin VEYA bu isterin sahibi olan müşteri (#requestId)
    @PreAuthorize("hasRole('ROLE_ADMIN') or @requestSecurityService.isRequestOwner(authentication, #requestId)")
    public Page<WorkLogDto> get(Long requestId, Pageable pageable) {

        // 1. Veritabanından kayıtları sayfalı olarak çek.
        Page<WorkLog> workLogPage = workLogRepository.findByAdditionalRequestId(requestId, pageable);

        // 2. Page<WorkLog> nesnesini Page<WorkLogDto> nesnesine çevir.
        return workLogPage.map(workLogMapper::toDto);
    }
}