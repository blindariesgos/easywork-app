# Etapa 1: Construcción
FROM node:20-alpine AS builder

# Instalar pnpm manualmente
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración necesarios
COPY package.json pnpm-lock.yaml .env ./

# Instalar todas las dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto de los archivos de la aplicación
COPY . .

# Compilar el proyecto
RUN pnpm build

# Eliminar las dependencias de desarrollo para reducir el tamaño de node_modules
RUN pnpm prune --prod

# Etapa 2: Imagen de Producción
FROM node:20-alpine AS runner

# Instala pnpm manualmente en la etapa de producción también
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.env .env

# Configurar variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Mantener el comando de inicio con pnpm
CMD ["pnpm", "start"]
