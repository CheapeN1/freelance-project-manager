package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.model.Installment;
import com.freelance.project_manager.model.PaymentPlan;
import org.springframework.stereotype.Component;

@Component
public class InstallmentMapper {

    public InstallmentDto toDto(Installment installment) {
        InstallmentDto dto = new InstallmentDto();
        dto.setId(installment.getId());
        dto.setAmount(installment.getAmount());
        dto.setDueDate(installment.getDueDate());
        dto.setPaid(installment.isPaid());
        dto.setPaymentDate(installment.getPaymentDate());
        dto.setNotes(installment.getNotes());
        if (installment.getPaymentPlan() != null) {
            dto.setPaymentPlanId(installment.getPaymentPlan().getId());
        }
        return dto;
    }

    public Installment toEntity(InstallmentDto dto, PaymentPlan paymentPlan) {
        Installment installment = Installment.builder()
                .amount(dto.getAmount())
                .dueDate(dto.getDueDate())
                .notes(dto.getNotes())
                .paymentPlan(paymentPlan) // İlişkili ana planı set et
                // paid ve paymentDate DTO'dan gelmez, bunlar güncellenirken set edilir
                .build();
        // ID set edilmez, veritabanı verir.
        return installment;
    }
}