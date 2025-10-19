package com.freelance.project_manager.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data // Sadece veri taşımak için getter, setter vb. metodlar yeterli.
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    private Long id;
    private String name;
    private String email;
    private String phoneNumber;

}
