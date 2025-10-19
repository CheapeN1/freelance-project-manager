package com.freelance.project_manager.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UserDto {
    private Long id;
    private String username;
    // Rollerimizi bir DTO listesi yerine,
    // isimlerinin olduğu bir String listesi olarak dönmek daha pratiktir.
    private Set<String> roles;
}