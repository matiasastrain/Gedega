FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expone el puerto (opcional, pero bueno para documentación)
EXPOSE 5000

# Comando de inicio: Ejecuta el seed primero, luego el servidor
CMD ["sh", "-c", "node seed/admin.js && npm start"]