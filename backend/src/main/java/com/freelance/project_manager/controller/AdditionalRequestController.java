package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.AdditionalRequestDto;
import com.freelance.project_manager.service.AdditionalRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1") // Genel bir yol kullanalım
@RequiredArgsConstructor
public class AdditionalRequestController {

    private final AdditionalRequestService requestService;

    /**
     * BİR PROJEYE YENİ BİR İSTER EKLER
     * POST http://localhost:8080/api/v1/projects/1/requests
     */
    @PostMapping("/projects/{projectId}/requests")
    public ResponseEntity<AdditionalRequestDto> createRequest(
            @PathVariable Long projectId,
            @RequestBody AdditionalRequestDto requestDto) {

        // Güvenlik Notu: Yetkilendirme (Admin mi? Proje Sahibi mi?)
        // servis katmanındaki @PreAuthorize tarafından otomatik olarak yapılacaktır.
        AdditionalRequestDto createdRequest = requestService.createRequest(requestDto, projectId);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    /**
     * BİR PROJENİN TÜM İSTERLERİNİ LİSTELER (SAYFALANMIŞ OLARAK)
     * GET http://localhost:8080/api/v1/projects/1/requests
     * Örnek: .../requests?page=0&size=10&sort=requestDate,desc
     */
    @GetMapping("/projects/{projectId}/requests")
    public ResponseEntity<Page<AdditionalRequestDto>> getRequestsForProject(
            @PathVariable Long projectId,
            @PageableDefault(size = 10, sort = "requestDate") Pageable pageable) {

        // Spring, URL'deki 'page', 'size' ve 'sort' parametrelerini otomatik olarak
        // algılayıp bir 'Pageable' nesnesine dönüştürür ve servisimize iletir.
        // @PageableDefault: Eğer kullanıcı bu parametreleri göndermezse
        // varsayılan olarak 10 kayıt getir ve 'requestDate'e göre sırala.
        Page<AdditionalRequestDto> requests = requestService.getRequestsByProjectId(projectId, pageable);
        return ResponseEntity.ok(requests);
    }
}