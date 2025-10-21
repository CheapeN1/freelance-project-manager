package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.payment.CreatePaymentPlanBean;
import com.freelance.project_manager.bean.payment.GetPaymentPlansByProjectBean;
import com.freelance.project_manager.bean.payment.MarkInstallmentPaidBean;
import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.service.PaymentPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentPlanServiceImpl implements PaymentPlanService {

    private final CreatePaymentPlanBean createPaymentPlanBean;
    private final GetPaymentPlansByProjectBean getPaymentPlansByProjectBean;
    private final MarkInstallmentPaidBean markInstallmentPaidBean;

    @Override
    public PaymentPlanDto createPaymentPlan(PaymentPlanDto paymentPlanDto, Long projectId) {
        return createPaymentPlanBean.create(paymentPlanDto, projectId);
    }

    @Override
    public Page<PaymentPlanDto> getPaymentPlansByProjectId(Long projectId, Pageable pageable) {
        return getPaymentPlansByProjectBean.get(projectId, pageable);
    }

    @Override
    public InstallmentDto markInstallmentAsPaid(Long installmentId) {
        return markInstallmentPaidBean.markAsPaid(installmentId);
    }
}