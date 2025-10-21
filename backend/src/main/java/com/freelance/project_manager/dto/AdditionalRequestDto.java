package com.freelance.project_manager.dto;

import com.freelance.project_manager.model.enums.RequestType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AdditionalRequestDto {
    private Long id;
    private String requestText;
    private RequestType requestType;
    private LocalDate requestDate;
    private LocalDate estimatedCompletionDate;
    private Double estimatedHours;
    private Double actualHours;
    private Long projectId; // İsterin hangi projeye ait olduğunu bilmek için
}