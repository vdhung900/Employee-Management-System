# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Cài Chromium cho Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    fontconfig \
    msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/templates ./templates
COPY package*.json ./

# Cài Chromium và font cho production image
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    fontconfig \
    msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 9123

CMD ["npm", "run", "start:prod"] 