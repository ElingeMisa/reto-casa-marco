# Museo MARCO - Aplicación Web

Aplicación web interactiva desarrollada en React + TypeScript para el Museo MARCO, enfocada en promover el arte contemporáneo y proporcionar experiencias virtuales accesibles.

## 📋 Descripción del Proyecto

Este proyecto es parte del curso TC3002C.101 Ciberseguridad Informática II del Tecnológico de Monterrey. La aplicación busca resolver la disminución de visitantes del Museo MARCO mediante una plataforma digital que permite:

- Promover exposiciones y eventos actuales del museo
- Ofrecer recorridos virtuales y experiencias inmersivas
- Facilitar la compra de boletos, membresías y reservaciones
- Integrar un espacio educativo con materiales multimedia
- Crear comunidad mediante interacción digital

## 🎯 Características Principales

### Páginas Implementadas

- **Inicio**: Sección hero con exposiciones destacadas e información rápida
- **Exposiciones**: Vista detallada de exposiciones actuales con tours virtuales
- **Colecciones**: Galería filtrable de artefactos y obras de arte con búsqueda en tiempo real
- **Visita**: Información sobre horarios, precios, ubicación y sistema de reservas interactivo
- **Acerca**: Historia del museo, misión, equipo y opciones de apoyo

### Funcionalidades Interactivas

- ✅ Navegación responsive con menú hamburguesa móvil
- ✅ Filtrado de colecciones por categoría (pinturas, esculturas, artefactos, manuscritos)
- ✅ Búsqueda en tiempo real de colecciones
- ✅ Sistema modal de tours virtuales
- ✅ Formulario de reservas con cálculo automático de precios
- ✅ Diseño totalmente responsive
- ✅ Animaciones suaves y transiciones

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18.2** - Biblioteca de UI
- **TypeScript 4.9** - Tipado estático
- **React Router 6** - Enrutamiento SPA
- **CSS3** - Estilos modernos con Grid y Flexbox

### Seguridad (según especificaciones)
- **Axios** - Cliente HTTP con interceptores de seguridad
- **JWT** - Autenticación mediante tokens
- **HTTPS** - Comunicaciones cifradas
- Implementación de principios de "Security by Design"

### Backend
- **Node.js 18** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL 15** - Base de datos relacional
- **Sequelize** - ORM para PostgreSQL
- **Argon2** - Hashing seguro de contraseñas

### DevOps & Contenedores
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de servicios
- **nginx** - Servidor web para producción
- **OWASP ZAP** - Auditoría de seguridad automatizada

### Herramientas de Desarrollo
- **npm** - Gestión de dependencias
- **ESLint** - Análisis estático de código
- **Prettier** - Formateo de código
- **SonarCloud** - Análisis de calidad (CI/CD)
- **Snyk** - Escaneo de vulnerabilidades

## 📁 Estructura del Proyecto

```
reto-casa-marco/
├── src/                          # Frontend React
│   ├── components/               # Componentes reutilizables
│   ├── pages/                    # Páginas de la aplicación
│   ├── contexts/                 # Contextos de React (Auth, etc.)
│   ├── services/                 # Servicios API
│   ├── styles/                   # Archivos CSS
│   └── App.tsx                   # Componente principal
├── backend/                      # Backend Node.js
│   ├── src/
│   │   ├── config/               # Configuración (DB, etc.)
│   │   ├── controllers/          # Controladores de rutas
│   │   ├── middleware/           # Middlewares (auth, security)
│   │   ├── models/               # Modelos Sequelize
│   │   ├── routes/               # Definición de rutas
│   │   └── server.js             # Punto de entrada
│   ├── database/                 # Scripts de BD
│   └── Dockerfile                # Dockerfile del backend
├── security/                     # Configuración de seguridad
│   └── owasp-zap/                # Configuración OWASP ZAP
│       ├── reports/              # Reportes de auditoría
│       └── *.sh                  # Scripts de escaneo
├── docs/                         # Documentación
│   ├── GUIA_INICIO.md            # Guía de inicio rápido
│   ├── SCRIPTS.md                # Documentación de scripts
│   └── README.md                 # Este archivo
├── Dockerfile                    # Dockerfile del frontend
├── docker-compose.yml            # Orquestación principal
├── docker-compose.security.yml   # Contenedores de seguridad
├── nginx.conf                    # Configuración de nginx
└── package.json                  # Dependencias del frontend
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

**Para Docker (Recomendado):**
- Docker >= 20.0.0
- Docker Compose >= 2.0.0

**Para Desarrollo Local:**
- Node.js >= 16.0.0
- npm >= 8.0.0
- PostgreSQL >= 12

### Opción 1: Ejecución con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/reto-casa-marco.git
cd reto-casa-marco

# Construir e iniciar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Servicios disponibles:**
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5001 |
| Health Check | http://localhost:5001/api/v1/health |

### Opción 2: Ejecución Local (Sin Docker)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/reto-casa-marco.git
cd reto-casa-marco

# Instalar dependencias
npm install
cd backend && npm install && cd ..

# Configurar base de datos
psql postgres -c "CREATE DATABASE museo_marco;"
cd backend
cp .env.example .env
# Editar .env con tus credenciales
npm run db:setup
cd ..

# Iniciar servicios
npm run dev
```

