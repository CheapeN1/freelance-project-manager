package com.freelance.project_manager.controller;

import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto request) {
        // Servisi çağır ve başarılı olursa 200 OK ile birlikte token'ı döndür.
        return ResponseEntity.ok(authService.login(request));
    }
}
