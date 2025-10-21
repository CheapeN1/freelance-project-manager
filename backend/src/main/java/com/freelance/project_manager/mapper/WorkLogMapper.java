package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.model.WorkLog;
import org.springframework.stereotype.Component;

@Component
public class WorkLogMapper {

    public WorkLogDto toDto(WorkLog workLog) {
        WorkLogDto dto = new WorkLogDto();
        dto.setId(workLog.getId());
        dto.setDescription(workLog.getDescription());
        dto.setDate(workLog.getDate());
        dto.setHoursWorked(workLog.getHoursWorked());
        if (workLog.getAdditionalRequest() != null) {
            dto.setRequestId(workLog.getAdditionalRequest().getId());
        }
        return dto;
    }

    public WorkLog toEntity(WorkLogDto dto, AdditionalRequest request) {
        return WorkLog.builder()
                .description(dto.getDescription())
                .date(dto.getDate())
                .hoursWorked(dto.getHoursWorked())
                .additionalRequest(request) // İlişkili İster'i set ediyoruz
                .build();
    }
}