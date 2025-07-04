# Usar una imagen base de Node.js
FROM node:20.19.3

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "server.js"]