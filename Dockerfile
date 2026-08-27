# Use the official lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files from backend directory to workdir
COPY backend/package*.json ./backend/

# Install dependencies in backend directory
RUN cd backend && npm ci --only=production

# Copy the rest of the backend and frontend files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose port 8080
EXPOSE 8080

# Command to run the application from the backend directory
CMD ["node", "backend/server.js"]
