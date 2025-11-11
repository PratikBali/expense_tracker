# Use official Node.js LTS image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies to ensure nothing is missing
RUN npm install --loglevel=verbose

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]

