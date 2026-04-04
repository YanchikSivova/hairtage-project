# --- build stage ---
FROM node:18 as build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# --- production stage ---
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html