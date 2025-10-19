package com.freelance.project_manager.config;

import com.freelance.project_manager.model.Role;
import com.freelance.project_manager.model.User;
import com.freelance.project_manager.repository.RoleRepository;
import com.freelance.project_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component // Bu sınıfın bir Spring bileşeni olduğunu ve yönetilmesi gerektiğini belirtir.
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private final UserRepository userRepository; // YENİ ENJEKSİYON
    private final PasswordEncoder passwordEncoder; // YENİ ENJEKSİYON

    /**
     * Spring Boot uygulaması tamamen ayağa kalktığında bu metot otomatik olarak çalıştırılır.
     * @param args Gerekirse başlangıç argümanlarını alır.
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {
        System.out.println("Veritabanı başlangıç kontrolü yapılıyor...");

        // Oluşturulması gereken temel rollerin listesi
        List<String> roles = Arrays.asList("ROLE_ADMIN", "ROLE_CUSTOMER_OWNER", "ROLE_CUSTOMER_ACCOUNTANT");

        for (String roleName : roles) {
            // Veritabanında bu isimde bir rol var mı diye kontrol et
            if (roleRepository.findByName(roleName).isEmpty()) {
                // Eğer rol yoksa, yeni bir Role nesnesi oluştur ve kaydet
                Role newRole = new Role(null, roleName);
                roleRepository.save(newRole);
                System.out.println(roleName + " rolü oluşturuldu.");
            }
        }

        // --- YENİ EKLENEN BLOK ---
        // 2. Admin Kullanıcısını Oluştur (eğer yoksa)
        if (userRepository.findByUsername("admin@projectmanager.com").isEmpty()) {
            System.out.println("Admin kullanıcısı oluşturuluyor...");

            // ROLE_ADMIN'i veritabanından bul
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Hata: ROLE_ADMIN rolü bulunamadı."));

            User adminUser = new User();
            adminUser.setUsername("admin@projectmanager.com");
            // Admin şifresini de şifrele!
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Güvenli bir şifre seçin
            adminUser.setRoles(Set.of(adminRole));
            adminUser.setCustomer(null); // Admin'in bir müşterisi yoktur

            userRepository.save(adminUser);
            System.out.println("Admin kullanıcısı oluşturuldu. Kullanıcı adı: admin@projectmanager.com, Şifre: admin123");
        }
        // --- YENİ BLOK SONU ---

        System.out.println("Veritabanı başlangıç kontrolü tamamlandı.");
    }
}
