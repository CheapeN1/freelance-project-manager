package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.mapper.PaymentPlanMapper;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class MarkPlanAsPaidBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentPlanMapper paymentPlanMapper;

    // Güvenlik: Sadece Admin'in bir planı ödendi yapabilmesini sağlıyoruz
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public PaymentPlanDto markAsPaid(Long paymentPlanId) {
        PaymentPlan plan = paymentPlanRepository.findById(paymentPlanId)
                .orElseThrow(() -> new EntityNotFoundException("Ödeme Planı bulunamadı: " + paymentPlanId));

        // Bu bean'in sadece Tek Seferlik planları işaretlemesi gerektiğini kontrol edebiliriz
        if (plan.getPlanType() != PaymentPlanType.ONE_TIME) {
            // (Veya gelecekte HOURLY ve SUBSCRIPTION'ı da destekleyebilir)
            // Şimdilik sadece ONE_TIME varsayalım
            // throw new IllegalArgumentException("Bu endpoint sadece Tek Seferlik planlar içindir.");
        }

        // Planın durumunu COMPLETED olarak güncelle
        plan.setStatus(PaymentPlanStatus.COMPLETED);

        PaymentPlan savedPlan = paymentPlanRepository.save(plan);
        return paymentPlanMapper.toDto(savedPlan);
    }
}