# Utiliza una imagen base de Node.js con la versión más reciente (cámbiala según tu necesidad)
FROM node:22-alpine

# Instala PNPM globalmente
RUN npm install -g pnpm

# Establece el directorio de trabajo en la carpeta de la aplicación
WORKDIR /app

# Copia los archivos de configuración necesarios (package.json y pnpm-lock.yaml) a la carpeta de trabajo
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias de la aplicación usando PNPM
RUN pnpm install

# Copia el resto de los archivos de la aplicación a la carpeta de trabajo
COPY . .

# Compila el proyecto
RUN pnpm build

# Expone el puerto en el que se ejecuta la aplicación de Next.js
EXPOSE 3000

# Define el comando para iniciar la aplicación en modo de producción
CMD ["pnpm", "start"]
