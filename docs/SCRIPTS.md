# 📜 Documentación de Scripts y Comandos

Este documento explica todos los scripts y comandos disponibles en el proyecto.

---

## 🐳 Comandos de Docker

### Gestión de Contenedores

| Comando | Descripción |
|---------|-------------|
| `docker-compose up -d --build` | Construir e iniciar todos los contenedores |
| `docker-compose up -d` | Iniciar contenedores (sin reconstruir) |
| `docker-compose down` | Detener y eliminar contenedores |
| `docker-compose down -v` | Detener contenedores y eliminar volúmenes |
| `docker-compose ps` | Ver estado de los contenedores |
| `docker-compose logs -f` | Ver logs en tiempo real |
| `docker-compose logs -f backend` | Ver logs solo del backend |
| `docker-compose restart backend` | Reiniciar un servicio específico |
| `docker-compose build --no-cache` | Reconstruir sin caché |
| `docker stats` | Ver uso de recursos |

### Servicios Disponibles

| Contenedor | Puerto | Descripción |
|------------|--------|-------------|
| `museo_frontend` | 80 | Frontend con nginx |
| `museo_backend` | 5001 | API Node.js/Express |
| `museo_db` | 5432 | PostgreSQL 15 |

### Ejemplo de Uso

```bash
# Iniciar todo el proyecto
docker-compose up -d --build

# Verificar que todo está corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Detener todo
docker-compose down
```

---

## 🔒 Comandos de Auditoría de Seguridad (OWASP ZAP)

### Escaneos de Seguridad

| Comando | Duración | Descripción |
|---------|----------|-------------|
| `docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline` | ~5 min | Escaneo pasivo rápido |
| `docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full` | 30-60 min | Escaneo activo completo |
| `docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api` | ~10 min | Escaneo de API |
| `docker compose -f docker-compose.yml -f docker-compose.security.yml up owasp-zap-ui` | N/A | UI interactiva |

### Reportes

Los reportes se generan en: `security/owasp-zap/reports/`

Formatos disponibles:
- HTML - Reporte visual
- JSON - Datos estructurados
- Markdown - Para documentación

### Ejemplo de Uso

```bash
# Asegurarse que los servicios estén corriendo
docker-compose up -d

# Ejecutar escaneo baseline
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

# Ver reportes generados
ls -la security/owasp-zap/reports/
```

---

## 🚀 Scripts NPM de Inicio

### `npm run dev`
**Inicio automático de backend + frontend**

Este es el comando recomendado para desarrollo. Ejecuta el script `start-services.sh` que:

1. **Limpia procesos previos**: Detiene cualquier servicio anterior en los puertos 5001 y 3000
2. **Inicia el backend**: Lanza el servidor Node.js/Express en puerto 5001
3. **Verifica salud del backend**: Hace hasta 30 intentos de conectar al endpoint `/api/v1/health`
4. **Valida el backend**: Si el backend no responde en 30 segundos, aborta y muestra los logs
5. **Inicia el frontend**: Si el backend está OK, lanza React en puerto 3000
6. **Muestra información**: Imprime URLs de acceso y ubicación de logs
7. **Streaming de logs**: Muestra los logs del backend en tiempo real

**Uso:**
```bash
npm run dev
```

**Salida esperada:**
```
🚀 Iniciando servicios del Museo MARCO...
🧹 Limpiando procesos previos...
📦 Iniciando backend en puerto 5001...
⏳ Esperando a que el backend esté listo...
✅ Backend iniciado correctamente en http://localhost:5001
🎨 Iniciando frontend en puerto 3000...
✅ Frontend iniciado correctamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Todos los servicios están corriendo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend: http://localhost:3000
🔌 Backend:  http://localhost:5001
💾 Database: PostgreSQL en localhost:5432
```

**Logs guardados en:**
- `backend.log` - Logs del servidor Node.js
- `frontend.log` - Logs de React

---

## 🛑 Scripts de Detención

### `npm run stop`
**Detiene todos los servicios (backend + frontend)**

```bash
npm run stop
```

Ejecuta secuencialmente:
1. `npm run backend:stop`
2. `npm run frontend:stop`

### `npm run backend:stop`
**Detiene solo el backend**

```bash
npm run backend:stop
```

Busca y mata el proceso en el puerto 5001 usando:
```bash
lsof -ti:5001 | xargs kill -9
```

### `npm run frontend:stop`
**Detiene solo el frontend**

```bash
npm run frontend:stop
```

Busca y mata el proceso en el puerto 3000 usando:
```bash
lsof -ti:3000 | xargs kill -9
```

---

## ⚙️ Scripts de Backend

### `npm run backend:start`
**Inicia el backend en modo desarrollo**

```bash
npm run backend:start
```

Equivalente a:
```bash
cd backend && npm run dev
```

Inicia el servidor con **nodemon** para hot-reload automático.

### `npm run backend:prod`
**Inicia el backend en modo producción**

```bash
npm run backend:prod
```

Equivalente a:
```bash
cd backend && npm start
```

Inicia el servidor con **Node.js** sin hot-reload.

---

## 🎨 Scripts de Frontend

### `npm start`
**Inicia el frontend en modo desarrollo**

```bash
npm start
```

