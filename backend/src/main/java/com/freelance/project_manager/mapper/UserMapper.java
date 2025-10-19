package com.freelance.project_manager.mapper;

import com.freelance.project_manager.dto.UserDto;
import com.freelance.project_manager.model.Role;
import com.freelance.project_manager.model.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());

        // User entity'sindeki Set<Role> nesnesini,
        // içindeki rollerin sadece isimlerini içeren bir Set<String>'e çeviriyoruz.
        userDto.setRoles(user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet()));

        return userDto;
    }
}