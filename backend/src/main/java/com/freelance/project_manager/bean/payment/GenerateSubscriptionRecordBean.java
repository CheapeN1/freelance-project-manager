package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentRecordDto;
import com.freelance.project_manager.mapper.PaymentRecordMapper;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.PaymentRecord;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import com.freelance.project_manager.repository.PaymentRecordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class GenerateSubscriptionRecordBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final PaymentRecordMapper paymentRecordMapper;

    // Güvenlik: Sadece Admin fatura oluşturabilir
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public PaymentRecordDto generate(Long paymentPlanId, PaymentRecordDto recordDetails) {
        PaymentPlan plan = paymentPlanRepository.findById(paymentPlanId)
                .orElseThrow(() -> new EntityNotFoundException("Ödeme Planı bulunamadı: " + paymentPlanId));

        if (plan.getPlanType() != PaymentPlanType.SUBSCRIPTION) {
            throw new IllegalArgumentException("Bu işlem sadece 'Abonelik' tipi planlar için geçerlidir.");
        }

        // Yeni bir ödeme kaydı (fatura) oluştur
        PaymentRecord newRecord = PaymentRecord.builder()
                .paymentPlan(plan)
                .amount(plan.getRecurringAmount()) // Tutar, planın aylık tutarıdır
                .issueDate(recordDetails.getIssueDate() != null ? recordDetails.getIssueDate() : LocalDate.now())
                .dueDate(recordDetails.getDueDate() != null ? recordDetails.getDueDate() : LocalDate.now().plusDays(15)) // Varsayılan 15 gün vade
                .status(PaymentRecordStatus.UNPAID) // Başlangıçta ödenmedi
                .notes(recordDetails.getNotes()) // örn: "Kasım 2025 Abonelik Ücreti"
                .build();

        PaymentRecord savedRecord = paymentRecordRepository.save(newRecord);
        return paymentRecordMapper.toDto(savedRecord);
    }
}