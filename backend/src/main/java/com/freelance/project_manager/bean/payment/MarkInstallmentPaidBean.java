package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.mapper.InstallmentMapper;
import com.freelance.project_manager.model.Installment;
import com.freelance.project_manager.repository.InstallmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException; // Yetki hatası için
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Authentication nesnesini almak için
import org.springframework.security.core.context.SecurityContextHolder; // Authentication nesnesini almak için
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.freelance.project_manager.security.ProjectSecurityService; // Proje sahibini kontrol etmek için

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class MarkInstallmentPaidBean {

    private final InstallmentRepository installmentRepository;
    private final InstallmentMapper installmentMapper;
    private final ProjectSecurityService projectSecurityService; // Proje sahibini kontrol etmek için

    // GÜVENLİK: Sadece Admin yapabilir şimdilik. Müşterinin kendi ödemesini işaretlemesi riskli olabilir.
    // İsterseniz daha sonra proje sahibine de yetki verebiliriz.
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public InstallmentDto markAsPaid(Long installmentId) {
        Installment installment = installmentRepository.findById(installmentId)
                .orElseThrow(() -> new EntityNotFoundException("Taksit bulunamadı: " + installmentId));

        // Ekstra Güvenlik Kontrolü (Opsiyonel ama önerilir):
        // Sadece admin yetkisi verdik ama yine de bu taksitin projesini kontrol edebiliriz.
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Long projectId = installment.getPaymentPlan().getProject().getId();
        // if (!projectSecurityService.isProjectOwner(authentication, projectId) && !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
        //     throw new AccessDeniedException("Bu işlem için yetkiniz yok.");
        // }


        installment.setPaid(true);
        installment.setPaymentDate(LocalDate.now()); // Ödendiği tarihi bugünün tarihi yap

        Installment savedInstallment = installmentRepository.save(installment);

        // TODO: Eğer bu taksit, planın son taksidi ise, ana PaymentPlan'ın
        // status'unu COMPLETED olarak güncelleme mantığı buraya eklenebilir.

        return installmentMapper.toDto(savedInstallment);
    }
}