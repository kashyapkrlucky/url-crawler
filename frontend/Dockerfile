# Dockerfile for frontend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Avoid using cached broken node_modules or lockfiles
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy everything else
COPY . .

# Expose Vite port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
