# 1. Build stage
FROM node:22-alpine AS builder

# Install build tools
RUN apk add --no-cache python3 g++ make

WORKDIR /app

# Copy only package files first to leverage caching
COPY package*.json ./

# Install all dependencies for building
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# 2. Runtime stage
FROM node:22-alpine AS runtime

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Remove npm cache to save space
RUN npm cache clean --force

# Expose app port (if needed)
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
