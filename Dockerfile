# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package files first (better caching for npm install)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose port (matches your app’s server.js / .env)
EXPOSE 3000

# Start app
CMD ["npm", "start"]
