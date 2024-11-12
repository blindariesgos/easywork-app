# Etapa 1: Construcción
FROM node:20-alpine AS builder

# Instala pnpm manualmente en lugar de usar corepack
RUN npm install -g pnpm

# Establece el directorio de trabajo en la carpeta de la aplicación
WORKDIR /app

# Copia los archivos de configuración y el archivo .env necesario para la compilación
COPY package.json pnpm-lock.yaml .env ./

# Instala las dependencias necesarias para construir el proyecto
RUN pnpm install --frozen-lockfile

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila el proyecto
RUN pnpm build

# Etapa 2: Imagen de producción
FROM node:20-alpine AS runner

# Instala pnpm manualmente en la etapa de producción también
RUN npm install -g pnpm

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env .env

# Establece las variables de entorno para Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expone el puerto en el que se ejecuta la aplicación de Next.js
EXPOSE 3000

# Define el comando para iniciar la aplicación en modo de producción
CMD ["pnpm", "start"]
