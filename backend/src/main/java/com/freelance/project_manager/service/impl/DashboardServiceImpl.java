package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.dto.DashboardStatsDTO;
import com.freelance.project_manager.repository.*;
import com.freelance.project_manager.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private AdditionalRequestRepository additionalRequestRepository;
    @Autowired private InstallmentRepository installmentRepository;
    @Autowired private PaymentRecordRepository paymentRecordRepository;

    @Override
    public DashboardStatsDTO getStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // 1. Şablon Olmayan (Gerçek) Proje Sayısı
        // Project.java'da 'isTemplate' alanı olduğu için bu metodu Repository'de tanımlamıştık.
        stats.setActiveProjects(projectRepository.countByIsTemplateFalse());

        // 2. Toplam Müşteri Sayısı
        // CustomerRepository.count() metodu JPA'dan hazır gelir.
        stats.setTotalCustomers(customerRepository.count());

        // 3. Toplam İstek Sayısı
        // AdditionalRequestRepository.count() metodu JPA'dan hazır gelir.
        stats.setTotalRequests(additionalRequestRepository.count());

        // 4. Bekleyen Toplam Tutar Hesaplama

        // a. Ödenmemiş Taksitlerin Toplamı
        BigDecimal unpaidInstallments = installmentRepository.sumUnpaidInstallments();

        // b. Ödenmemiş Saatlik/Abonelik Faturalarının Toplamı
        BigDecimal unpaidRecords = paymentRecordRepository.sumUnpaidRecords();

        // Null Kontrolü (Eğer veritabanı boşsa null dönebilir, bunu 0 yapmalıyız)
        if (unpaidInstallments == null) unpaidInstallments = BigDecimal.ZERO;
        if (unpaidRecords == null) unpaidRecords = BigDecimal.ZERO;

        // İkisini Topla
        BigDecimal totalPending = unpaidInstallments.add(unpaidRecords);

        // Formatlama (Örn: 1500.00 -> "1.500,00 TL")
        DecimalFormat formatter = new DecimalFormat("#,##0.00 TL");
        stats.setPendingPayments(formatter.format(totalPending));

        return stats;
    }
}