package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Sadece hazır şablonları getirecek bir metot
    List<Project> findByIsTemplate(boolean isTemplate);

    // Bir müşteriye ait tüm projeleri getirecek bir metot
    List<Project> findByCustomerId(Long customerId);
}