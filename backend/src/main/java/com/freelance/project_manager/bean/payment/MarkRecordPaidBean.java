package com.freelance.project_manager.bean.payment;

import com.freelance.project_manager.dto.PaymentRecordDto;
import com.freelance.project_manager.mapper.PaymentRecordMapper;
import com.freelance.project_manager.model.PaymentRecord;
import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import com.freelance.project_manager.repository.PaymentRecordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class MarkRecordPaidBean {

    private final PaymentRecordRepository paymentRecordRepository;
    private final PaymentRecordMapper paymentRecordMapper;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional
    public PaymentRecordDto markAsPaid(Long recordId) {
        PaymentRecord record = paymentRecordRepository.findById(recordId)
                .orElseThrow(() -> new EntityNotFoundException("Ödeme Kaydı bulunamadı: " + recordId));

        record.setStatus(PaymentRecordStatus.PAID);

        PaymentRecord savedRecord = paymentRecordRepository.save(record);
        return paymentRecordMapper.toDto(savedRecord);
    }
}