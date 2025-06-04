# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3123

CMD ["serve", "-s", "dist", "-l", "3123"] 