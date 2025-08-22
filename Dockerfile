# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (your Express server listens on 5000 usually)
EXPOSE 5000

# Start the app
CMD ["node", "src/server.js"]
