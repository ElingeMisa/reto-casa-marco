# Documentación Técnica - Museo MARCO

Esta carpeta contiene la documentación técnica y de diseño del proyecto.

## 📚 Contenido

### Documentos de Diseño

- **[Etapa 1. Requerimientos.pdf](design/Etapa%201.%20Requerimientos.pdf)** - Requerimientos funcionales y no funcionales del sistema
- **[Etapa 2. Diseño.pdf](design/Etapa%202.%20Diseño.pdf)** - Arquitectura del sistema, diseño de base de datos, y diseño de interfaces

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por tres componentes principales:

### 1. Aplicación Web (React + TypeScript)
- Frontend SPA desarrollado con React 18
- Enrutamiento con React Router 6
- Tipado estático con TypeScript
- Comunicación segura con API mediante Axios

### 2. Aplicación Intermedia/API (Backend)
- API RESTful para comunicación entre frontend y base de datos
- Autenticación mediante JWT
- Validación y sanitización de datos
- Logging y auditoría de actividades

### 3. Base de Datos (PostgreSQL)
- Almacenamiento seguro de datos
- Cifrado de información sensible
- Backup automático diario

## 🔒 Medidas de Seguridad Implementadas

### Autenticación y Autorización
- JWT (JSON Web Tokens) para sesiones de usuario
- Tokens de corta duración con refresh tokens
- Roles y permisos granulares

### Protección de Datos
- Cifrado de datos en tránsito (HTTPS/TLS)
- Cifrado de datos en reposo
- Hashing de contraseñas con Argon2
- Tokenización de información de pago

### Prevención de Vulnerabilidades
- Validación y sanitización de entradas
- Protección contra inyección SQL mediante queries parametrizadas
- Protección XSS mediante sanitización de HTML
- Rate limiting para prevenir ataques de fuerza bruta
- CORS configurado correctamente

## 📊 Modelo de Base de Datos

Ver diagrama en [Etapa 2. Diseño.pdf](design/Etapa%202.%20Diseño.pdf) para el modelo ER completo.

### Entidades Principales
- **Usuario** - Información de usuarios del sistema
- **Exposición** - Exposiciones del museo
- **Evento** - Eventos y visitas guiadas
- **Ticket** - Boletos para eventos
- **Membresía** - Membresías de usuarios
- **Donación** - Donaciones al museo
- **Orden/Pago** - Sistema de pagos

## 🎨 Diseño de Interfaces

### Principios de Diseño
- Mobile-first approach
- Accesibilidad (WCAG 2.1 nivel AA)
- Diseño responsivo
- Paleta de colores del museo MARCO
- Tipografía legible y moderna

### Páginas Principales
1. **Inicio** - Landing page con exposiciones destacadas
2. **Exposiciones** - Catálogo de exposiciones con tours virtuales
3. **Colecciones** - Galería filtrable de obras
4. **Visita** - Información práctica y sistema de reservas
5. **Acerca** - Historia y misión del museo

## 🔄 Flujos de Usuario

### Flujo de Reserva
1. Usuario selecciona fecha y hora
2. Selecciona tipo y número de boletos
3. Proporciona información de contacto
4. Revisa el total
5. Confirma reserva
6. Recibe confirmación por email

### Flujo de Navegación
1. Usuario accede al sitio
2. Navega por las secciones mediante menú
3. Filtra/busca contenido de interés
4. Accede a detalles específicos
5. Realiza acciones (reservar, donar, etc.)

## 🧪 Pruebas

### Tipos de Pruebas
- **Unitarias** - Componentes y funciones individuales
- **Integración** - Interacción entre componentes
- **E2E** - Flujos completos de usuario
- **Seguridad** - Penetration testing y análisis de vulnerabilidades

### Cobertura Mínima
- 80% de cobertura de código (exigido por CI/CD)
- 100% de casos de uso críticos cubiertos

## 📈 Pipeline CI/CD

### Etapas del Pipeline
1. **Análisis estático** - SonarCloud
2. **Pruebas** - Jest + React Testing Library
3. **Escaneo de dependencias** - npm audit + Snyk
4. **Detección de secretos** - GitLeaks
5. **Build** - Construcción optimizada
6. **Despliegue** - Automático a staging/producción

## 📖 Guías de Desarrollo

### Configuración del Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en desarrollo
npm start
```

### Convenciones de Código
- Seguir guía de estilo de TypeScript
- Usar ESLint y Prettier
- Commits convencionales (Conventional Commits)
- Nombres de variables en español para el dominio
- Nombres técnicos en inglés

### Git Workflow
- Main branch protegida
- Feature branches desde main
- Pull requests con revisión de código
- CI/CD debe pasar antes de merge

## 🚀 Despliegue

### Ambientes
- **Desarrollo** - Local
- **Staging** - Pre-producción
- **Producción** - Ambiente productivo

### Proceso de Despliegue
1. Merge a main activa el pipeline
2. Tests y análisis de seguridad
3. Build automático
4. Despliegue a staging
5. Verificación manual
6. Despliegue a producción

## 📞 Contacto

Para consultas sobre la documentación técnica, contactar al equipo de desarrollo.

---

**Última actualización:** Noviembre 2025
