FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install

RUN mkdir -p ./dist && cp -r ./public/* ./dist/

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
