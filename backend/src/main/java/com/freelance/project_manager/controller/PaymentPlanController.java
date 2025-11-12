package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.service.PaymentPlanService;
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
public class PaymentPlanController {

    private final PaymentPlanService paymentPlanService;

    /**
     * BİR PROJEYE YENİ BİR ÖDEME PLANI EKLER
     * POST http://localhost:8080/api/v1/projects/1/payment-plans
     */
    @PostMapping("/projects/{projectId}/payment-plans")
    public ResponseEntity<PaymentPlanDto> createPaymentPlan(
            @PathVariable Long projectId,
            @RequestBody PaymentPlanDto paymentPlanDto) {
        // Güvenlik: Admin veya Proje Sahibi (Bean içinde kontrol ediliyor)
        PaymentPlanDto createdPlan = paymentPlanService.createPaymentPlan(paymentPlanDto, projectId);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    /**
     * BİR PROJENİN ÖDEME PLANLARINI SAYFALI LİSTELER
     * GET http://localhost:8080/api/v1/projects/1/payment-plans?page=0&size=5
     */
    @GetMapping("/projects/{projectId}/payment-plans")
    public ResponseEntity<Page<PaymentPlanDto>> getPaymentPlansForProject(
            @PathVariable Long projectId,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        // Güvenlik: Admin veya Proje Sahibi (Bean içinde kontrol ediliyor)
        Page<PaymentPlanDto> plans = paymentPlanService.getPaymentPlansByProjectId(projectId, pageable);
        return ResponseEntity.ok(plans);
    }

    /**
     * BİR TAKSİTİ ÖDENDİ OLARAK İŞARETLER (SADECE ADMIN)
     * PATCH http://localhost:8080/api/v1/installments/1/mark-paid
     */
    @PatchMapping("/installments/{installmentId}/mark-paid")
    public ResponseEntity<InstallmentDto> markInstallmentAsPaid(@PathVariable Long installmentId) {
        // Güvenlik: Sadece Admin (Bean içinde kontrol ediliyor)
        InstallmentDto updatedInstallment = paymentPlanService.markInstallmentAsPaid(installmentId);
        return ResponseEntity.ok(updatedInstallment);
    }

    /**
     * BİR ÖDEME PLANINI (genellikle ONE_TIME) TAMAMLANDI OLARAK İŞARETLER (SADECE ADMIN)
     * PATCH http://localhost:8080/api/v1/payment-plans/1/mark-paid
     */
    @PatchMapping("/payment-plans/{planId}/mark-paid")
    public ResponseEntity<PaymentPlanDto> markPlanAsPaid(@PathVariable Long planId) {
        // Güvenlik: Sadece Admin (Bean içinde kontrol ediliyor)
        PaymentPlanDto updatedPlan = paymentPlanService.markPlanAsPaid(planId);
        return ResponseEntity.ok(updatedPlan);
    }

    /**
     * BİR ÖDEME PLANINI İPTAL EDİLDİ OLARAK İŞARETLER (SADECE ADMIN)
     * PATCH http://localhost:8080/api/v1/payment-plans/1/cancel
     */
    @PatchMapping("/payment-plans/{planId}/cancel")
    public ResponseEntity<PaymentPlanDto> cancelPaymentPlan(@PathVariable Long planId) {
        // Güvenlik: Sadece Admin (Bean içinde kontrol ediliyor)
        PaymentPlanDto cancelledPlan = paymentPlanService.cancelPaymentPlan(planId);
        return ResponseEntity.ok(cancelledPlan);
    }
}