package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.dto.RegistrationRequestDto;
import com.freelance.project_manager.dto.UserDto;

public interface AuthService {
    UserDto registerNewCustomer(RegistrationRequestDto request);

    AuthResponseDto login(AuthRequestDto request);
}