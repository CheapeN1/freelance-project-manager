package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.request.CreateRequestBean;
import com.freelance.project_manager.bean.request.GetRequestsForProjectBean;
import com.freelance.project_manager.dto.AdditionalRequestDto;
import com.freelance.project_manager.service.AdditionalRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdditionalRequestServiceImpl implements AdditionalRequestService {

    private final CreateRequestBean createRequestBean;
    private final GetRequestsForProjectBean getRequestsForProjectBean;

    @Override
    @Transactional
    public AdditionalRequestDto createRequest(AdditionalRequestDto requestDto, Long projectId) {
        // Tüm işi ve güvenliği ilgili Bean'e devret
        return createRequestBean.create(requestDto, projectId);
    }

    // --- DEĞİŞEN METOT ---
    @Override
    @Transactional(readOnly = true)
    public Page<AdditionalRequestDto> getRequestsByProjectId(Long projectId, Pageable pageable) {
        // Pageable parametresini Bean'e iletiyoruz.
        return getRequestsForProjectBean.get(projectId, pageable);
    }
}