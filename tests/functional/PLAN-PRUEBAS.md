# Plan de Pruebas Funcionales - Museo MARCO

Este documento mapea las pruebas implementadas con el plan de pruebas documentado en `docs/design/pruebas de página.pdf`.

## Estado de Implementación

### ✅ Pruebas de Frontend (PF)

| ID | Descripción | Estado | Archivo |
|----|--------------|---------| ---------|
| PF-01 | Validación de campos de entrada en formulario de login | ✅ Implementado | `frontend/PF-01-validacion-formulario-login.test.tsx` |
| PF-02 | Protección contra ataques de clickjacking | ⏳ Pendiente | - |
| PF-03 | Almacenamiento seguro de tokens en cliente | ✅ Implementado | `frontend/PF-03-almacenamiento-tokens.test.ts` |
| PF-04 | Implementación de rate limiting visual | ⏳ Pendiente | - |
| PF-05 | Validación de certificados SSL/TLS en app móvil | ⏳ Pendiente | - |

### ✅ Pruebas de Backend (PB)

| ID | Descripción | Estado | Archivo |
|----|--------------|---------| ---------|
| PB-01 | Implementación de hash seguro de contraseñas | ⏳ Pendiente | - |
| PB-02 | Protección contra SQL Injection | ✅ Implementado | `backend/PB-02-sql-injection.test.ts` |
| PB-03 | Implementación de política de contraseñas robusta | ⏳ Pendiente | - |
| PB-04 | Validación de expiración y renovación de tokens | ⏳ Pendiente | - |
| PB-05 | Protección contra ataques de fuerza bruta | ⏳ Pendiente | - |

### ✅ Pruebas de Integridad, Autenticación y Acceso (PIA)

| ID | Descripción | Estado | Archivo |
|----|--------------|---------| ---------|
| PIA-01 | Verificación de control de acceso basado en roles | ✅ Implementado | `integration/PIA-01-control-acceso-roles.test.ts` |
| PIA-02 | Validación de sesión en cada petición | ✅ Implementado | `integration/PIA-02-validacion-sesion.test.ts` |
| PIA-03 | Protección contra CSRF | ⏳ Pendiente | - |
| PIA-05 | Validación de integridad de tokens JWT | ⏳ Pendiente | - |
| PIA-07 | Auditoría y logging de intentos de autenticación | ⏳ Pendiente | - |

## Vulnerabilidades Detectadas

### 🔴 Críticas

1. **PF-03**: Tokens almacenados en `localStorage` (vulnerable a XSS)
   - **Impacto**: Alto
   - **Recomendación**: Migrar a httpOnly cookies
   - **Archivo**: `frontend/PF-03-almacenamiento-tokens.test.ts`

### 🟡 Medias

2. **PB-02**: Posible exposición de detalles SQL en errores
   - **Impacto**: Medio
   - **Recomendación**: Sanitizar mensajes de error
   - **Archivo**: `backend/PB-02-sql-injection.test.ts`

## Remediaciones Implementadas

### Del PDF (Página 8-9)

#### ✅ Insufficient Cryptography

**A. Contraseñas: hashing correcto**
- Implementación requerida: bcrypt/Argon2id con salt
- Prueba relacionada: PB-01 (pendiente)

**B. Cifrado de datos sensibles**
- AES-256-GCM para datos en reposo
- Gestión de claves con Vault/KMS
- Prueba relacionada: Implementación pendiente

**C. Protección en tránsito**
- TLS 1.2+ con HSTS
- Redirección HTTPS obligatoria
- Prueba relacionada: PF-02, PF-05

#### ✅ SQL Injection

**A. Consultas parametrizadas**
- ✅ Pruebas implementadas: PB-02
- Verificación de prepared statements
- Rechazo de payloads maliciosos

**B. Validación en backend**
- Allowlists para inputs
- Control de IDOR
- Prueba relacionada: PIA-01

**C. Endurecimiento de BD**
- Principio de mínimos privilegios
- Manejo seguro de errores
- Prueba relacionada: PB-02

## Cobertura OWASP Top 10

| Vulnerabilidad OWASP | Pruebas Relacionadas | Estado |
|----------------------|----------------------|--------|
| A01: Broken Access Control | PIA-01, PIA-02 | ✅ Parcial |
| A02: Cryptographic Failures | PF-03, PB-01 | ⏳ Pendiente |
| A03: Injection | PB-02, PF-01 | ✅ Implementado |
| A05: Security Misconfiguration | PF-02 | ⏳ Pendiente |
| A07: Authentication Failures | PF-01, PF-04, PB-05, PIA-02 | ✅ Parcial |
| A09: Security Logging Failures | PIA-07 | ⏳ Pendiente |

## Próximos Pasos

### Prioridad Alta 🔴

1. **Implementar PB-01**: Hash seguro de contraseñas
   - Verificar uso de bcrypt o Argon2
   - Validar salting correcto

2. **Implementar PF-02**: Protección clickjacking
   - Verificar headers X-Frame-Options
   - Verificar CSP frame-ancestors

3. **Implementar PIA-03**: Protección CSRF
   - Tokens CSRF en formularios
   - Validación en backend

### Prioridad Media 🟡

4. **Implementar PB-05**: Rate limiting
   - Bloqueo de IPs después de intentos fallidos
   - Backoff exponencial

5. **Implementar PIA-07**: Logging de auditoría
   - Registro de intentos de autenticación
   - Análisis forense

### Prioridad Baja 🟢

6. **Implementar PF-04**: Rate limiting visual
   - CAPTCHA después de intentos fallidos
   - Feedback al usuario

7. **Documentación adicional**
   - Guías de remediación
   - Procedimientos de respuesta a incidentes

## Métricas de Calidad

### Objetivo
- **Cobertura**: 80%+ de código crítico
- **Pruebas pasadas**: 100%
- **Vulnerabilidades críticas**: 0

### Actual
- **Pruebas implementadas**: 5 / 16 (31%)
- **Cobertura frontend**: Por determinar
- **Cobertura backend**: Por determinar

## Ejecución de Pruebas

```bash
# Todas las pruebas funcionales
npm run test:functional

# Por categoría
npm run test:functional:frontend
npm run test:functional:backend
npm run test:functional:integration

# Con cobertura
npm run test:functional:coverage
```

## Referencias

- Plan de Pruebas: `docs/design/pruebas de página.pdf`
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Mobile Top 10: https://owasp.org/www-project-mobile-top-10/
- Remediaciones: Página 8-9 del plan de pruebas
