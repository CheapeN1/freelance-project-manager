# --- 1. AŞAMA: BUILD (DERLEME) ---
# Node.js 18 yüklü bir imaj kullanıyoruz
FROM node:20-alpine AS build
WORKDIR /app

# Önce package.json'ı kopyalayıp bağımlılıkları indiriyoruz (Cache için)
COPY package*.json ./
RUN npm install

# Tüm kaynak kodları kopyalıyoruz
COPY . .

# Projeyi derliyoruz (dist klasörü oluşacak)
RUN npm run build

# --- 2. AŞAMA: RUN (YAYINLAMA) ---
# Hafif ve hızlı bir web sunucusu olan Nginx kullanıyoruz
FROM nginx:alpine

# Nginx'in varsayılan HTML klasörüne, build aşamasında çıkan dosyaları kopyalıyoruz
# Vite varsayılan olarak 'dist' klasörüne çıktı verir.
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx konfigürasyonu (Opsiyonel ama React Router için gerekli olabilir)
# Varsayılan ayarlar

EXPOSE 80

# Nginx konteyner başladığında otomatik çalışır, CMD yazmaya gerek yok.