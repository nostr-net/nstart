FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Create .env file from example if it doesn't exist
RUN cp -n .env.example .env || true

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD ["node", "build"]
