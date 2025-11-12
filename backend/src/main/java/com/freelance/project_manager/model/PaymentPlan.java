package com.freelance.project_manager.model;

import com.freelance.project_manager.model.enums.PaymentPlanStatus;
import com.freelance.project_manager.model.enums.PaymentPlanType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal; // Para birimleri için BigDecimal kullanmak en doğrusudur
import java.time.LocalDate;
import java.util.List; // Taksitler için

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_plans")
public class PaymentPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project; // Bu ödeme planı hangi projeye ait?

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentPlanType planType; // Planın tipi ne? (ONE_TIME, INSTALLMENT vb.)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentPlanStatus status; // Planın durumu ne? (ACTIVE, COMPLETED vb.)

    @Column(precision = 19, scale = 2) // Toplam 19 haneye kadar, virgülden sonra 2 hane
    private BigDecimal totalAmount; // Planın toplam tutarı (ONE_TIME ve INSTALLMENT için önemli)

    private LocalDate startDate; // Planın başlangıç tarihi (SUBSCRIPTION için önemli)
    private LocalDate endDate;   // Planın bitiş tarihi (SUBSCRIPTION için önemli)

    @Column(precision = 19, scale = 2)
    private BigDecimal recurringAmount; // Tekrarlayan tutar (SUBSCRIPTION için aylık ücret)

    @Column(precision = 19, scale = 2)
    private BigDecimal hourlyRate; // Saatlik ücret (HOURLY için)


    @Column(columnDefinition = "text")
    private String notes; // Plana özel notlar

    // --- İlişkiler ---

    // Eğer plan tipi INSTALLMENT ise, bu liste taksitleri tutacak.
    @OneToMany(mappedBy = "paymentPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Installment> installments;

    // Bu plana ait oluşturulmuş faturaları (Abonelik/Saatlik) tutar
    @OneToMany(mappedBy = "paymentPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentRecord> paymentRecords;
}