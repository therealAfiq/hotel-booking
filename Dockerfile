# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose port (matches config)
EXPOSE 3000

# Set NODE_ENV to production by default
ENV NODE_ENV=production

# Start the app
CMD ["node", "src/server.js"]
