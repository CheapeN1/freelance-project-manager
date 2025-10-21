package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.AdditionalRequestDto;
import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.model.Project;
import org.springframework.stereotype.Component;

@Component
public class AdditionalRequestMapper {

    public AdditionalRequestDto toDto(AdditionalRequest request) {
        AdditionalRequestDto dto = new AdditionalRequestDto();
        dto.setId(request.getId());
        dto.setRequestText(request.getRequestText());
        dto.setRequestType(request.getRequestType());
        dto.setRequestDate(request.getRequestDate());
        dto.setEstimatedCompletionDate(request.getEstimatedCompletionDate());
        dto.setEstimatedHours(request.getEstimatedHours());
        dto.setActualHours(request.getActualHours());
        if (request.getProject() != null) {
            dto.setProjectId(request.getProject().getId());
        }
        return dto;
    }

    public AdditionalRequest toEntity(AdditionalRequestDto dto, Project project) {
        return AdditionalRequest.builder()
                .requestText(dto.getRequestText())
                .requestType(dto.getRequestType())
                .requestDate(dto.getRequestDate())
                .estimatedCompletionDate(dto.getEstimatedCompletionDate())
                .estimatedHours(dto.getEstimatedHours())
                .project(project) // İlişkili Proje'yi set ediyoruz
                .build();
        // Not: 'actualHours' ve 'id' burada set edilmez.
        // 'actualHours' varsayılan olarak 0.0 başlar.
    }
}