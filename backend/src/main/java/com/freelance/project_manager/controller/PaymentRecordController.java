package com.freelance.project_manager.controller;

import com.freelance.project_manager.bean.payment.GenerateHourlyRecordBean;
import com.freelance.project_manager.bean.payment.GenerateSubscriptionRecordBean;
import com.freelance.project_manager.bean.payment.MarkRecordPaidBean;
import com.freelance.project_manager.dto.HourlyRecordRequestDto;
import com.freelance.project_manager.dto.PaymentRecordDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentRecordController {

    private final GenerateSubscriptionRecordBean generateRecordBean;
    private final MarkRecordPaidBean markRecordPaidBean;
    private final GenerateHourlyRecordBean generateHourlyRecordBean;

    /**
     * BİR ABONELİK PLANINA YENİ BİR FATURA (PaymentRecord) OLUŞTURUR (SADECE ADMIN)
     * POST http://localhost:8080/api/v1/payment-plans/1/records
     */
    @PostMapping("/payment-plans/{planId}/records")
    public ResponseEntity<PaymentRecordDto> generateSubscriptionRecord(
            @PathVariable Long planId,
            @RequestBody PaymentRecordDto recordDetails) {

        PaymentRecordDto newRecord = generateRecordBean.generate(planId, recordDetails);
        return new ResponseEntity<>(newRecord, HttpStatus.CREATED);
    }

    /**
     * BİR FATURAYI (PaymentRecord) ÖDENDİ OLARAK İŞARETLER (SADECE ADMIN)
     * PATCH http://localhost:8080/api/v1/payment-records/1/mark-paid
     */
    @PatchMapping("/payment-records/{recordId}/mark-paid")
    public ResponseEntity<PaymentRecordDto> markRecordAsPaid(@PathVariable Long recordId) {

        PaymentRecordDto updatedRecord = markRecordPaidBean.markAsPaid(recordId);
        return ResponseEntity.ok(updatedRecord);
    }

    /**
     * BİR SAATLİK PLANA YENİ BİR FATURA (PaymentRecord) OLUŞTURUR (SADECE ADMIN)
     * POST http://localhost:8080/api/v1/payment-plans/1/generate-hourly-record
     */
    @PostMapping("/payment-plans/{planId}/generate-hourly-record")
    public ResponseEntity<PaymentRecordDto> generateHourlyRecord(
            @PathVariable Long planId,
            // --- 3. DEĞİŞEN KISIM: Yeni DTO'muzu kullanıyoruz ---
            @RequestBody HourlyRecordRequestDto request) {

        PaymentRecordDto newRecord = generateHourlyRecordBean.generate(
                planId,
                request.getStartDate(),
                request.getEndDate(),
                request.getNotes()
        );
        return new ResponseEntity<>(newRecord, HttpStatus.CREATED);
    }
}