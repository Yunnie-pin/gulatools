# syntax=docker/dockerfile:1

# I have nothing but my burger and I want nothing more
FROM node:26.12.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG SITE_URL=
ENV SITE_URL=$SITE_URL
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
