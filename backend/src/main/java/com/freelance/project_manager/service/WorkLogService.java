package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.WorkLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkLogService {

    WorkLogDto createWorkLog(WorkLogDto workLogDto, Long requestId);

    Page<WorkLogDto> getWorkLogsByRequestId(Long requestId, Pageable pageable);
}