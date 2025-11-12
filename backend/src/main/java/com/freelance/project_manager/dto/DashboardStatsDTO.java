package com.freelance.project_manager.dto;

import lombok.Data;

@Data
public class DashboardStatsDTO {
    private long activeProjects;     // Şablon olmayan gerçek proje sayısı
    private long totalCustomers;     // Toplam kayıtlı müşteri
    private String pendingPayments;  // Bekleyen toplam para (Formatlı String)
    private long totalRequests;      // Toplam ek istek sayısı (Status olmadığı için hepsi)
}
