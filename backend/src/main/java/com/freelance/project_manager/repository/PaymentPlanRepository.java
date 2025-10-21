package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.PaymentPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentPlanRepository extends JpaRepository<PaymentPlan, Long> {

    // Bir projeye ait tüm ödeme planlarını sayfalı olarak getirmek için
    Page<PaymentPlan> findByProjectId(Long projectId, Pageable pageable);
}