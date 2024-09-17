# Utiliza una imagen base de Node.js con la versión deseada
FROM node:21-alpine

# Establece el directorio de trabajo en la carpeta de la aplicación
WORKDIR /app

# Copia los archivos de configuración necesarios (package.json y yarn.lock) a la carpeta de trabajo
COPY package.json yarn.lock ./

# Instala las dependencias de la aplicación
RUN yarn install

# Copia el resto de los archivos de la aplicación a la carpeta de trabajo
COPY . .

# Compila el proyecto
# RUN yarn build

# Expone el puerto en el que se ejecuta la aplicación de Next.js
EXPOSE 3000

# Define el comando para iniciar la aplicación en modo de producción
CMD ["yarn", "dev"]
