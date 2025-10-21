package com.freelance.project_manager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "work_logs")
public class WorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String description; // Yapılan işle ilgili kısa açıklama

    @Column(nullable = false)
    private LocalDate date; // Çalışmanın yapıldığı tarih

    @Column(nullable = false)
    private Double hoursWorked; // Harcanan saat (örn: 2.5)

    // Birçok "Çalışma Kaydı", bir "Ek İster"e aittir.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private AdditionalRequest additionalRequest;
}