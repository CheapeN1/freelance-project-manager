package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.mapper.PaymentPlanMapper;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CancelPaymentPlanBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentPlanMapper paymentPlanMapper;

    // Güvenlik: Sadece Admin bir planı iptal edebilir
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public PaymentPlanDto cancel(Long paymentPlanId) {
        PaymentPlan plan = paymentPlanRepository.findById(paymentPlanId)
                .orElseThrow(() -> new EntityNotFoundException("Ödeme Planı bulunamadı: " + paymentPlanId));

        // Zaten tamamlanmış bir planı iptal etme (iş kuralı)
        if (plan.getStatus() == PaymentPlanStatus.COMPLETED) {
            throw new IllegalStateException("Tamamlanmış bir ödeme planı iptal edilemez.");
        }

        // Zaten iptal edilmişse tekrar işlem yapma
        if (plan.getStatus() == PaymentPlanStatus.CANCELLED) {
            return paymentPlanMapper.toDto(plan); // Mevcut durumu döndür
        }

        plan.setStatus(PaymentPlanStatus.CANCELLED);

        PaymentPlan savedPlan = paymentPlanRepository.save(plan);
        return paymentPlanMapper.toDto(savedPlan);
    }
}