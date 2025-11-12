package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.CustomerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    /**
     * Yeni bir müşteri oluşturur.
     * @param customerDto Oluşturulacak müşteri bilgileri
     * @return Oluşturulan müşterinin DTO'su
     */
    CustomerDto createCustomer(CustomerDto customerDto);

    Page<CustomerDto> getAllCustomers(Pageable pageable);

    // Diğer metod tanımları (getById, update, delete) buraya eklenecek.

}