package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.mapper.InstallmentMapper;
import com.freelance.project_manager.mapper.PaymentPlanMapper;
import com.freelance.project_manager.model.Installment;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import com.freelance.project_manager.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CreatePaymentPlanBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final ProjectRepository projectRepository;
    private final PaymentPlanMapper paymentPlanMapper;
    private final InstallmentMapper installmentMapper; // Taksitleri oluşturmak için

    // GÜVENLİK: Sadece Admin VEYA bu projenin sahibi (#projectId)
    @PreAuthorize("hasRole('ROLE_ADMIN') or @projectSecurityService.isProjectOwner(authentication, #projectId)")
    @Transactional
    public PaymentPlanDto create(PaymentPlanDto paymentPlanDto, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Proje bulunamadı: " + projectId));

        PaymentPlan paymentPlan = paymentPlanMapper.toEntity(paymentPlanDto, project);
        paymentPlan.setStatus(PaymentPlanStatus.PENDING); // Başlangıçta beklemede

        // Eğer plan tipi INSTALLMENT ise ve DTO içinde taksit bilgileri geldiyse:
        if (paymentPlan.getPlanType() == PaymentPlanType.INSTALLMENT && paymentPlanDto.getInstallments() != null) {
            List<Installment> installments = new ArrayList<>();
            for (InstallmentDto installmentDto : paymentPlanDto.getInstallments()) {
                // Her bir taksit DTO'sunu Entity'ye çevir ve ana plana bağla
                Installment installment = installmentMapper.toEntity(installmentDto, paymentPlan);
                installments.add(installment);
            }
            paymentPlan.setInstallments(installments); // Oluşturulan taksit listesini ana plana ata
        }
        // Not: cascade = CascadeType.ALL sayesinde, plan kaydedildiğinde taksitler de otomatik kaydedilir.

        PaymentPlan savedPlan = paymentPlanRepository.save(paymentPlan);
        return paymentPlanMapper.toDto(savedPlan);
    }
}