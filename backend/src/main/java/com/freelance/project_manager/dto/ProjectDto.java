package com.freelance.project_manager.dto;

import lombok.Data;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private boolean isTemplate;
    private Long customerId; // İlişkiyi ID olarak taşıyacağız
}