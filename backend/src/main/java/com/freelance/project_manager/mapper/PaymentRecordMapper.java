package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.PaymentRecordDto;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.PaymentRecord;
import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import org.springframework.stereotype.Component;

@Component
public class PaymentRecordMapper {

    public PaymentRecordDto toDto(PaymentRecord record) {
        PaymentRecordDto dto = new PaymentRecordDto();
        dto.setId(record.getId());
        dto.setAmount(record.getAmount());
        dto.setIssueDate(record.getIssueDate());
        dto.setDueDate(record.getDueDate());
        dto.setStatus(record.getStatus());
        dto.setNotes(record.getNotes());
        if (record.getPaymentPlan() != null) {
            dto.setPaymentPlanId(record.getPaymentPlan().getId());
        }
        return dto;
    }

    public PaymentRecord toEntity(PaymentRecordDto dto, PaymentPlan plan) {
        return PaymentRecord.builder()
                .paymentPlan(plan)
                .amount(dto.getAmount())
                .issueDate(dto.getIssueDate())
                .dueDate(dto.getDueDate())
                .status(dto.getStatus() != null ? dto.getStatus() : PaymentRecordStatus.UNPAID)
                .notes(dto.getNotes())
                .build();
    }
}