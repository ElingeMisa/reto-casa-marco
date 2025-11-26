# Pruebas Funcionales - Museo MARCO

Este directorio contiene las pruebas funcionales basadas en el plan de pruebas documentado en `docs/design/pruebas de página.pdf`.

## Estructura

```
tests/functional/
├── frontend/          # Pruebas de Frontend (PF-01 a PF-05)
├── backend/           # Pruebas de Backend (PB-01 a PB-05)
├── integration/       # Pruebas de Integración y Acceso (PIA-01 a PIA-07)
├── helpers/           # Utilidades y helpers para pruebas
├── fixtures/          # Datos de prueba
└── README.md         # Esta documentación
```

## Categorías de Pruebas

### Pruebas de Frontend (PF)
- **PF-01**: Validación de campos de entrada en formulario de login
- **PF-02**: Protección contra ataques de clickjacking
- **PF-03**: Almacenamiento seguro de tokens en cliente
- **PF-04**: Implementación de rate limiting visual
- **PF-05**: Validación de certificados SSL/TLS

### Pruebas de Backend (PB)
- **PB-01**: Implementación de hash seguro de contraseñas
- **PB-02**: Protección contra SQL Injection
- **PB-03**: Implementación de política de contraseñas robusta
- **PB-04**: Validación de expiración y renovación de tokens
- **PB-05**: Protección contra ataques de fuerza bruta

### Pruebas de Integridad, Autenticación y Acceso (PIA)
- **PIA-01**: Verificación de control de acceso basado en roles
- **PIA-02**: Validación de sesión en cada petición
- **PIA-03**: Protección contra CSRF
- **PIA-05**: Validación de integridad de tokens JWT
- **PIA-07**: Auditoría y logging de intentos de autenticación

## Ejecutar Pruebas

### Todas las pruebas funcionales
```bash
npm run test:functional
```

### Solo pruebas de frontend
```bash
npm run test:functional:frontend
```

### Solo pruebas de backend
```bash
npm run test:functional:backend
```

### Solo pruebas de integración
```bash
npm run test:functional:integration
```

### Con cobertura
```bash
npm run test:functional:coverage
```

## Requisitos

- Node.js >= 16
- Backend corriendo en http://localhost:5001
- Frontend corriendo en http://localhost:3000 (para pruebas E2E)

## Notas de Seguridad

Estas pruebas están diseñadas para verificar vulnerabilidades OWASP Top 10 y mejores prácticas de seguridad.

**IMPORTANTE**: Las pruebas de penetración (como SQL injection) solo deben ejecutarse en entornos de desarrollo/prueba, nunca en producción.
