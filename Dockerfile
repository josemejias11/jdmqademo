# Root Dockerfile for unified frontend + backend build
FROM node:20

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install all dependencies at once (root-level)
RUN npm install --legacy-peer-deps

# Expose both frontend and backend ports
EXPOSE 3000
EXPOSE 3001

# Start backend + frontend concurrently
CMD ["npm", "run", "dev"]