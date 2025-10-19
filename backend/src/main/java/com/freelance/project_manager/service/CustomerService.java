package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.CustomerDto;

import java.util.List;

public interface CustomerService {

    /**
     * Yeni bir müşteri oluşturur.
     * @param customerDto Oluşturulacak müşteri bilgileri
     * @return Oluşturulan müşterinin DTO'su
     */
    CustomerDto createCustomer(CustomerDto customerDto);

    /**
     * Sistemdeki tüm müşterileri listeler.
     * @return Müşteri DTO listesi
     */
    List<CustomerDto> getAllCustomers();

    // Diğer metod tanımları (getById, update, delete) buraya eklenecek.

}