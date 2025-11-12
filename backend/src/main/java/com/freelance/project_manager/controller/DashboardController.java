package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.DashboardStatsDTO;
import com.freelance.project_manager.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        // Kullanıcı ID'sine gerek yok çünkü modelde User bağı yok.
        // Direkt sistem genelindeki istatistikleri getiriyoruz.
        DashboardStatsDTO stats = dashboardService.getStats();
        return ResponseEntity.ok(stats);
    }
}