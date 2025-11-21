# 🚀 Guía de Inicio Rápido - Museo MARCO

Esta guía te ayudará a configurar y ejecutar todo el proyecto (Frontend + Backend) en tu máquina local o mediante contenedores Docker.

## ⚡ Inicio Rápido

### Opción 1: Con Docker (Recomendado)

Si tienes Docker instalado, esta es la forma más rápida:

```bash
# Construir e iniciar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Servicios disponibles:**
- 🌐 **Frontend:** http://localhost
- 🔌 **Backend API:** http://localhost:5001
- 💾 **PostgreSQL:** localhost:5432

### Opción 2: Sin Docker (Desarrollo Local)

Si ya tienes PostgreSQL corriendo y el backend configurado:

```bash
npm run dev
```

Este comando:
1. ✅ Inicia el backend en puerto 5001
2. ✅ Verifica que el backend esté funcionando correctamente
3. ✅ Inicia el frontend en puerto 3000 automáticamente
4. ✅ Muestra los logs en tiempo real

Para detener todo:
```bash
npm run stop
```

---

## 📋 Prerrequisitos

### Para Docker (Opción Recomendada):
- ✅ **Docker** >= 20.0.0 ([Descargar](https://www.docker.com/products/docker-desktop/))
- ✅ **Docker Compose** >= 2.0.0 (incluido con Docker Desktop)

### Para Desarrollo Local (Sin Docker):
- ✅ **Node.js** >= 16.0.0 ([Descargar](https://nodejs.org/))
- ✅ **npm** >= 8.0.0 (viene con Node.js)
- ✅ **PostgreSQL** >= 12 ([Descargar](https://www.postgresql.org/download/))
- ✅ **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:

```bash
# Docker
docker --version        # Debe mostrar 20.0.0 o superior
docker-compose --version # Debe mostrar 2.0.0 o superior

# Desarrollo local
node --version   # Debe mostrar v16.0.0 o superior
npm --version    # Debe mostrar 8.0.0 o superior
psql --version   # Debe mostrar PostgreSQL 12 o superior
```

---

## 🐳 Ejecución con Docker

### Paso 1: Construir e Iniciar

```bash
# Construir e iniciar todos los contenedores
docker-compose up -d --build

# Ver el estado de los contenedores
docker-compose ps
```

### Paso 2: Verificar los Servicios

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Paso 3: Acceder a la Aplicación

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5001 |
| Health Check | http://localhost:5001/api/v1/health |

### Comandos Útiles de Docker

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (borra la base de datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir sin caché
docker-compose build --no-cache

# Ver uso de recursos
docker stats
```

### Códigos Promocionales Disponibles

Los códigos se crean automáticamente al iniciar:

| Código | Monto |
|--------|-------|
| `Ko4l4ps0` | $500 |
| `WELCOME100` | $100 |
| `MARCO50` | $50 |
| `MUSEUM25` | $25 |
| `ART200` | $200 |
| `CULTURA75` | $75 |

---

## 🔒 Auditoría de Seguridad con OWASP ZAP

El proyecto incluye contenedores de OWASP ZAP para auditorías de seguridad.

### Ejecutar Escaneo Baseline (Rápido ~5 min)

```bash
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline
```

### Ejecutar Escaneo Completo (30-60 min)

```bash
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full
```

### Ejecutar Escaneo de API

```bash
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api
```

### Modo Interactivo (UI Web)

```bash
docker compose -f docker-compose.yml -f docker-compose.security.yml up owasp-zap-ui
```
Accede a la UI en: http://localhost:8080

**Los reportes se guardan en:** `security/owasp-zap/reports/`

---

## 🗄️ Ejecución Local (Sin Docker)

### Paso 1: Configurar PostgreSQL

#### 1.1 Iniciar PostgreSQL

**macOS (con Homebrew):**
```bash
brew services start postgresql@14
```

**Windows:**
- Iniciar desde el menú de inicio: "PostgreSQL" → "pgAdmin"

