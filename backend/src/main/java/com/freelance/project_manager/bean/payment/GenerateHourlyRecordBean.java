package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentRecordDto;
import com.freelance.project_manager.mapper.PaymentRecordMapper;
import com.freelance.project_manager.model.PaymentPlan;
import com.freelance.project_manager.model.PaymentRecord;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import com.freelance.project_manager.repository.PaymentPlanRepository;
import com.freelance.project_manager.repository.PaymentRecordRepository;
import com.freelance.project_manager.repository.WorkLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class GenerateHourlyRecordBean {

    private final PaymentPlanRepository paymentPlanRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final WorkLogRepository workLogRepository;
    private final PaymentRecordMapper paymentRecordMapper;

    // Güvenlik: Sadece Admin fatura oluşturabilir
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public PaymentRecordDto generate(Long paymentPlanId, LocalDate startDate, LocalDate endDate, String notes) {
        PaymentPlan plan = paymentPlanRepository.findById(paymentPlanId)
                .orElseThrow(() -> new EntityNotFoundException("Ödeme Planı bulunamadı: " + paymentPlanId));

        if (plan.getPlanType() != PaymentPlanType.HOURLY || plan.getHourlyRate() == null) {
            throw new IllegalArgumentException("Bu işlem sadece 'Saatlik' ve saatlik ücreti tanımlı planlar için geçerlidir.");
        }

        // 1. İlgili projedeki toplam çalışılan saati hesapla
        Double totalHours = workLogRepository.sumHoursForProjectBetweenDates(
                plan.getProject().getId(),
                startDate,
                endDate
        );

        if (totalHours == null || totalHours <= 0) {
            throw new IllegalStateException("Belirtilen tarih aralığında faturalandırılacak çalışma kaydı bulunamadı.");
        }

        // 2. Fatura tutarını hesapla (Saat x Saatlik Ücret)
        BigDecimal totalAmount = plan.getHourlyRate().multiply(BigDecimal.valueOf(totalHours));

        // 3. Yeni bir ödeme kaydı (fatura) oluştur
        PaymentRecord newRecord = PaymentRecord.builder()
                .paymentPlan(plan)
                .amount(totalAmount)
                .issueDate(LocalDate.now()) // Fatura bugün kesildi
                .dueDate(LocalDate.now().plusDays(15)) // 15 gün vade
                .status(PaymentRecordStatus.UNPAID) // Ödenmedi
                .notes(notes != null ? notes : String.format(
                        "%.2f saat x %.2f TL (%.2f TL) - (%s / %s)",
                        totalHours, plan.getHourlyRate(), totalAmount, startDate, endDate))
                .build();

        PaymentRecord savedRecord = paymentRecordRepository.save(newRecord);
        return paymentRecordMapper.toDto(savedRecord);
    }
}