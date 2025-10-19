package com.freelance.project_manager.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * String olan secretKey'i, 0.12.x versiyonunun gerektirdiği
     * güvenli SecretKey nesnesine dönüştürür.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = this.secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // JWT'den kullanıcı adını (username) çıkarır
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // JWT'nin geçerlilik süresini çıkarır
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * GÜNCELLENDİ (0.12.x API)
     * Token'ı parse eder ve içindeki tüm "claims" (bilgileri) alır.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser() // 'parserBuilder()' yerine 'parser()'
                .verifyWith(getSigningKey()) // 'setSigningKey()' yerine 'verifyWith()'
                .build()
                .parseSignedClaims(token) // 'parseClaimsJws()' yerine 'parseSignedClaims()'
                .getPayload(); // 'getBody()' yerine 'getPayload()'
    }

    // Token'ın süresinin dolup dolmadığını kontrol eder
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Bir kullanıcı için yeni bir token oluşturur
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // claims.put("roles", userDetails.getAuthorities());
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * GÜNCELLENDİ (0.12.x API)
     * Yeni token oluşturur.
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims) // 'setClaims()' yerine 'claims()'
                .subject(subject) // 'setSubject()' yerine 'subject()'
                .issuedAt(new Date(System.currentTimeMillis())) // 'setIssuedAt()' yerine 'issuedAt()'
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) // 'setExpiration()' yerine 'expiration()'
                .signWith(getSigningKey()) // Sadece 'Key' nesnesini alır
                .compact();
    }

    // Token'ın geçerli olup olmadığını doğrular
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}