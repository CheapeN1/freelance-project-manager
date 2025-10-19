package com.freelance.project_manager.bean.customer;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.mapper.CustomerMapper;
import com.freelance.project_manager.model.Customer;
import com.freelance.project_manager.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CreateCustomerBean {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Transactional // Veritabanı işleminin güvenli (atomic) olmasını sağlar.
    public CustomerDto create(CustomerDto customerDto) {
        // 1. Gelen DTO'yu veritabanına kaydedilecek Entity'ye çevir.
        Customer customerToSave = customerMapper.toEntity(customerDto);

        // 2. Entity'yi veritabanına kaydet. save() metodu,
        //    kaydedilmiş (ID'si atanmış) halini geri döner.
        Customer savedCustomer = customerRepository.save(customerToSave);

        // 3. Veritabanından dönen kaydedilmiş Entity'yi
        //    API'de cevap olarak gösterilecek DTO'ya çevir ve geri döndür.
        return customerMapper.toDto(savedCustomer);
    }
}