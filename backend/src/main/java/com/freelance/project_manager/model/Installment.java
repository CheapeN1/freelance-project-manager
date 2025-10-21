package com.freelance.project_manager.model;

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
@Table(name = "installments")
public class Installment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_plan_id", nullable = false)
    private PaymentPlan paymentPlan; // Bu taksit hangi ödeme planına ait?

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount; // Taksit tutarı

    @Column(nullable = false)
    private LocalDate dueDate; // Vade tarihi

    @Builder.Default // Varsayılan olarak ödenmemiş başlasın
    @Column(nullable = false)
    private boolean paid = false; // Ödendi mi? (true/false)

    private LocalDate paymentDate; // Ödendiği tarih (opsiyonel)

    @Column(columnDefinition = "text")
    private String notes; // Taksite özel notlar
}