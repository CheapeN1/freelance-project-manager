package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.AddUserRequestDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/add")
    // Sadece Admin veya Müşteri Sahibi bu işlemi yapabilir
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER_OWNER')")
    public ResponseEntity<UserDto> addUserToCustomer(@RequestBody AddUserRequestDto request) {

        // GÜVENLİK NOTU: Burada ileride şunu eklemeliyiz:
        // Eğer istek atan kişi 'CUSTOMER_OWNER' ise, request.customerId
        // sadece kendi customerId'si olabilir. Başkasına ekleyememeli.
        // Şimdilik temel mantığı kuruyoruz.

        UserDto newUser = userService.addUserToCustomer(request);
        return ResponseEntity.ok(newUser);
    }
}