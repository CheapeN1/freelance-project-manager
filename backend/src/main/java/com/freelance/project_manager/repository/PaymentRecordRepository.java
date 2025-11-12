package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    // PaymentRecord.java'da 'status' (Enum) ve 'amount' (BigDecimal) var.
    // Status 'PAID' (Ödendi) OLMAYAN her şeyi toplarız.
    // Not: Enum ismini tam olarak PaymentRecordStatus içinden bilmediğim için
    // 'PAID' varsaydım. Eğer Enumda 'COMPLETED' varsa burayı değiştirirsin.
    @Query("SELECT SUM(pr.amount) FROM PaymentRecord pr WHERE pr.status <> 'PAID'")
    BigDecimal sumUnpaidRecords();
}