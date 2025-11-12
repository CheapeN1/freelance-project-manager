package com.freelance.project_manager.bean.customer;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.mapper.CustomerMapper;
import com.freelance.project_manager.model.Customer;
import com.freelance.project_manager.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;



@Component
@RequiredArgsConstructor
public class GetAllCustomersBean {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    // Metot artık Pageable alıyor ve Page<CustomerDto> döndürüyor
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Transactional(readOnly = true) // Sadece okuma işlemi
    public Page<CustomerDto> getAll(Pageable pageable) {
        // Repository'nin findAll metodu zaten Pageable alıp Page döndürür
        Page<Customer> customerPage = customerRepository.findAll(pageable);
        // Page nesnesini DTO Page nesnesine çeviriyoruz
        return customerPage.map(customerMapper::toDto);
    }
}