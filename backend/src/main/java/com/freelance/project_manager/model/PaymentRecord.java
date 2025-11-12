package com.freelance.project_manager.model;

import com.freelance.project_manager.model.enums.PaymentRecordStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_records")
public class PaymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Bu kayıt hangi ana ödeme planına (sözleşmeye) ait?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_plan_id", nullable = false)
    private PaymentPlan paymentPlan;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount; // Fatura tutarı (Abonelikse sabit, Saatlikse hesaplanmış)

    @Column(nullable = false)
    private LocalDate issueDate; // Faturanın kesildiği/oluşturulduğu tarih (örn: 2025-11-01)

    @Column(nullable = false)
    private LocalDate dueDate; // Son ödeme tarihi

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentRecordStatus status; // Durum: Ödendi / Ödenmedi

    @Column(columnDefinition = "text")
    private String notes; // örn: "Kasım 2025 Bakım Faturası"
}