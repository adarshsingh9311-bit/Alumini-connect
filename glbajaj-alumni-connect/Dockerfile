# ==========================================
# Dockerfile for React Vite Frontend
# AGENTX 2026 - GL Bajaj Alumni Connect
# ==========================================

# Step 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first for efficient caching
COPY package*.json ./
RUN npm install

# Copy application source code and build production bundle
COPY . .
RUN npm run build

# Step 2: Production Nginx stage
FROM nginx:alpine

# Copy built static files to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support client-side routing (React Router)
RUN echo 'server {' \
    '    listen 80;' \
    '    server_name localhost;' \
    '    location / {' \
    '        root /usr/share/nginx/html;' \
    '        index index.html index.htm;' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
