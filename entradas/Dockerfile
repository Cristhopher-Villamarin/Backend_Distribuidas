# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3005

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]