FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# ENV BUILD_ENV=local  # 로컬에서 개발할 때는 이걸로 바꿔야 함
ENV BUILD_ENV=docker  


COPY . .
RUN npm run build:client

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
