FROM node:20-slim

WORKDIR /app

# Install basic dependencies if needed
RUN apt-get update && apt-get install -y git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=development

CMD ["npm", "run", "preflight"]
