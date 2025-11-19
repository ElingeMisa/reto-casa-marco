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

### Herramientas de Desarrollo
- **npm/yarn** - Gestión de dependencias
- **ESLint** - Análisis estático de código
- **Prettier** - Formateo de código
- **SonarCloud** - Análisis de calidad (CI/CD)
- **Snyk** - Escaneo de vulnerabilidades

## 📁 Estructura del Proyecto

```
reto-casa-marco/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Inicio.tsx
│   │   ├── Exposiciones.tsx
│   │   ├── Colecciones.tsx
│   │   ├── Visita.tsx
│   │   └── Acerca.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   ├── index.css
│   │   ├── App.css
│   │   └── [component].css
│   ├── App.tsx
│   └── index.tsx
├── docs/
│   ├── design/
│   │   ├── Etapa 1. Requerimientos.pdf
│   │   └── Etapa 2. Diseño.pdf
│   └── README.md
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/reto-casa-marco.git

# Navegar al directorio
cd reto-casa-marco

# Instalar dependencias
npm install
```

### Ejecución en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# La aplicación se abrirá en http://localhost:3000
```

### Construcción para Producción

```bash
# Crear build optimizado
npm run build

# El build estará en la carpeta /build
```

### Scripts Disponibles

```bash
npm start          # Inicia servidor de desarrollo
npm test          # Ejecuta pruebas con cobertura
npm run build     # Construye para producción
npm run lint      # Ejecuta ESLint
npm run format    # Formatea código con Prettier
npm run security:audit  # Auditoría de seguridad
```

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

- [ ] Desarrollo de aplicación móvil nativa (iOS/Android)
- [ ] Integración con pasarelas de pago
- [ ] Tours virtuales 360° con realidad virtual
- [ ] Sistema de gestión de contenido (CMS) para administradores
- [ ] Autenticación de usuarios completa
- [ ] Soporte multiidioma
- [ ] Notificaciones push
- [ ] Integración con redes sociales
- [ ] Sistema de analíticas y métricas

---

**Tecnológico de Monterrey** - 2025
