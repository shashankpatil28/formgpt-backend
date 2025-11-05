# File: formgpt-backend/Dockerfile

# --- Stage 1: Base ---
# Use a lightweight, modern Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lockfile
# This caches dependencies unless the package files change
COPY package.json package-lock.json* ./

# --- Stage 2: Install Dependencies ---
# Install *only* production dependencies to keep the image lean
RUN npm install --production

# --- Stage 3: Copy Source Code ---
# Copy the rest of your application code
COPY . .

# --- Stage 4: Configure and Run ---
# Set node environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
CMD ["node", "index.js"]