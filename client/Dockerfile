# Étape 1 : build Vite (Vue ou React)
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Étape 2 : Nginx pour servir les fichiers statiques
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
