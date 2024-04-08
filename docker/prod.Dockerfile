# Utiliza una imagen base de Node.js con la versión deseada
FROM node:21-alpine AS build

# Establece el directorio de trabajo en la carpeta de la aplicación
WORKDIR /app

# Copia los archivos de configuración necesarios (package.json y package-lock.json) a la carpeta de trabajo
COPY package.json package-lock.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación a la carpeta de trabajo
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Segunda etapa de construcción: Crea una imagen liviana para producción
FROM node:21-alpine

# Establece el directorio de trabajo en la carpeta de la aplicación
WORKDIR /app

# Copia los archivos de la primera etapa de construcción (la aplicación compilada) a la carpeta de trabajo
COPY --from=build /app/.next ./.next

# Expone el puerto en el que se ejecuta la aplicación de Next.js
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
