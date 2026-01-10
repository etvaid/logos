FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start - Railway sets PORT env var
CMD ["sh", "-c", "npx next start -p ${PORT:-3000}"]
