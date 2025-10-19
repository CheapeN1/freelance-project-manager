package com.freelance.project_manager.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // Giriş için kullanılacak e-posta adresi

    @Column(nullable = false)
    private String password; // Her zaman şifrelenmiş olarak tutulacak

    // Bir kullanıcının birden fazla rolü olabilir, bir rol birden fazla kullanıcıya atanabilir.
    // Bu yüzden ManyToMany ilişkisi kuruyoruz.
    @ManyToMany(fetch = FetchType.EAGER) // Bir kullanıcıyı çekerken rollerini de hemen getirmesi için EAGER.
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    // Birçok kullanıcı tek bir müşteriye ait olabilir.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true) // Admin'in müşterisi olmayacağı için nullable=true olmalı.
    private Customer customer;
}