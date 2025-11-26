# Museo MARCO - Aplicación Web Interactiva

Aplicación web moderna para el Museo de Arte Contemporáneo de Monterrey (MARCO), desarrollada con React, TypeScript y Node.js.

## 🚀 Características

- ✅ Autenticación y autorización de usuarios
- ✅ Sistema de gestión de exposiciones
- ✅ Compra de boletos y recarga de saldo
- ✅ Información de colecciones y acerca del museo
- ✅ Panel administrativo
- ✅ Auditorías de seguridad con OWASP ZAP
- ✅ **NUEVO: Suite completa de pruebas funcionales**

## 🧪 Pruebas Funcionales

El proyecto incluye una suite completa de pruebas funcionales basadas en el plan de pruebas documentado en `docs/design/pruebas de página.pdf`, alineadas con **OWASP Top 10**.

### Ejecutar Pruebas

```bash
# Todas las pruebas funcionales
npm run test:functional

# Solo frontend (no requiere backend)
npm run test:functional:frontend

# Solo backend (requiere backend corriendo)
npm run test:functional:backend

# Solo integración (requiere backend corriendo)
npm run test:functional:integration

# Con reporte de cobertura
npm run test:functional:coverage
```

### Pruebas Implementadas (5 de 16)

#### ✅ Frontend (PF)
- **PF-01**: Validación de campos de entrada en formulario de login (13 tests)
- **PF-03**: Almacenamiento seguro de tokens en cliente (8 tests)

#### ✅ Backend (PB)
- **PB-02**: Protección contra SQL Injection (25+ tests)

#### ✅ Integración (PIA)
- **PIA-01**: Control de acceso basado en roles (12 tests)
- **PIA-02**: Validación de sesión en cada petición (15+ tests)

**Total**: 73+ casos de prueba

### Documentación de Pruebas

- [README General](tests/functional/README.md) - Visión general del sistema de pruebas
- [Plan de Pruebas](tests/functional/PLAN-PRUEBAS.md) - Mapeo con el plan original
- [Resumen de Implementación](tests/functional/RESUMEN-IMPLEMENTACION.md) - Estado y próximos pasos

### Vulnerabilidades Detectadas

🔴 **Críticas**:
- Tokens almacenados en localStorage (vulnerable a XSS) → Recomendación: migrar a httpOnly cookies

⚠️ **Mejoras Recomendadas**:
- Implementar Content Security Policy (CSP)
- Agregar refresh tokens con rotación
- Implementar rate limiting

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Instalar dependencias del backend
cd backend && npm install
```

## 🏃 Ejecución

### Desarrollo

```bash
# Iniciar frontend y backend
npm run dev

# O iniciarlos por separado
npm start                  # Frontend en http://localhost:3000
npm run backend:start      # Backend en http://localhost:5001
```

### Producción

```bash
# Build del frontend
npm run build

# Iniciar backend en modo producción
npm run backend:prod
```

### Docker

```bash
# Iniciar con Docker Compose
npm run docker:start

# Reconstruir imágenes
npm run docker:start:build

# Detener contenedores
npm run docker:stop

# Ver logs
npm run docker:logs
```

## 🔒 Seguridad

### Auditorías OWASP ZAP

```bash
# Auditoría baseline
npm run audit:baseline

# Auditoría de API
npm run audit:api

# Auditoría completa
npm run audit:full
```

### Con Docker

```bash
# Auditoría frontend
npm run docker:audit:frontend

# Auditoría backend
npm run docker:audit:backend

# Auditoría completa
npm run docker:audit:full
```

### Otras Herramientas de Seguridad

```bash
# npm audit
npm run security:audit

# Snyk
npm run security:snyk

# Detección de secretos (gitleaks)
npm run security:secrets
```

## 🧪 Testing

```bash
# Tests unitarios (React Testing Library)
npm test

# Tests funcionales (ver sección anterior)
npm run test:functional

# Linting
npm run lint

# Formateo de código
npm run format
```

## 📁 Estructura del Proyecto

```
reto-casa-marco/
├── src/                        # Código fuente del frontend
│   ├── components/            # Componentes React
│   ├── pages/                 # Páginas de la aplicación
│   ├── contexts/              # Contextos de React (Auth, etc.)
│   ├── services/              # Servicios (API)
│   ├── styles/                # Estilos CSS
│   └── types/                 # Tipos TypeScript
├── backend/                    # Código del servidor
│   ├── src/                   # Código fuente del backend
│   ├── database/              # Scripts de BD
│   └── ...
├── tests/                      # Suite de pruebas
│   └── functional/            # Pruebas funcionales
│       ├── frontend/          # Pruebas de frontend (PF-*)
│       ├── backend/           # Pruebas de backend (PB-*)
│       ├── integration/       # Pruebas de integración (PIA-*)
│       └── helpers/           # Utilidades de testing
├── docs/                       # Documentación
│   └── design/                # Documentos de diseño
│       └── pruebas de página.pdf
├── security/                   # Configuración de seguridad
│   └── zap/                   # Reglas OWASP ZAP
├── public/                     # Archivos estáticos
└── ...
```

## 🛠️ Tecnologías

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- CSS3

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

### Testing
- Jest
- React Testing Library
- ts-jest
- axios (mocked)

### Seguridad
- OWASP ZAP
- Snyk
- gitleaks
- npm audit

## 📚 Documentación Adicional

- [Guía de Docker](DOCKER-GUIDE.md)
- [Plan de Pruebas](tests/functional/PLAN-PRUEBAS.md)
- [Resumen de Implementación](tests/functional/RESUMEN-IMPLEMENTACION.md)

## 👥 Equipo

- Axel Ariel Grande Ruiz - A01611811
- Carlos Eugenio Saldaña Tijerina - A01285600
- Humberto Jasso Silva - A01771184
- Isaac Hernández Pérez - A01198674
- Víctor Misael Escalante Alvarado - A01741176

## 📖 Materia

TC3002C.101 Ciberseguridad informática II
Tecnológico de Monterrey

## 📝 Licencia

MIT

---

**Estado del Proyecto**: ✅ En Desarrollo Activo
**Última Actualización**: Noviembre 2025
