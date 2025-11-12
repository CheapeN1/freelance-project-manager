package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.customer.CreateCustomerBean;
import com.freelance.project_manager.bean.customer.GetAllCustomersBean;
import com.freelance.project_manager.dto.CustomerDto;
import com.freelance.project_manager.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor // Gerekli tüm bean'leri constructor üzerinden enjekte eder.
public class CustomerServiceImpl implements CustomerService {

    // Sadece ilgili bean'leri çağırır.
    private final CreateCustomerBean createCustomerBean;
    private final GetAllCustomersBean getAllCustomersBean;
    // private final GetCustomerByIdBean getCustomerByIdBean; // Eklenecek
    // private final UpdateCustomerBean updateCustomerBean; // Eklenecek
    // private final DeleteCustomerBean deleteCustomerBean; // Eklenecek

    @Override
    public CustomerDto createCustomer(CustomerDto customerDto) {
        // Tüm işi CreateCustomerBean yapar.
        return createCustomerBean.create(customerDto);
    }

    @Override
    @Transactional(readOnly = true) // Okuma işlemi
    public Page<CustomerDto> getAllCustomers(Pageable pageable) {
        // İşi ilgili Bean'e devret
        return getAllCustomersBean.getAll(pageable);
    }
}
