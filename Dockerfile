# syntax=docker/dockerfile:1

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Compile frontend (Vite) and backend (esbuild bundle)
RUN npm run build

# Stage 2: Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist

# Use non-root node user for container security
USER node

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
