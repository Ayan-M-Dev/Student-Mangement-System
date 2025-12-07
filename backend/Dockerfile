FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including devDependencies (needed for build)
RUN npm install

COPY . .

EXPOSE 5007

CMD ["npm", "start"]
