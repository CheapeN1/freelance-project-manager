package com.freelance.project_manager.bean.project;

import com.freelance.project_manager.dto.ProjectDto;
import com.freelance.project_manager.mapper.ProjectMapper;
import com.freelance.project_manager.model.Customer;
import com.freelance.project_manager.model.Project;
import com.freelance.project_manager.repository.CustomerRepository;
import com.freelance.project_manager.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AssignProjectToCustomerBean {

    private final ProjectRepository projectRepository;
    private final CustomerRepository customerRepository;
    private final ProjectMapper projectMapper;

    // Bu işlemi SADECE "ROLE_ADMIN" yapabilir (Müşteriye proje atama).
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProjectDto assign(Long templateId, Long customerId) {
        // 1. Şablonu bul
        Project template = projectRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Proje Şablonu bulunamadı: " + templateId));
        if (!template.isTemplate()) {
            throw new IllegalArgumentException("Bu proje bir şablon değil.");
        }

        // 2. Müşteriyi bul
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Müşteri bulunamadı: " + customerId));

        // 3. Şablonu kopyalayarak yeni bir proje oluştur
        Project newProject = Project.builder()
                .name(template.getName())
                .description(template.getDescription())
                .isTemplate(false) // Artık bir şablon değil
                .customer(customer) // Müşteriye bağla
                .build();

        Project savedProject = projectRepository.save(newProject);
        return projectMapper.toDto(savedProject);
    }
}