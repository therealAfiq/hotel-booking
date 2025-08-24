# Use official Node.js image
FROM node:18

<<<<<<< Updated upstream
# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package files first (better caching for npm install)
COPY package*.json ./

# Install dependencies
RUN npm install --production
=======
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production
>>>>>>> Stashed changes

# Copy the rest of the application
COPY . .

<<<<<<< Updated upstream
# Expose port (matches your app’s server.js / .env)
EXPOSE 3000

# Start app
CMD ["npm", "start"]
=======
# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "src/server.js"]
>>>>>>> Stashed changes
