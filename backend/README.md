# Backend API - Museo MARCO

API REST segura para la aplicación del Museo MARCO con autenticación JWT, gestión de usuarios y simulación de pagos.

## 🔒 Características de Seguridad

- **Autenticación JWT** con tokens seguros
- **Hashing de contraseñas** con Argon2
- **Rate Limiting** para prevenir ataques de fuerza bruta
- **Helmet** para headers de seguridad HTTP
- **Validación y sanitización** de todas las entradas
- **CORS** configurado
- **Transacciones atómicas** en PostgreSQL
- **Logging** de actividades

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- PostgreSQL >= 12
- npm >= 8.0.0

## 🚀 Instalación

1. **Navegar al directorio del backend:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Crear la base de datos en PostgreSQL:**
```sql
CREATE DATABASE museo_marco;
```

5. **Configurar las tablas:**
```bash
npm run db:setup
```

6. **Poblar con datos de prueba (opcional):**
```bash
npm run db:seed
```

## 🎯 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:5001`

**Nota:** En macOS, el puerto 5000 está ocupado por AirPlay Receiver. Por eso usamos el puerto 5001.

## 📡 Endpoints de la API

### Autenticación

#### Registro
```http
POST /api/v1/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "Segura123"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "Segura123"
}
```

#### Obtener Perfil
```http
GET /api/v1/auth/perfil
Authorization: Bearer {token}
```

### Gestión de Saldo

#### Recargar Saldo
```http
POST /api/v1/saldo/recargar
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto": 500.00,
  "metodo_pago": "tarjeta"
}
```

#### Obtener Historial
```http
GET /api/v1/saldo/historial?limite=10&pagina=1
Authorization: Bearer {token}
```

### Órdenes

#### Crear Orden (Compra)
```http
POST /api/v1/ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_orden": "evento",
  "total": 45.00,
  "detalles": {
    "adultos": 2,
    "estudiantes": 1,
    "evento": "Expo Renacimiento"
  },
  "fecha_evento": "2025-12-15"
}
```

#### Obtener Órdenes
```http
GET /api/v1/ordenes
Authorization: Bearer {token}
```

## 🗄️ Estructura de Base de Datos

### Tabla: usuarios
- `id` - INTEGER (PK)
- `nombre` - VARCHAR(100)
- `email` - VARCHAR(255) UNIQUE
- `password` - VARCHAR(255) (hasheado con Argon2)
- `saldo` - DECIMAL(10,2)
- `rol` - ENUM('usuario', 'administrador')
- `activo` - BOOLEAN
- `ultimo_acceso` - TIMESTAMP
- `creado_en` - TIMESTAMP
- `actualizado_en` - TIMESTAMP

### Tabla: transacciones
- `id` - INTEGER (PK)
- `usuario_id` - INTEGER (FK)
- `tipo` - ENUM('recarga', 'compra', 'reembolso')
- `monto` - DECIMAL(10,2)
- `saldo_anterior` - DECIMAL(10,2)
- `saldo_nuevo` - DECIMAL(10,2)
- `descripcion` - VARCHAR(255)
- `orden_id` - INTEGER (FK, nullable)
- `metodo_pago` - VARCHAR(50)
- `creado_en` - TIMESTAMP

### Tabla: ordenes
- `id` - INTEGER (PK)
- `usuario_id` - INTEGER (FK)
- `tipo_orden` - ENUM('evento', 'membresia', 'donacion')
- `total` - DECIMAL(10,2)
- `estado` - ENUM('pendiente', 'pagado', 'cancelado', 'reembolsado')
- `detalles` - JSONB
- `fecha_evento` - TIMESTAMP
- `creado_en` - TIMESTAMP
- `actualizado_en` - TIMESTAMP

## 🔐 Credenciales de Prueba

Después de ejecutar `npm run db:seed`:

- **Usuario**: demo@museomarco.com / Demo12345
- **Admin**: admin@museomarco.com / Admin12345

## 📝 Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm run db:setup   # Crear tablas de base de datos
npm run db:seed    # Poblar con datos de prueba
npm test           # Ejecutar pruebas
```

## 🛡️ Seguridad

- Contraseñas hasheadas con Argon2id
- Tokens JWT con expiración
- Rate limiting en endpoints sensibles
- Validación de entrada con express-validator
- Sanitización de datos
- Headers de seguridad con Helmet
- Transacciones atómicas para integridad de datos
- Locks en base de datos para evitar race conditions

## 📊 Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `409` - Conflict (recurso ya existe)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 🤝 Integración con Frontend

El frontend debe:
1. Guardar el token JWT en localStorage después del login
2. Incluir el token en cada petición: `Authorization: Bearer {token}`
3. Manejar errores 401 (redirigir a login)
4. Actualizar el saldo del usuario después de cada transacción

---

**Tecnológico de Monterrey** - 2025
