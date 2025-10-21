package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.mapper.PaymentPlanMapper;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GetPaymentPlansByProjectBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentPlanMapper paymentPlanMapper;

    // GÜVENLİK: Sadece Admin VEYA bu projenin sahibi (#projectId)
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    public Page<PaymentPlanDto> get(Long projectId, Pageable pageable) {
        Page<PaymentPlan> planPage = paymentPlanRepository.findByProjectId(projectId, pageable);
        return planPage.map(paymentPlanMapper::toDto);
    }
}