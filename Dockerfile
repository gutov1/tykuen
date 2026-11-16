# syntax=docker/dockerfile:1

# 1. Этап сборки (Build stage)
FROM node:22-alpine AS builder
WORKDIR /app

# Кэширование зависимостей
COPY package*.json ./
RUN npm ci

# Копирование исходного кода и production-сборка
COPY . .
RUN npm run build

# 2. Этап раздачи статики (Production stage с Nginx)
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Удаление стандартной страницы Nginx
RUN rm -rf ./*

# Копирование собранного SPA-приложения
COPY --from=builder /app/dist .

# Копирование конфигурации Nginx с поддержкой SPA-роутинга и PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
