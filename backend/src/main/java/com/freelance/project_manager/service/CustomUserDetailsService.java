package com.freelance.project_manager.service;

import com.freelance.project_manager.model.Role;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Spring Security, kimlik doğrulama yaparken bu metodu çağırır.
     * @param username Giriş yapılmaya çalışılan kullanıcı adı (bizim için e-posta)
     * @return Spring Security'nin anlayacağı bir UserDetails nesnesi
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Kullanıcıyı bizim 'users' tablomuzdan 'username' (e-posta) ile bul.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + username));

        // 2. Bizim 'User' ve 'Role' nesnelerimizi, Spring Security'nin anladığı
        //    'UserDetails' ve 'GrantedAuthority' formatına çevir.
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                mapRolesToAuthorities(user.getRoles())
        );
    }

    // Bizim Set<Role> listemizi, Spring'in Set<GrantedAuthority> listesine çeviren metot.
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }
}