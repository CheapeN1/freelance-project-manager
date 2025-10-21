package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.AdditionalRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



public interface AdditionalRequestService {

    AdditionalRequestDto createRequest(AdditionalRequestDto requestDto, Long projectId);

    Page<AdditionalRequestDto> getRequestsByProjectId(Long projectId, Pageable pageable);
}