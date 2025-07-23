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

COPY --from=builder /app/build ./build

EXPOSE 3123

CMD ["sh", "-c", "serve -s build -l ${PORT:-3123}"]