### Comandos Principales

```bash
# Docker
docker-compose up -d --build    # Iniciar contenedores
docker-compose down             # Detener contenedores
docker-compose logs -f          # Ver logs

# Desarrollo Local
npm run dev                     # Iniciar backend + frontend
npm run stop                    # Detener servicios
npm start                       # Solo frontend
npm run backend:start           # Solo backend

# Build & Deploy
npm run build                   # Build de producción
npm run backend:prod            # Backend en producción
```

### Auditoría de Seguridad con OWASP ZAP

```bash
# Escaneo rápido (baseline)
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

# Escaneo completo
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full

# Escaneo de API
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api

# UI interactiva (http://localhost:8080)
docker compose -f docker-compose.yml -f docker-compose.security.yml up owasp-zap-ui
```

Los reportes se generan en `security/owasp-zap/reports/`

## 🔒 Seguridad

El proyecto implementa los siguientes principios de seguridad:

### Security by Design
- Cifrado de datos sensibles en tránsito y en reposo
- Autenticación mediante tokens JWT seguros
- Validación de todas las solicitudes API
- Protección contra inyección SQL y XSS
- Implementación de HTTPS obligatorio

### Pipeline CI/CD
- Análisis estático con SonarCloud (cobertura mínima 80%)
- Escaneo de dependencias con npm audit y Snyk
- Detección de secretos con GitLeaks
- Escaneo de contenedores Docker con Trivy
- Bloqueo automático de integraciones con vulnerabilidades críticas

### Gestión de Secretos
- Uso de variables de entorno (.env)
- .gitignore estricto para evitar commits de credenciales
- Almacenamiento seguro con AWS Secrets Manager o HashiCorp Vault

## 👥 Equipo

**Integrantes:**
- Axel Ariel Grande Ruiz (A01611811)
- Carlos Eugenio Saldaña Tijerina (A01285600)
- Humberto Jasso Silva (A01771184)
- Isaac Hernández Pérez (A01198674)
- Víctor Misael Escalante Alvarado (A01741176)

**Profesor:** Luis Alberto Terrazas

**Materia:** TC3002C.101 Ciberseguridad Informática II

## 📄 Documentación Adicional

Para más detalles sobre requerimientos y diseño, consultar:
- [docs/design/Etapa 1. Requerimientos.pdf](docs/design/Etapa%201.%20Requerimientos.pdf)
- [docs/design/Etapa 2. Diseño.pdf](docs/design/Etapa%202.%20Diseño.pdf)

## 🌐 Compatibilidad de Navegadores

La aplicación es compatible con:
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## 📝 Licencia

Ver archivo [LICENSE](LICENSE) para detalles.

## 🔮 Mejoras Futuras

- [x] ~~Autenticación de usuarios completa~~
- [x] ~~Sistema de códigos promocionales~~
- [x] ~~Contenedorización con Docker~~
- [x] ~~Auditoría de seguridad con OWASP ZAP~~
- [ ] Desarrollo de aplicación móvil nativa (iOS/Android)
- [ ] Integración con pasarelas de pago (Stripe)
- [ ] Tours virtuales 360° con realidad virtual
- [ ] Sistema de gestión de contenido (CMS) para administradores
- [ ] Soporte multiidioma
- [ ] Notificaciones push
- [ ] Integración con redes sociales
- [ ] Sistema de analíticas y métricas

---

**Tecnológico de Monterrey** - 2025