Ejecuta `react-scripts start` y abre el navegador automáticamente en http://localhost:3000

### `npm run build`
**Crea build de producción**

```bash
npm run build
```

Genera archivos optimizados en la carpeta `/build` listos para deployment.

### `npm test`
**Ejecuta tests con coverage**

```bash
npm test
```

Corre los tests de Jest con reporte de cobertura.

---

## 🔄 Scripts de Utilidad

### `npm run restart`
**Reinicia el frontend**

```bash
npm run restart
```

Ejecuta:
1. `npm run stop` - Detiene todos los servicios
2. `npm start` - Inicia solo el frontend

⚠️ **Nota**: Solo reinicia el frontend, no el backend.

### `npm run lint`
**Analiza código con ESLint**

```bash
npm run lint
```

Verifica archivos TypeScript/TSX en busca de errores de estilo.

### `npm run format`
**Formatea código con Prettier**

```bash
npm run format
```

Formatea automáticamente archivos TS, TSX, JSON, CSS y MD.

---

## 🔒 Scripts de Seguridad

### `npm run security:audit`
**Auditoría de dependencias**

```bash
npm run security:audit
```

Ejecuta `npm audit` solo en dependencias de producción.

### `npm run security:snyk`
**Escaneo de vulnerabilidades con Snyk**

```bash
npm run security:snyk
```

Requiere cuenta de Snyk configurada.

### `npm run security:secrets`
**Detecta secretos en el código**

```bash
npm run security:secrets
```

Usa `gitleaks` para encontrar credenciales hardcodeadas.

---

## 📊 Otros Scripts

### `npm run analyze`
**Analiza el tamaño del bundle**

```bash
npm run analyze
```

Requiere hacer `npm run build` primero. Muestra visualización del tamaño de los archivos JS.

---

## 🎯 Flujo de Trabajo Recomendado

### Con Docker (Recomendado)

```bash
# 1. Iniciar todo
docker-compose up -d --build

# 2. Ver logs mientras trabajas
docker-compose logs -f

# 3. Ejecutar auditoría de seguridad
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

# 4. Al terminar
docker-compose down
```

### Desarrollo Local (Sin Docker)

```bash
# 1. Iniciar todo
npm run dev

# 2. Trabajar en el código...

# 3. Al terminar
npm run stop
```

### Testing y Validación

```bash
# Formatear código
npm run format

# Verificar estilo
npm run lint

# Correr tests
npm test

# Auditar seguridad (npm)
npm run security:audit

# Auditar seguridad (OWASP ZAP)
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline
```

### Deployment con Docker

```bash
# Construir imágenes para producción
docker-compose build --no-cache

# Iniciar en modo detached
docker-compose up -d

# Verificar que todo funciona
docker-compose ps
docker-compose logs
```

### Deployment Local

```bash
# Crear build del frontend
npm run build

# Iniciar backend en producción
npm run backend:prod
```

---

## 🐛 Troubleshooting

### Errores de Docker

#### Error: "argon2.node: Exec format error"
El binario fue compilado para otra arquitectura:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

#### Error: "The server does not support SSL connections"
Cambia `NODE_ENV` a `development` en `docker-compose.yml`

#### Error: "npm ci - package-lock.json out of sync"
```bash
npm install  # Actualiza el lock file
docker-compose build --no-cache
```

#### Contenedor se reinicia constantemente
```bash
# Ver logs del contenedor
docker-compose logs backend

# Verificar estado
docker-compose ps
```

### Errores de Desarrollo Local

#### Error: "Backend no responde"
Si `npm run dev` falla porque el backend no responde:

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   brew services list | grep postgresql
   ```

2. Revisa el archivo `backend.log`:
   ```bash
   cat backend.log
   ```

3. Verifica las credenciales en `backend/.env`

#### Error: "Port already in use"
Si los puertos están ocupados:

```bash
# Detener todo
npm run stop

# Si persiste, matar manualmente
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

#### Permisos denegados en start-services.sh
Si obtienes error de permisos:

```bash
chmod +x start-services.sh
```

### Errores de OWASP ZAP

#### Error: "Read-only file system"
El directorio `wrk` no tiene permisos de escritura:
```bash
mkdir -p security/owasp-zap/wrk
chmod 777 security/owasp-zap/wrk
```

#### Reportes no se generan
Verifica que los servicios estén corriendo antes del escaneo:
```bash
docker-compose ps  # Todos deben estar "Up"
```

---

## 📝 Notas

- Los archivos `backend.log` y `frontend.log` están en `.gitignore`
- El script `start-services.sh` es específico para Unix/Linux/macOS
- Para Windows, considera usar WSL o Git Bash
- Los scripts usan `lsof` que viene preinstalado en macOS y Linux
- Los reportes de OWASP ZAP se guardan en `security/owasp-zap/reports/`

---

## 📊 Resumen de Puertos

| Servicio | Docker | Local |
|----------|--------|-------|
| Frontend | 80 | 3000 |
| Backend | 5001 | 5001 |
| PostgreSQL | 5432 | 5432 |
| OWASP ZAP UI | 8080 | N/A |

---

**¡Listo!** Con estos comandos puedes gestionar fácilmente el ciclo de vida de tu aplicación. 🚀
