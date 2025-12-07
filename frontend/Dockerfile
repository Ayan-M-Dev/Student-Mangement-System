FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies to ensure 'vite' is available for build and preview
RUN npm install

COPY . .

# Build args to bake in environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 4173

# Run the preview server bound to 0.0.0.0 so it's accessible from outside the container
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
