package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.InstallmentDto;
import com.freelance.project_manager.mapper.InstallmentMapper;
import com.freelance.project_manager.model.Installment;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.repository.InstallmentRepository;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class MarkInstallmentPaidBean {

    private final InstallmentRepository installmentRepository;
    private final PaymentPlanRepository paymentPlanRepository;
    private final InstallmentMapper installmentMapper;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public InstallmentDto markAsPaid(Long installmentId) {
        Installment installment = installmentRepository.findById(installmentId)
                .orElseThrow(() -> new EntityNotFoundException("Taksit bulunamadı: " + installmentId));

        installment.setPaid(true);
        installment.setPaymentDate(LocalDate.now()); // Ödendiği tarihi bugünün tarihi yap

        Installment savedInstallment = installmentRepository.save(installment);



        // 1. Ana ödeme planını al
        PaymentPlan mainPlan = installment.getPaymentPlan();

        // 2. Eğer planın durumu "PENDING" (Beklemede) ise,
        //    ilk ödeme yapıldığı için "ACTIVE" (Aktif) yap.
        if (mainPlan.getStatus() == PaymentPlanStatus.PENDING) {
            mainPlan.setStatus(PaymentPlanStatus.ACTIVE);
        }

        // 3. Bu plana ait TÜM taksitlerin ödenip ödenmediğini kontrol et.
        //    'mainPlan.getInstallments()' listesindeki tüm 'isPaid()' metotları true mu?
        boolean allPaid = mainPlan.getInstallments().stream().allMatch(Installment::isPaid);

        // 4. Eğer TÜM taksitler ödendiyse, ana planın durumunu "COMPLETED" (Tamamlandı) yap.
        if (allPaid) {
            mainPlan.setStatus(PaymentPlanStatus.COMPLETED);
        }

        // 5. Ana planın güncellenmiş durumunu kaydet.
        paymentPlanRepository.save(mainPlan);

        // --- YENİ BLOK SONU ---

        return installmentMapper.toDto(savedInstallment);
    }
}