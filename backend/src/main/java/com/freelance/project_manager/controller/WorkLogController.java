package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.service.WorkLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class WorkLogController {

    private final WorkLogService workLogService;

    /**
     * BİR İSTERE YENİ BİR ÇALIŞMA KAYDI (SAAT) EKLER
     * POST http://localhost:8080/api/v1/requests/1/worklogs
     */
    @PostMapping("/requests/{requestId}/worklogs")
    public ResponseEntity<WorkLogDto> createWorkLog(
            @PathVariable Long requestId,
            @RequestBody WorkLogDto workLogDto) {

        // Güvenlik Notu: Yetkilendirme (Admin mi? İsterin Sahibi mi?)
        // servis katmanındaki @PreAuthorize tarafından otomatik olarak yapılacaktır.
        WorkLogDto createdWorkLog = workLogService.createWorkLog(workLogDto, requestId);
        return new ResponseEntity<>(createdWorkLog, HttpStatus.CREATED);
    }

    /**
     * BİR İSTERİN ÇALIŞMA KAYITLARINI SAYFALI OLARAK LİSTELER
     * GET http://localhost:8080/api/v1/requests/1/worklogs?page=0&size=5
     */
    @GetMapping("/requests/{requestId}/worklogs")
    public ResponseEntity<Page<WorkLogDto>> getWorkLogsForRequest(
            @PathVariable Long requestId,
            @PageableDefault(size = 10, sort = "date") Pageable pageable) {

        // Güvenlik Notu: Yetkilendirme... (yukarıdakiyle aynı)
        Page<WorkLogDto> workLogs = workLogService.getWorkLogsByRequestId(requestId, pageable);
        return ResponseEntity.ok(workLogs);
    }
}