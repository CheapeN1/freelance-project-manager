package com.freelance.project_manager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Proje adı (örn: "Kurumsal Web Sitesi Paketi")

    @Column(columnDefinition = "text")
    private String description; // Proje açıklaması

    @Column(nullable = false)
    private boolean isTemplate; // true = Hazır Şablon Proje, false = Müşteriye Özel/Atanmış Proje

    // Bir proje bir müşteriye ait olabilir.
    // Bir şablon projenin (isTemplate=true) müşterisi olmaz, bu yüzden nullable=true.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;

    // Projenin durumu (örn: BEKLEMEDE, DEVAM EDİYOR, TAMAMLANDI)
    // Henüz bir Enum oluşturmadık, şimdilik String tutabilir veya daha sonra ekleyebiliriz.
    // private String status;
}