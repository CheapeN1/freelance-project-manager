package com.freelance.project_manager.model;

import com.freelance.project_manager.model.enums.RequestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "additional_requests")
public class AdditionalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text", nullable = false)
    private String requestText; // İstek metni

    @Enumerated(EnumType.STRING) // Enum'u veritabanında "NEW_FEATURE" gibi String olarak saklar
    @Column(nullable = false)
    private RequestType requestType; // İster Tipi

    @Column(nullable = false)
    private LocalDate requestDate; // İstek Tarihi

    private LocalDate estimatedCompletionDate; // Tahmini Tamamlanma Tarihi

    private Double estimatedHours; // Tahmini Çalışma Saati (Örn: 10.5 saat)

    @Builder.Default // Lombok'a bu alanı varsayılan olarak 0.0 yapmasını söyler
    private Double actualHours = 0.0; // Gerçekleşen Toplam Saat (WorkLog'lardan toplanacak)

    // Birçok "Ek İster", bir "Proje"ye aittir.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // Bir istere ait tüm çalışma kayıtlarını listeler.
    // 'cascade = CascadeType.ALL': Eğer bir 'AdditionalRequest' silinirse,
    // ona bağlı tüm 'WorkLog'lar da otomatik olarak silinir.
    @OneToMany(mappedBy = "additionalRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkLog> workLogs;
}