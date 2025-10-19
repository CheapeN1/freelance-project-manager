package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects") // Tüm proje ile ilgili endpoint'ler bu yoldan başlayacak
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    /**
     * YENİ BİR PROJE ŞABLONU OLUŞTURUR (SADECE ADMIN)
     * POST http://localhost:8080/api/v1/projects/templates
     */
    @PostMapping("/templates")
    public ResponseEntity<ProjectDto> createProjectTemplate(@RequestBody ProjectDto projectDto) {
        // Güvenlik Notu: Bu metot, 'ProjectServiceImpl' -> 'CreateProjectTemplateBean' içindeki
        // @PreAuthorize("hasRole('ROLE_ADMIN')") anotasyonu tarafından korunmaktadır.
        // Eğer giriş yapan kullanıcı ADMIN değilse, bu metot 403 Forbidden hatası verecektir.
        ProjectDto createdTemplate = projectService.createProjectTemplate(projectDto);
        return new ResponseEntity<>(createdTemplate, HttpStatus.CREATED);
    }

    /**
     * TÜM PROJE ŞABLONLARINI LİSTELER (TÜM GİRİŞ YAPAN KULLANICILAR)
     * GET http://localhost:8080/api/v1/projects/templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<ProjectDto>> getProjectTemplates() {
        // Güvenlik Notu: Bu metot, 'GetProjectTemplatesBean' içindeki
        // @PreAuthorize("isAuthenticated()") anotasyonu tarafından korunmaktadır.
        // Eğer kullanıcı giriş yapmamışsa, bu metot 401 Unauthorized hatası verecektir.
        List<ProjectDto> templates = projectService.getProjectTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * BİR ŞABLONU BİR MÜŞTERİYE ATAR (SADECE ADMIN)
     * POST http://localhost:8080/api/v1/projects/assign
     * Örnek URL: /api/v1/projects/assign?templateId=1&customerId=2
     */
    @PostMapping("/assign")
    public ResponseEntity<ProjectDto> assignProjectToCustomer(@RequestParam Long templateId,
                                                              @RequestParam Long customerId) {
        // Güvenlik Notu: Bu metot, 'AssignProjectToCustomerBean' içindeki
        // @PreAuthorize("hasRole('ROLE_ADMIN')") anotasyonu tarafından korunmaktadır.
        ProjectDto assignedProject = projectService.assignProjectToCustomer(templateId, customerId);
        return new ResponseEntity<>(assignedProject, HttpStatus.CREATED);
    }
}