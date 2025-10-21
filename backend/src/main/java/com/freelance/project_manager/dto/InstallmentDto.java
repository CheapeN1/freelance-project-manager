package com.freelance.project_manager.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InstallmentDto {
    private Long id;
    private Long paymentPlanId;
    private BigDecimal amount;
    private LocalDate dueDate;
    private boolean paid;
    private LocalDate paymentDate;
    private String notes;
}