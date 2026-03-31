# Stage 1: Build the React application
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
# Copy the compiled Vite 'dist' folder to the Nginx web root
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
