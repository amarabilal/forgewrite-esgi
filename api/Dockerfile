# Étape de build
FROM node:18

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm install

# Copie de tout le reste (dont prisma)
COPY . .

# Génération du client Prisma
RUN npx prisma generate

# Port exposé
EXPOSE 3000

# Lancement de l'application
CMD ["node", "server.js"]
