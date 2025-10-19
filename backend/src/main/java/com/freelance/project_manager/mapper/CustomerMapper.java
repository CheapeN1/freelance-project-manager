package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.model.Customer;
import org.springframework.stereotype.Component;

@Component // Bu sınıfın bir Spring bileşeni (Bean) olduğunu belirtiyoruz.
// Böylece başka sınıflara enjekte edebiliriz (Dependency Injection).
public class CustomerMapper {

    // Customer Entity'sini CustomerDto'ya çevirir.
    public CustomerDto toDto(Customer customer) {
        return CustomerDto.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .build();
    }

    // CustomerDto'yu Customer Entity'sine çevirir.
    public Customer toEntity(CustomerDto customerDto) {
        return Customer.builder()
                .name(customerDto.getName())
                .email(customerDto.getEmail())
                .phoneNumber(customerDto.getPhoneNumber())
                .build();
        // ID'yi burada set etmiyoruz çünkü yeni oluşturulan bir entity'nin ID'si veritabanı tarafından verilir.
    }
}