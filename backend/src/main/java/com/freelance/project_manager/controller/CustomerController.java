package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



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
    @GetMapping
    public ResponseEntity<Page<CustomerDto>> getAllCustomers(
            @PageableDefault(size = 10, sort = "name") Pageable pageable) { // Varsayılan size=10, sıralama=name

        // Servisi Pageable ile çağırıyoruz
        Page<CustomerDto> customersPage = customerService.getAllCustomers(pageable);

        // Cevap olarak Page nesnesini dönüyoruz
        return ResponseEntity.ok(customersPage);
    }
}