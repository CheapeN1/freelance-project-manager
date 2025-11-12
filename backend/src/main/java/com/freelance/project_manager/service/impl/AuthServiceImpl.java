package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.auth.LoginBean;
import com.freelance.project_manager.dto.AuthRequestDto;
import com.freelance.project_manager.dto.AuthResponseDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.mapper.UserMapper;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final LoginBean loginBean;

    @Override
    public AuthResponseDto login(AuthRequestDto request) {
        // Tüm işi 'LoginBean'e devrediyoruz.
        return loginBean.login(request);
    }
}