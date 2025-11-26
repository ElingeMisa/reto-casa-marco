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

## 🧪 Sistema de Pruebas

El proyecto incluye una **suite completa de pruebas** que combina pruebas unitarias, funcionales y de seguridad, basadas en el plan de pruebas OWASP Top 10.

### 🚀 Script Maestro (Recomendado)

```bash
# Ejecutar TODAS las pruebas del proyecto
npm run test:all
# o
npm run verify
```

**Esto ejecuta:**
1. ✅ Pruebas unitarias (React + cobertura)
2. ✅ Pruebas funcionales (Frontend + Backend + Integración)
3. ✅ Auditoría de seguridad (npm audit)
4. ✅ Lint y calidad de código (ESLint)

**Genera:**
- Reporte consolidado: `test-reports/consolidated-report-TIMESTAMP.md`
- Dashboard de cobertura: `coverage/lcov-report/index.html`
- Dashboard funcional: `tests/functional/reports/test-report-*.html`

### 📊 Pruebas Individuales

```bash
# Pruebas unitarias
npm test

# Pruebas funcionales (todas con reportes)
npm run test:functional:report

# Solo frontend (no requiere backend)
npm run test:functional:frontend

# Solo backend (requiere backend corriendo)
npm run test:functional:backend

# Solo integración (requiere backend corriendo)
npm run test:functional:integration
```

### ✅ Pruebas Implementadas (9/16 - 56%)

#### Frontend (PF)
- **PF-01**: Validación de formularios (10 tests) - XSS, SQLi, validación HTML5
- **PF-02**: Protección clickjacking (10 tests) - X-Frame-Options, CSP
- **PF-03**: Almacenamiento seguro de tokens (8 tests) - localStorage vs httpOnly cookies
- **PF-04**: Rate limiting visual (9 tests) - Intentos fallidos, CAPTCHA

#### Backend (PB)
- **PB-01**: Hash de contraseñas (9 tests) - bcrypt, Argon2, salt
- **PB-02**: Protección SQL Injection (25+ tests) - Prepared statements, sanitización
- **PB-03**: Política de contraseñas (12 tests) - Complejidad, longitud, diccionario

#### Integración (PIA)
- **PIA-01**: Control de acceso por roles (12 tests) - RBAC, IDOR, privilege escalation
- **PIA-02**: Validación de sesión (15+ tests) - JWT, expiración, manipulación

**Total**: 110+ casos de prueba

### 📚 Documentación Completa

- **[Guía Completa de Tests](docs/testing/GUIA-COMPLETA-TESTS.md)** - ⭐ Todos los scripts explicados
- [Guía de Reportes](docs/testing/GUIA-REPORTES.md) - Sistema de reportes automáticos
- [Resumen Ejecutivo](docs/testing/RESUMEN-EJECUTIVO.md) - Métricas y KPIs
- [Documentos Individuales](docs/testing/) - PF-01, PF-02, PB-01, etc.

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
