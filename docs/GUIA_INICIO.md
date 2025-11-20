# 🚀 Guía de Inicio Rápido - Museo MARCO

Esta guía te ayudará a configurar y ejecutar todo el proyecto (Frontend + Backend) en tu máquina local.

## ⚡ Inicio Rápido (si ya configuraste todo)

Si ya tienes PostgreSQL corriendo y el backend configurado, simplemente ejecuta:

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

Asegúrate de tener instalado:

- ✅ **Node.js** >= 16.0.0 ([Descargar](https://nodejs.org/))
- ✅ **npm** >= 8.0.0 (viene con Node.js)
- ✅ **PostgreSQL** >= 12 ([Descargar](https://www.postgresql.org/download/))
- ✅ **Git** (opcional, para clonar el repositorio)

### Verificar instalaciones:

```bash
node --version   # Debe mostrar v16.0.0 o superior
npm --version    # Debe mostrar 8.0.0 o superior
psql --version   # Debe mostrar PostgreSQL 12 o superior
```

## 🗄️ Paso 1: Configurar PostgreSQL

### 1.1 Iniciar PostgreSQL

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

- **Frontend (React):** http://localhost:3000
- **Backend (API):** http://localhost:5001
- **PostgreSQL:** localhost:5432

**Nota:** En macOS, el puerto 5000 está ocupado por AirPlay Receiver. Por eso usamos el puerto 5001 para el backend.

## 🛠️ Comandos Útiles

### Comandos Principales (desde la raíz del proyecto):
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

## ❌ Solución de Problemas

### Error: "role 'postgres' does not exist"

Crea el usuario de PostgreSQL:
```bash
createuser -s postgres
```

### Error: "database 'museo_marco' does not exist"

Crea la base de datos manualmente:
```bash
psql postgres -c "CREATE DATABASE museo_marco;"
```

### Error: "ECONNREFUSED 127.0.0.1:5432"

PostgreSQL no está corriendo. Inícialo:
```bash
# macOS
brew services start postgresql@14

# Linux
sudo service postgresql start

# Windows - usar pgAdmin
```

### Error: "Port 3000 is already in use"

Otro proceso está usando el puerto. Puedes:
1. Matar el proceso: `lsof -ti:3000 | xargs kill`
2. O usar otro puerto: `PORT=3001 npm start`

### Error: "Port 5000 is already in use"

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
