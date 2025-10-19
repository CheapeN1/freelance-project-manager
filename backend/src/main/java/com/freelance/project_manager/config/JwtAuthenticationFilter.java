package com.freelance.project_manager.config;

import com.freelance.project_manager.service.CustomUserDetailsService;
import com.freelance.project_manager.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Gelen isteğin başlığından (header) 'Authorization' kısmını al.
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 2. Eğer 'Authorization' başlığı yoksa veya 'Bearer ' ile başlamıyorsa,
        //    bu isteği filtrelemeden devam ettir. (Bu, muhtemelen login/register sayfasıdır)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 'Bearer ' kısmını atarak token'ı al (örn: "Bearer eyJhbGciOi...").
        jwt = authHeader.substring(7);

        // 4. Token'dan kullanıcı adını (username) çıkar.
        username = jwtUtil.extractUsername(jwt);

        // 5. Kullanıcı adı varsa VE bu kullanıcı için daha önce bir oturum açılmamışsa...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Kullanıcıyı veritabanından 'UserDetailsService' ile bul.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 7. Token'ın bu kullanıcıya ait ve süresinin dolmamış olduğunu doğrula.
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // 8. Token geçerliyse, Spring Security için bir kimlik doğrulama nesnesi oluştur.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Şifreye gerek yok, token ile doğruladık
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 9. Doğrulanmış kullanıcıyı Spring Security'nin "güvenlik bağlamına" (Security Context) yerleştir.
                //    Artık bu istek, "kimliği doğrulanmış bir kullanıcı" tarafından yapılmış sayılır.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 10. Filtre zincirinde bir sonraki adıma devam et.
        filterChain.doFilter(request, response);
    }
}