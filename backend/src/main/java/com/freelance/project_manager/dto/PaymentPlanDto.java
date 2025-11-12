package com.freelance.project_manager.dto;

import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List; // Taksit DTO'ları için

@Data
public class PaymentPlanDto {
    private Long id;
    private Long projectId;
    private PaymentPlanType planType;
    private PaymentPlanStatus status;
    private BigDecimal totalAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal recurringAmount;
    private BigDecimal hourlyRate;
    private String notes;

    // İlişkili taksitleri de DTO olarak taşıyacağız
    private List<InstallmentDto> installments;

    private List<PaymentRecordDto> paymentRecords;
}