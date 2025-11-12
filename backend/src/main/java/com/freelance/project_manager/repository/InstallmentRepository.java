package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.Installment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface InstallmentRepository extends JpaRepository<Installment, Long> {

    // Bir ödeme planına ait tüm taksitleri getirmek için (genellikle sayfalamaya gerek olmaz)
    List<Installment> findByPaymentPlanId(Long paymentPlanId);

    // Installment.java'da 'paid' (boolean) ve 'amount' (BigDecimal) var.
    // Ödenmemiş (paid = false) taksitlerin toplamını bulur.
    @Query("SELECT SUM(i.amount) FROM Installment i WHERE i.paid = false")
    BigDecimal sumUnpaidInstallments();

}