# ---- build stage ----
FROM node:22-slim AS build

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

# Production dependencies only (SMTP secrets and other configuration come
# from runtime environment variables, read from process.env at runtime)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build ./build

# Expose the port the app will listen on
EXPOSE 3000

USER node

# Command to run the app
CMD ["node", "build"]
