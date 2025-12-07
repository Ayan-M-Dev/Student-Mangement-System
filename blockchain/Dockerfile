# Use Node 20 LTS (Supported by Hardhat)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Hardhat Network Port
EXPOSE 8545

# Default command: Start Local Node
CMD ["npx", "hardhat", "node"]
