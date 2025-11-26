# --- 1. AŞAMA: BUILD (İNŞA) ---
# Maven ve Java 17 içeren güncel bir imaj kullanıyoruz (Eclipse Temurin tabanlı)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Önce sadece bağımlılık dosyasını kopyalayıp indiriyoruz
COPY pom.xml .
# Kaynak kodları kopyalıyoruz
COPY src ./src

# Projeyi derleyip .jar dosyasını oluşturuyoruz
RUN mvn clean package -DskipTests

# --- 2. AŞAMA: RUN (ÇALIŞTIRMA) ---
# Çalıştırma için hafif ve güvenli Eclipse Temurin JRE kullanıyoruz
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# İlk aşamada (build) oluşan .jar dosyasını buraya kopyalıyoruz
COPY --from=build /app/target/*.jar app.jar

# Uygulamanın çalışacağı portu belirtiyoruz
EXPOSE 8080

# Konteyner başladığında çalışacak komut
ENTRYPOINT ["java", "-jar", "app.jar"]