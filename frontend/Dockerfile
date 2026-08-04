# LEF ERP — Frontend build, served by nginx which also proxies /api and /uploads
# Stage 1: build the Vite app
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .

# API base is baked at build time. In the Docker stack nginx proxies /api,
# so the default is a same-origin relative path.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve static files with nginx (+ reverse proxy to the backend)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
