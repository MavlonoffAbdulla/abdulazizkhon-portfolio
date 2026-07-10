# Stage 1: Build the React Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files and build
COPY . .
RUN npm run build

# Stage 2: Serve the application and API with Express server
FROM node:20-alpine

WORKDIR /app

# Copy production package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build output from Stage 1, the server script and seed data
COPY --from=build /app/dist ./dist
COPY server.js ./
COPY seed ./seed

EXPOSE 80

ENV PORT=80

CMD ["node", "server.js"]
