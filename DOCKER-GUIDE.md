# 🐳 Guía de Docker - Museo MARCO

Esta guía te ayudará a ejecutar el proyecto Museo MARCO completamente en Docker, incluyendo auditorías de seguridad con OWASP ZAP.

## 📋 Requisitos Previos

- [Docker Desktop](https://docs.docker.com/get-docker/) instalado y corriendo
- Docker Compose (incluido con Docker Desktop)

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local (sin Docker)

```bash
# Iniciar servicios localmente
npm run dev

# Ejecutar auditoría de seguridad
npm run audit
```

### Opción 2: Con Docker (Recomendado para Producción)

```bash
# Iniciar todos los servicios en Docker
npm run docker:start

# Ejecutar auditoría de seguridad en Docker
npm run docker:audit
```

## 🛠️ Comandos Docker Disponibles

### Gestión de Servicios

| Comando | Descripción |
|---------|-------------|
| `npm run docker:start` | Inicia todos los servicios en Docker |
| `npm run docker:start:build` | Reconstruye imágenes e inicia servicios |
| `npm run docker:stop` | Detiene todos los contenedores |
| `npm run docker:restart` | Reinicia todos los servicios |
| `npm run docker:logs` | Muestra logs en tiempo real |
| `npm run docker:ps` | Lista el estado de los contenedores |

### Auditorías de Seguridad

| Comando | Descripción |
|---------|-------------|
| `npm run docker:audit` | Auditoría baseline del frontend |
| `npm run docker:audit:frontend` | Auditoría baseline del frontend |
| `npm run docker:audit:backend` | Auditoría baseline del backend |
| `npm run docker:audit:full` | Auditoría completa del frontend |

## 📊 Arquitectura Docker

### Servicios Configurados

```yaml
┌─────────────────────────────────────────────────┐
│              museo_network (bridge)             │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │PostgreSQL│  │ Backend  │  │ Frontend │     │
│  │ :5432    │  │ :5001    │  │ :3000    │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────────────────────────────┐          │
│  │      OWASP ZAP (opcional)        │          │
│  │  Se ejecuta bajo demanda         │          │
│  └──────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

### Puertos Expuestos

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5001`
- **PostgreSQL**: `localhost:5432`
- **API Health**: `http://localhost:5001/api/v1/health`

## 🔍 Auditorías de Seguridad con OWASP ZAP

### Tipos de Escaneo

#### 1. Baseline (Rápido - Pasivo)
Escaneo rápido que no modifica la aplicación. Ideal para desarrollo.

```bash
# Frontend
npm run docker:audit:frontend

# Backend
npm run docker:audit:backend
```

**Duración**: ~1-2 minutos

#### 2. API Scan
Escaneo enfocado en endpoints de API.

```bash
./docker-audit.sh api backend
```

**Duración**: ~3-5 minutos

#### 3. Full Scan (Completo - Activo)
Escaneo exhaustivo que realiza pruebas activas. Más lento pero más completo.

```bash
npm run docker:audit:full
```

**Duración**: ~10-20 minutos

### Reportes Generados

Los reportes se guardan en `security/owasp-zap/reports/`:

```
security/owasp-zap/reports/
├── frontend_baseline_20251121_181508.html    # Reporte visual
├── frontend_baseline_20251121_181508.json    # Datos estructurados
└── frontend_baseline_20251121_181508.md      # Documentación
```

### Niveles de Severidad

- 🔴 **Alta**: Requiere atención inmediata
- 🟡 **Media**: Debe corregirse pronto
- 🔵 **Baja**: Mejora recomendada
- ℹ️ **Informativa**: Información útil

## 📝 Workflows Comunes

### Desarrollo con Docker

```bash
# 1. Iniciar servicios
npm run docker:start

# 2. Ver logs en tiempo real
npm run docker:logs

# 3. Hacer cambios en el código

# 4. Reconstruir y reiniciar
npm run docker:start:build

# 5. Ejecutar auditoría
npm run docker:audit

# 6. Detener servicios
npm run docker:stop
```

### Auditoría de Seguridad Completa

```bash
# 1. Asegurarse de que los servicios estén corriendo
npm run docker:start

# 2. Ejecutar auditoría del frontend
./docker-audit.sh baseline frontend

# 3. Ejecutar auditoría del backend
./docker-audit.sh baseline backend

# 4. Si hay tiempo, ejecutar escaneo completo
./docker-audit.sh full frontend

# 5. Revisar reportes
open security/owasp-zap/reports/
```

### Debugging

```bash
# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Acceder a un contenedor
docker exec -it museo_backend sh
docker exec -it museo_frontend sh

# Ver estado de los servicios
npm run docker:ps

# Reiniciar un servicio específico
docker-compose restart backend
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_USER=vicm
DB_PASSWORD=secure_password_here
DB_NAME=museo_marco

# Backend
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CORS_ORIGIN=http://localhost

# Opcional: Puerto del frontend
FRONTEND_PORT=3000
```

### Healthchecks

Todos los servicios tienen healthchecks configurados:

```yaml
# PostgreSQL: Verifica conexión cada 5s
# Backend: Verifica /api/v1/health cada 10s
# Frontend: Verifica HTTP cada 10s
```

### Volúmenes Persistentes

- **postgres_data**: Datos de PostgreSQL (persistente)
- **reports**: Reportes de OWASP ZAP (montado desde host)

## 🚨 Troubleshooting

### Los contenedores no inician

```bash
# Limpiar todo y empezar de cero
docker-compose down -v
npm run docker:start:build
```

### El backend no se conecta a PostgreSQL

```bash
# Verificar que PostgreSQL esté saludable
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### El escaneo de OWASP ZAP falla

```bash
# Verificar que los servicios estén corriendo
npm run docker:ps

# Verificar conectividad de red
docker network inspect museo_network

# Ver logs del último escaneo
docker-compose logs
```

### Problemas de permisos en reportes

```bash
# En macOS/Linux, ajustar permisos
chmod -R 777 security/owasp-zap/reports/
```

## 📈 Mejores Prácticas

1. **Siempre ejecuta auditorías antes de hacer commits importantes**
   ```bash
   npm run docker:audit
   ```

2. **Reconstruye imágenes después de cambios en Dockerfile**
   ```bash
   npm run docker:start:build
   ```

3. **Revisa los reportes de seguridad regularmente**
   ```bash
   open security/owasp-zap/reports/
   ```

4. **Mantén los servicios actualizados**
   ```bash
   docker-compose pull
   npm run docker:start:build
   ```

5. **Limpia recursos no utilizados periódicamente**
   ```bash
   docker system prune -a
   ```

## 🔐 Seguridad

- ⚠️ **NUNCA** subas archivos `.env` al repositorio
- 🔒 Cambia el `JWT_SECRET` en producción
- 🛡️ Ejecuta auditorías regularmente
- 📊 Documenta y corrige vulnerabilidades encontradas
- 🔄 Mantén las imágenes de Docker actualizadas

## 📚 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa esta guía y el troubleshooting
2. Verifica los logs: `npm run docker:logs`
3. Consulta la documentación oficial de Docker
4. Crea un issue en el repositorio del proyecto
