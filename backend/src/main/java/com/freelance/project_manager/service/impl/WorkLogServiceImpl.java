package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.worklog.CreateWorkLogBean;
import com.freelance.project_manager.bean.worklog.GetWorkLogsByRequestBean;
import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.service.WorkLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorkLogServiceImpl implements WorkLogService {

    private final CreateWorkLogBean createWorkLogBean;
    private final GetWorkLogsByRequestBean getWorkLogsByRequestBean;

    @Override
    public WorkLogDto createWorkLog(WorkLogDto workLogDto, Long requestId) {
        // Tüm işi ve güvenliği Bean'e devret
        return createWorkLogBean.create(workLogDto, requestId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WorkLogDto> getWorkLogsByRequestId(Long requestId, Pageable pageable) {
        // Tüm işi ve güvenliği Bean'e devret
        return getWorkLogsByRequestBean.get(requestId, pageable);
    }
}