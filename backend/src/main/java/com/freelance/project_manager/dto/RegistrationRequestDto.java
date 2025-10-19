package com.freelance.project_manager.dto;

import lombok.Data;

@Data
public class RegistrationRequestDto {
    private String username; // E-posta adresi olacak
    private String password;

    // Yeni bir kullanıcı kaydolduğunda, ona bağlı bir Customer da oluşturulmalı.
    // Bu yüzden müşteri adını da burada alıyoruz.
    private String customerName;
    private String customerPhoneNumber; // Opsiyonel
}
