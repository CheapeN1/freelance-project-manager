package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Sadece hazır şablonları getirecek bir metot
    List<Project> findByIsTemplate(boolean isTemplate);

    // Bir müşteriye ait tüm projeleri SAYFALI olarak getirecek metot
    Page<Project> findByCustomerId(Long customerId, Pageable pageable);

    // Şablon olmayan (yani gerçek) proje sayısını getirir.
    long countByIsTemplateFalse();

}