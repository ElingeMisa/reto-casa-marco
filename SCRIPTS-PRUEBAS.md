# 📋 Guía Rápida de Scripts de Pruebas

## 🎯 Comando Recomendado

```bash
npm run test:all
```

Ejecuta TODAS las pruebas del proyecto en un solo comando.

---

## 📊 Todos los Scripts Disponibles

### 🚀 Scripts Principales

| Comando | Descripción | Duración | Requiere Backend |
|---------|-------------|----------|------------------|
| `npm run test:all` | ⭐ **TODAS LAS PRUEBAS** (unitarias + funcionales + seguridad + lint) | 30-60s | No* |
| `npm run verify` | Alias de test:all | 30-60s | No* |
| `npm test` | Pruebas unitarias React + cobertura | 5-10s | No |
| `npm run test:functional:report` | Pruebas funcionales con reportes completos | 15-30s | No* |

*Salta pruebas backend/integración si el servidor no está disponible

### 🧪 Pruebas Funcionales por Categoría

| Comando | Qué Prueba | Requiere Backend |
|---------|------------|------------------|
| `npm run test:functional` | Todas (sin reportes, más rápido) | No* |
| `npm run test:functional:frontend` | Solo frontend (validación, clickjacking, tokens, rate limiting) | No |
| `npm run test:functional:backend` | Solo backend (passwords, SQL injection, políticas) | ✅ Sí |
| `npm run test:functional:integration` | Solo integración (roles, sesiones, autenticación) | ✅ Sí |
| `npm run test:functional:coverage` | Todas con análisis de cobertura | No* |

### 🔒 Auditorías de Seguridad

| Comando | Descripción | Duración |
|---------|-------------|----------|
| `npm run security:audit` | Vulnerabilidades en dependencias (npm audit) | 5s |
| `npm run security:snyk` | Análisis Snyk (requiere cuenta) | 10s |
| `npm run security:secrets` | Buscar credenciales hardcodeadas (gitleaks) | 5s |
| `npm run audit:baseline` | OWASP ZAP baseline scan | 30s |
| `npm run audit:api` | OWASP ZAP API scan | 60s |
| `npm run audit:full` | OWASP ZAP full scan | 5-10m |

### 🎨 Calidad de Código

| Comando | Descripción | Duración |
|---------|-------------|----------|
| `npm run lint` | Analizar código con ESLint | 5s |
| `npm run format` | Formatear código con Prettier | 3s |

---

## 🎯 Cuándo Usar Cada Script

### Durante Desarrollo

```bash
# Mientras desarrollas (modo watch)
npm test -- --watch

# Antes de commit
npm run lint
npm run test:functional:frontend
```

### Antes de Pull Request

```bash
# Verificación completa
npm run test:all
```

### Antes de Deploy

```bash
# Suite completa + auditorías
npm run test:all
npm run security:audit
npm run audit:baseline
```

### Solo Verificar Seguridad

```bash
npm run security:audit
npm run security:secrets
```

### CI/CD Pipeline

```bash
npm run test:all
```

---

## 📁 Dónde se Guardan los Reportes

```
proyecto/
├── test-reports/                    # npm run test:all
│   └── consolidated-report-*.md     # 👈 Reporte principal
│
├── coverage/                        # npm test
│   └── lcov-report/index.html       # 👈 Dashboard cobertura
│
└── tests/functional/reports/        # npm run test:functional:report
    ├── latest-summary.md            # 👈 Resumen funcional
    └── test-report-*.html           # 👈 Dashboard interactivo
```

---

## 🔍 Ver Reportes Generados

```bash
# Reporte consolidado
cat test-reports/consolidated-report-*.md

# Dashboard de cobertura
open coverage/lcov-report/index.html

# Dashboard funcional
open tests/functional/reports/test-report-*.html

# Último resumen funcional
cat tests/functional/reports/latest-summary.md
```

---

## ⚡ Comandos Rápidos

```bash
# Quick check (5-10s)
npm test -- --watchAll=false && npm run lint

# Verificación media (15-20s)
npm run test:functional:report

# Verificación completa (30-60s)
npm run test:all

# Solo seguridad (10s)
npm run security:audit && npm run security:secrets

# Limpiar reportes antiguos
rm -rf test-reports/* tests/functional/reports/* coverage/
```

---

## 🚨 Troubleshooting Rápido

### Backend no disponible

```bash
# Opción 1: Iniciar backend
npm run backend:start

# Opción 2: Solo frontend
npm run test:functional:frontend
```

### Tests en modo watch infinito

```bash
# Una sola ejecución
CI=true npm test
```

### Permisos denegados

```bash
chmod +x run-all-tests.sh
chmod +x tests/functional/run-tests.sh
chmod +x tests/functional/generate-reports.sh
```

---

## 📚 Más Información

- **Guía Completa**: [docs/testing/GUIA-COMPLETA-TESTS.md](docs/testing/GUIA-COMPLETA-TESTS.md)
- **Guía de Reportes**: [docs/testing/GUIA-REPORTES.md](docs/testing/GUIA-REPORTES.md)
- **README Principal**: [README.md](README.md)

---

## ✅ Checklist Pre-Commit

- [ ] `npm run lint` (sin errores)
- [ ] `npm run test:functional:frontend` (todos pasan)
- [ ] `npm run test:all` (verificación completa)
- [ ] Revisar reporte consolidado
- [ ] Cobertura >80% (idealmente)

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run test:all` (100% pasando)
- [ ] `npm run security:audit` (sin vulnerabilidades críticas)
- [ ] `npm run audit:baseline` (sin alertas altas)
- [ ] `npm run build` (compila sin errores)
- [ ] Revisar todos los reportes

---

**Última actualización**: 2025-11-26
