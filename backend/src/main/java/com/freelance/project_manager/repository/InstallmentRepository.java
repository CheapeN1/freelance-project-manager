package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.Installment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InstallmentRepository extends JpaRepository<Installment, Long> {

    // Bir ödeme planına ait tüm taksitleri getirmek için (genellikle sayfalamaya gerek olmaz)
    List<Installment> findByPaymentPlanId(Long paymentPlanId);
}