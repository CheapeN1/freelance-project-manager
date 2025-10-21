package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.dto.PaymentPlanDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentPlanService {

    PaymentPlanDto createPaymentPlan(PaymentPlanDto paymentPlanDto, Long projectId);

    Page<PaymentPlanDto> getPaymentPlansByProjectId(Long projectId, Pageable pageable);

    InstallmentDto markInstallmentAsPaid(Long installmentId);
}