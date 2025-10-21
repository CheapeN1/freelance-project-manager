package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.WorkLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

    /**
     * Bir istere (AdditionalRequest) ait tüm çalışma kayıtlarını
     * SAYFALANMIŞ (Pageable) olarak getirir.
     */
    Page<WorkLog> findByAdditionalRequestId(Long requestId, Pageable pageable);

    /**
     * BİR İSTERİN TOPLAM ÇALIŞMA SAATİNİ HESAPLAR.
     * Bu metot, 'AdditionalRequest'in 'actualHours' alanını güncellerken kullanılacak.
     * COALESCE, eğer hiç kayıt yoksa SUM(null) yerine 0.0 döndürmesini sağlar.
     */
    @Query("SELECT COALESCE(SUM(w.hoursWorked), 0.0) FROM WorkLog w WHERE w.additionalRequest.id = :requestId")
    Double sumHoursByRequestId(Long requestId);
}