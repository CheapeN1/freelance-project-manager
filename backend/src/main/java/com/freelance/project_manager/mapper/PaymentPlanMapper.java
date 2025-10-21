package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.InstallmentDto; // Import et
import com.freelance.project_manager.dto.PaymentPlanDto;
import com.freelance.project_manager.model.Installment; // Import et
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import lombok.RequiredArgsConstructor; // Inject etmek için
import org.springframework.stereotype.Component;

import java.util.Collections; // Boş liste için
import java.util.stream.Collectors; // Listeyi maplemek için

@Component
@RequiredArgsConstructor // InstallmentMapper'ı inject etmek için
public class PaymentPlanMapper {

    private final InstallmentMapper installmentMapper; // Diğer mapper'ı kullanacağız

    public PaymentPlanDto toDto(PaymentPlan plan) {
        PaymentPlanDto dto = new PaymentPlanDto();
        dto.setId(plan.getId());
        dto.setPlanType(plan.getPlanType());
        dto.setStatus(plan.getStatus());
        dto.setTotalAmount(plan.getTotalAmount());
        dto.setStartDate(plan.getStartDate());
        dto.setEndDate(plan.getEndDate());
        dto.setRecurringAmount(plan.getRecurringAmount());
        dto.setHourlyRate(plan.getHourlyRate());
        dto.setNotes(plan.getNotes());
        if (plan.getProject() != null) {
            dto.setProjectId(plan.getProject().getId());
        }

        // Taksitleri de DTO'ya çevir
        if (plan.getInstallments() != null) {
            dto.setInstallments(plan.getInstallments().stream()
                    .map(installmentMapper::toDto) // Her bir Installment'ı DTO'ya çevir
                    .collect(Collectors.toList()));
        } else {
            dto.setInstallments(Collections.emptyList()); // Eğer taksit yoksa boş liste ata
        }

        return dto;
    }

    public PaymentPlan toEntity(PaymentPlanDto dto, Project project) {
        PaymentPlan plan = PaymentPlan.builder()
                .project(project)
                .planType(dto.getPlanType())
                .status(dto.getStatus() != null ? dto.getStatus() : PaymentPlanStatus.PENDING) // Varsayılan durum
                .totalAmount(dto.getTotalAmount())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .recurringAmount(dto.getRecurringAmount())
                .hourlyRate(dto.getHourlyRate())
                .notes(dto.getNotes())
                // installments listesi burada DTO'dan direkt çevrilmez,
                // genellikle ayrı bir işlemle (örn: taksit oluşturma bean'i) yönetilir.
                .build();
        // ID set edilmez.
        return plan;
    }
}