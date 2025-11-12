package com.freelance.project_manager.dto;

import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentRecordDto {
    private Long id;
    private Long paymentPlanId;
    private BigDecimal amount;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private PaymentRecordStatus status;
    private String notes;
}