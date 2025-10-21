package com.freelance.project_manager.bean.worklog;

import com.freelance.project_manager.dto.WorkLogDto;
import com.freelance.project_manager.mapper.WorkLogMapper;
import com.freelance.project_manager.model.AdditionalRequest;
import com.freelance.project_manager.model.WorkLog;
import com.freelance.project_manager.repository.AdditionalRequestRepository;
import com.freelance.project_manager.repository.WorkLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CreateWorkLogBean {

    private final WorkLogRepository workLogRepository;
    private final AdditionalRequestRepository requestRepository;
    private final WorkLogMapper workLogMapper;

    // GÜVENLİK: Sadece Admin VEYA bu isterin sahibi olan müşteri (#requestId)
    @PreAuthorize("hasRole('ROLE_ADMIN') or @requestSecurityService.isRequestOwner(authentication, #requestId)")
    @Transactional // Bu metot artık iki veritabanı işlemi yapıyor (INSERT ve UPDATE),
    // bu yüzden 'Transactional' olmalı. Eğer biri başarısız olursa hepsi geri alınır.
    public WorkLogDto create(WorkLogDto workLogDto, Long requestId) {

        // 1. Çalışma kaydının ekleneceği ana İster'i (AdditionalRequest) bul.
        AdditionalRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("İster bulunamadı: " + requestId));

        // 2. DTO'yu Entity'ye çevir.
        WorkLog workLog = workLogMapper.toEntity(workLogDto, request);

        // 3. Yeni çalışma kaydını veritabanına kaydet.
        WorkLog savedWorkLog = workLogRepository.save(workLog);

        // 4. --- İŞİN SİHİRLİ KISMI ---
        //    Ana İster'in toplam saatini yeniden hesapla.
        Double newTotalHours = workLogRepository.sumHoursByRequestId(requestId);

        // 5. Ana İster'in 'actualHours' alanını güncelle ve kaydet.
        request.setActualHours(newTotalHours);
        requestRepository.save(request);

        // 6. Oluşturulan 'WorkLog' kaydını DTO olarak geri döndür.
        return workLogMapper.toDto(savedWorkLog);
    }
}