# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo Google Maps)
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar build al servidor nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80