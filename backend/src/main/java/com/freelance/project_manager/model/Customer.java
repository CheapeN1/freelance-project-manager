package com.freelance.project_manager.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phoneNumber;

    // Bir müşterinin birden fazla kullanıcısı olabilir.
    // "mappedBy" ile bu ilişkinin User sınıfındaki "customer" alanı üzerinden yönetildiğini belirtiyoruz.
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> users;

}
