package com.freelance.project_manager.model.enums;

public enum PaymentPlanStatus {
    PENDING,        // Beklemede / Henüz Başlamadı
    ACTIVE,         // Aktif / Ödemeler Bekleniyor
    COMPLETED,      // Tamamlandı / Tüm Ödemeler Alındı
    CANCELLED       // İptal Edildi
}