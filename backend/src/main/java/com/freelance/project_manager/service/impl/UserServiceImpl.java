package com.freelance.project_manager.service.impl;

import com.freelance.project_manager.bean.user.AddUserToCustomerBean;
import com.freelance.project_manager.dto.AddUserRequestDto;
import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AddUserToCustomerBean addUserToCustomerBean;

    @Override
    @Transactional
    public UserDto addUserToCustomer(AddUserRequestDto request) {
        return addUserToCustomerBean.add(request);
    }
}