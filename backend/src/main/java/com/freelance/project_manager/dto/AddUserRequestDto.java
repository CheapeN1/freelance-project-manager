package com.freelance.project_manager.dto;

import lombok.Data;

@Data
public class AddUserRequestDto {
    private String username; // Yeni kullanıcının emaili
    private String password; // Yeni kullanıcının şifresi
    private Long customerId; // Hangi müşteriye eklenecek?
    private String roleName; // Hangi rol verilecek? (ROLE_CUSTOMER_ACCOUNTANT vb.)
}