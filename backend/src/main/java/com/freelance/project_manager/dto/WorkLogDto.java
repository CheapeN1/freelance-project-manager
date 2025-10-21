package com.freelance.project_manager.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class WorkLogDto {
    private Long id;
    private String description;
    private LocalDate date;
    private Double hoursWorked;
    private Long requestId; // Hangi istere ait olduğunu bilmek için
}