package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.dto.UserDto;

public interface AuthService {

    AuthResponseDto login(AuthRequestDto request);
}