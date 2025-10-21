package com.freelance.project_manager.bean.request;

import com.freelance.project_manager.dto.AdditionalRequestDto;
import com.freelance.project_manager.mapper.AdditionalRequestMapper;
import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.repository.AdditionalRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GetRequestsForProjectBean {

    private final AdditionalRequestRepository requestRepository;
    private final AdditionalRequestMapper requestMapper;

    // --- DEĞİŞEN METOT ---
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    public Page<AdditionalRequestDto> get(Long projectId, Pageable pageable) {

        // 1. Artık Pageable kullanarak veritabanından sadece bir sayfa veri çekiyoruz.
        Page<AdditionalRequest> requestPage = requestRepository.findByProjectId(projectId, pageable);

        // 2. Çektiğimiz 'Page<AdditionalRequest>' nesnesini,
        //    'Page<AdditionalRequestDto>' nesnesine çeviriyoruz.
        //    Spring Data'nın .map() özelliği bu dönüşümü çok kolaylaştırır.
        return requestPage.map(requestMapper::toDto);
    }
}