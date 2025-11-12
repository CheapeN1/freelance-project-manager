package com.freelance.project_manager.bean.user;

import com.freelance.project_manager.dto.AddUserRequestDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.mapper.UserMapper;
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
public class AddUserToCustomerBean {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper; // UserDto dönüşümü için

    public UserDto add(AddUserRequestDto request) {
        // 1. Kullanıcı adı (email) zaten var mı kontrol et
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda.");
        }

        // 2. Müşteriyi (Şirketi) Bul
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı ID: " + request.getCustomerId()));

        // 3. Rolü Bul (Örn: ROLE_CUSTOMER_ACCOUNTANT)
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Rol bulunamadı: " + request.getRoleName()));

        // 4. Kullanıcıyı Oluştur
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setCustomer(customer); // Müşteriye bağla
        newUser.setRoles(Set.of(role)); // Rolü ata

        // 5. Kaydet
        User savedUser = userRepository.save(newUser);

        // 6. DTO olarak döndür
        return userMapper.toDto(savedUser);
    }
}