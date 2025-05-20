FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN node build.mjs

FROM node:18 AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
