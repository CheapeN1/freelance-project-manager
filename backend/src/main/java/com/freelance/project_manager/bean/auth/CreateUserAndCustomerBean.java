package com.freelance.project_manager.bean.auth;

import com.freelance.project_manager.dto.RegistrationRequestDto;
import com.freelance.project_manager.model.Customer;
import com.freelance.project_manager.model.Role;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.CustomerRepository;
import com.freelance.project_manager.repository.RoleRepository;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class CreateUserAndCustomerBean {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public User create(RegistrationRequestDto request) {
        // 1. Yeni bir Müşteri (Customer) oluştur ve kaydet.
        Customer newCustomer = Customer.builder()
                .name(request.getCustomerName())
                .email(request.getUsername())
                .phoneNumber(request.getCustomerPhoneNumber())
                .build();
        customerRepository.save(newCustomer);

        // 2. Yeni kullanıcı için varsayılan "Müşteri Sahibi" rolünü veritabanından bul.
        //    Bu rolün veritabanında olduğundan emin olmalıyız (bunu bir sonraki adımda yapacağız).
        Role userRole = roleRepository.findByName("ROLE_CUSTOMER_OWNER")
                .orElseThrow(() -> new RuntimeException("Hata: ROLE_CUSTOMER_OWNER rolü bulunamadı."));

        // 3. Yeni bir Kullanıcı (User) oluştur.
        User newUser = new User();
        newUser.setUsername(request.getUsername());

        // 4. Şifreyi BCrypt ile HASH'LE ve ata.
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        newUser.setRoles(Set.of(userRole));
        newUser.setCustomer(newCustomer);

        // 5. Yeni kullanıcıyı veritabanına kaydet ve geri döndür.
        return userRepository.save(newUser);
    }
}