**Linux:**
```bash
sudo service postgresql start
```

### 1.2 Crear la Base de Datos

Conectarse a PostgreSQL:
```bash
psql postgres
```

Dentro de PostgreSQL, ejecutar:
```sql
CREATE DATABASE museo_marco;
\q
```

## 📦 Paso 2: Configurar el Backend

### 2.1 Navegar al directorio del backend:
```bash
cd backend
```

### 2.2 Instalar dependencias:
```bash
npm install
```

### 2.3 Configurar variables de entorno:
```bash
cp .env.example .env
```

### 2.4 Editar el archivo `.env`:

Abre `backend/.env` y configura:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=5000

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=museo_marco
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRESQL

# JWT Secrets (cambiar en producción)
JWT_SECRET=secreto_super_seguro_minimo_32_caracteres_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000
```

**IMPORTANTE:** Cambia `DB_PASSWORD` por tu contraseña de PostgreSQL.

### 2.5 Configurar las tablas de la base de datos:
```bash
npm run db:setup
```

Deberías ver:
```
✅ Tablas creadas exitosamente:
   - usuarios
   - transacciones
   - ordenes
```

### 2.6 (Opcional) Poblar con datos de prueba:
```bash
npm run db:seed
```

Esto creará dos usuarios:
- **Usuario Demo:** `demo@museomarco.com` / `Demo12345`
- **Admin:** `admin@museomarco.com` / `Admin12345`

### 2.7 Iniciar el servidor backend:
```bash
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════════╗
║   🎨 Museo MARCO API Server                ║
║   🚀 Servidor corriendo en puerto 5001     ║
║   🌍 Entorno: development                  ║
║   📡 http://localhost:5001                 ║
╚════════════════════════════════════════════╝
```

**¡Deja esta terminal abierta!** El backend debe estar corriendo.

## 🎨 Paso 3: Configurar el Frontend

Abre una **NUEVA TERMINAL** (el backend debe seguir corriendo en la anterior).

### 3.1 Navegar al directorio raíz:
```bash
cd ..  # Salir de la carpeta backend
```

### 3.2 Las dependencias ya deberían estar instaladas, pero si no:
```bash
npm install
```

### 3.3 Iniciar el servidor de desarrollo:
```bash
npm start
```

Deberías ver:
```
Compiled successfully!

You can now view marco-museo-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## ✅ Paso 4: Verificar que todo funciona

### 4.1 Verificar el Backend:

Abre tu navegador y ve a: `http://localhost:5001/api/v1/health`

Deberías ver:
```json
{
  "status": "OK",
  "mensaje": "Museo MARCO API funcionando correctamente",
  "timestamp": "2025-11-20T..."
}
```

### 4.2 Verificar el Frontend:

Tu navegador debería abrirse automáticamente en: `http://localhost:3000`

Deberías ver la página de inicio del Museo MARCO.

## 🧪 Paso 5: Probar las Funcionalidades

### Opción A: Usar la cuenta de prueba (si ejecutaste db:seed)

