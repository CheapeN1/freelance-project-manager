package com.freelance.project_manager.service;

import com.freelance.project_manager.dto.AddUserRequestDto;
import com.freelance.project_manager.dto.UserDto;

public interface UserService {
    UserDto addUserToCustomer(AddUserRequestDto request);
}