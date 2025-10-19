package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Bu sınıfın bir REST API controller'ı olduğunu belirtir.
@RequestMapping("/api/v1/customers") // Bu controller'daki tüm endpoint'lerin başına bu yol eklenecek.
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // YENİ MÜŞTERİ OLUŞTURMA ENDPOINT'İ
    @PostMapping // HTTP POST isteklerini bu metoda yönlendirir.
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CustomerDto customerDto) {
        CustomerDto createdCustomer = customerService.createCustomer(customerDto);
        // Cevap olarak 201 Created status kodu ve oluşturulan müşterinin bilgileri döner.
        return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
    }

    // TÜM MÜŞTERİLERİ GETİRME ENDPOINT'İ
    @GetMapping // HTTP GET isteklerini bu metoda yönlendirir.
    public ResponseEntity<List<CustomerDto>> getAllCustomers() {
        List<CustomerDto> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers); // Cevap olarak 200 OK ve müşteri listesi döner.
    }
}