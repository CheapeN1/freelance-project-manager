package com.freelance.project_manager.bean.customer;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.mapper.CustomerMapper;
import com.freelance.project_manager.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GetAllCustomersBean {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Transactional(readOnly = true) // Sadece okuma işlemi olduğu için daha performanslıdır.
    public List<CustomerDto> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDto)
                .collect(Collectors.toList());
    }
}