1. En el frontend (http://localhost:3000), intenta hacer login con:
   - Email: `demo@museomarco.com`
   - Password: `Demo12345`

### Opción B: Crear una nueva cuenta

1. Usa Postman o curl para probar el registro:

```bash
curl -X POST http://localhost:5001/api/v1/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tu Nombre",
    "email": "tu@email.com",
    "password": "Segura123"
  }'
```

2. Deberías recibir un token JWT en la respuesta.

### Probar Recarga de Saldo:

```bash
curl -X POST http://localhost:5001/api/v1/saldo/recargar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "monto": 500,
    "metodo_pago": "tarjeta"
  }'
```

### Probar Creación de Orden:

```bash
curl -X POST http://localhost:5001/api/v1/ordenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "tipo_orden": "evento",
    "total": 45.00,
    "detalles": {
      "adultos": 2,
      "estudiantes": 1
    },
    "fecha_evento": "2025-12-15"
  }'
```

## 📊 Resumen de Puertos

### Con Docker:
| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (nginx) | 80 | http://localhost |
| Backend (API) | 5001 | http://localhost:5001 |
| PostgreSQL | 5432 | localhost:5432 |
| OWASP ZAP UI | 8080 | http://localhost:8080 |

### Sin Docker (Desarrollo Local):
| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (React) | 3000 | http://localhost:3000 |
| Backend (API) | 5001 | http://localhost:5001 |
| PostgreSQL | 5432 | localhost:5432 |

**Nota:** En macOS, el puerto 5000 está ocupado por AirPlay Receiver. Por eso usamos el puerto 5001 para el backend.

## 🛠️ Comandos Útiles

### Docker:
```bash
docker-compose up -d --build    # 🐳 Construir e iniciar contenedores
docker-compose down             # 🛑 Detener contenedores
docker-compose down -v          # 🗑️ Detener y eliminar volúmenes
docker-compose logs -f          # 📋 Ver logs en tiempo real
docker-compose ps               # 📊 Ver estado de contenedores
docker-compose restart backend  # 🔄 Reiniciar servicio específico
```

### Desarrollo Local (desde la raíz del proyecto):
```bash
npm run dev           # ⚡ Iniciar backend + frontend automáticamente
npm run stop          # 🛑 Detener todos los servicios
npm run backend:stop  # Detener solo el backend
npm run frontend:stop # Detener solo el frontend
```

### Backend:
```bash
cd backend

npm run dev        # Iniciar en desarrollo
npm start          # Iniciar en producción
npm run db:setup   # Recrear tablas
npm run db:seed    # Poblar con datos de prueba
```

### Frontend:
```bash
npm start          # Iniciar servidor de desarrollo
npm run build      # Crear build de producción
npm test           # Ejecutar pruebas
```

### Auditoría de Seguridad:
```bash
# Escaneo rápido (baseline)
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

# Escaneo completo
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full

# Escaneo de API
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api
```

## ❌ Solución de Problemas

### Errores de Docker

#### Error: "argon2.node: Exec format error"
El binario de argon2 fue compilado para otra arquitectura. Solución:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

#### Error: "The server does not support SSL connections"
Cambia `NODE_ENV` a `development` en `docker-compose.yml`:
```yaml
environment:
  NODE_ENV: development
```

#### Error: "npm ci - package-lock.json out of sync"
```bash
npm install  # Actualiza el lock file localmente
docker-compose build --no-cache
```

### Errores de Desarrollo Local

#### Error: "role 'postgres' does not exist"

Crea el usuario de PostgreSQL:
```bash
createuser -s postgres
```

#### Error: "database 'museo_marco' does not exist"

Crea la base de datos manualmente:
```bash
psql postgres -c "CREATE DATABASE museo_marco;"
```

#### Error: "ECONNREFUSED 127.0.0.1:5432"

PostgreSQL no está corriendo. Inícialo:
```bash
# macOS
brew services start postgresql@14

# Linux
sudo service postgresql start

# Windows - usar pgAdmin
```

#### Error: "Port 3000 is already in use"

Otro proceso está usando el puerto. Puedes:
1. Matar el proceso: `lsof -ti:3000 | xargs kill`
2. O usar otro puerto: `PORT=3001 npm start`

#### Error: "Port 5000 is already in use"

Cambia el puerto en `backend/.env`:
```env
PORT=5001
```

## 📚 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Lee la documentación del backend en `backend/README.md`
2. ✅ Revisa los endpoints de la API
3. ✅ Integra el frontend con el backend (crear componentes de Login/Registro)
4. ✅ Implementa el flujo completo de compra

## 🆘 ¿Necesitas Ayuda?

- Revisa los logs de la terminal donde corre el backend
- Verifica que PostgreSQL esté corriendo
- Asegúrate de que las credenciales en `.env` sean correctas
- Consulta la documentación en `/docs`

---

**¡Listo!** Ahora tienes el proyecto completo funcionando localmente. 🎉
