# Guía Completa de Scripts de Pruebas - Museo MARCO

## 📋 Índice de Scripts

Esta guía describe todos los scripts de pruebas disponibles en el proyecto y cuándo usar cada uno.

---

## 🎯 Script Maestro (Recomendado)

### `npm run test:all` o `npm run verify`

**Ejecuta TODAS las pruebas del proyecto** en un solo comando.

```bash
npm run test:all
# o
npm run verify
```

**Qué hace:**
1. ✅ Pruebas unitarias (React + cobertura)
2. ✅ Pruebas funcionales (Frontend + Backend + Integración)
3. ✅ Auditoría de seguridad (npm audit)
4. ✅ Lint y calidad de código (ESLint)
5. ✅ Genera reporte consolidado en `test-reports/`

**Cuándo usar:**
- ✅ **Antes de hacer commit** (verificación completa)
- ✅ **Antes de crear un PR** (validación exhaustiva)
- ✅ **En CI/CD** (pipeline de integración continua)
- ✅ **Verificación diaria** (health check del proyecto)
- ✅ **Antes de deploy** (asegurar calidad)

**Salida:**
- Reporte consolidado: `test-reports/consolidated-report-TIMESTAMP.md`
- Cobertura HTML: `coverage/lcov-report/index.html`
- Dashboard funcional: `tests/functional/reports/test-report-*.html`
- Logs individuales por categoría

**Duración aproximada:** 30-60 segundos (dependiendo del proyecto)

---

## 🔬 Pruebas Unitarias

### `npm test`

Ejecuta las pruebas unitarias de React con cobertura.

```bash
npm test
```

**Qué prueba:**
- Componentes de React
- Utilidades y helpers
- Hooks personalizados
- Servicios

**Cuándo usar:**
- Durante desarrollo de componentes
- TDD (Test-Driven Development)
- Verificación rápida de cambios

**Salida:**
- Reporte de cobertura en `coverage/`
- Modo watch (ejecuta automáticamente al cambiar archivos)

---

## 🧪 Pruebas Funcionales

### 1. Todas las pruebas funcionales

```bash
npm run test:functional:report
```

**Qué hace:**
- Ejecuta Frontend + Backend + Integración
- Genera reportes en múltiples formatos (MD, HTML, JSON)
- Crea dashboard interactivo

**Cuándo usar:**
- Verificar funcionalidad end-to-end
- Antes de hacer release
- Validar requisitos OWASP

### 2. Solo Frontend

```bash
npm run test:functional:frontend
```

**Qué prueba:**
- Validación de formularios
- Protección clickjacking
- Almacenamiento de tokens
- Rate limiting visual

**Cuándo usar:**
- Cambios en UI/UX
- No tienes backend corriendo
- Desarrollo frontend aislado

### 3. Solo Backend

```bash
npm run test:functional:backend
```

**Qué prueba:**
- Hash de contraseñas
- Protección SQL Injection
- Política de contraseñas
- APIs del servidor

**Cuándo usar:**
- Cambios en endpoints
- Desarrollo backend
- **Requiere:** Backend corriendo en http://localhost:5001

### 4. Solo Integración

```bash
npm run test:functional:integration
```

**Qué prueba:**
- Control de acceso por roles
- Validación de sesiones
- Autenticación end-to-end
- Flujos completos usuario-servidor

**Cuándo usar:**
- Cambios en autenticación
- Testing de flujos completos
- **Requiere:** Backend + Frontend corriendo

### 5. Sin reportes (rápido)

```bash
npm run test:functional
```

Ejecuta todas las pruebas funcionales sin generar reportes (más rápido).

### 6. Con cobertura

```bash
npm run test:functional:coverage
```

Ejecuta pruebas funcionales con análisis de cobertura de código.

---

## 🔒 Auditorías de Seguridad

### 1. Auditoría npm

```bash
npm run security:audit
```

Detecta vulnerabilidades en dependencias de producción.

### 2. Snyk (requiere instalación)

```bash
npm run security:snyk
```

Análisis avanzado de vulnerabilidades con Snyk.

### 3. Búsqueda de secretos

```bash
npm run security:secrets
```

Detecta credenciales hardcodeadas con gitleaks.

### 4. OWASP ZAP

```bash
npm run audit:baseline
npm run audit:api
npm run audit:full
```

Escaneo de seguridad OWASP ZAP (requiere backend corriendo).

---

## 🎨 Calidad de Código

### 1. Lint

```bash
npm run lint
```

Analiza código con ESLint (detecta errores y malas prácticas).

### 2. Formato

```bash
npm run format
```

Formatea código con Prettier.

---

## 📊 Comparación de Scripts

| Script | Duración | Requiere Backend | Genera Reportes | Cobertura | Uso Recomendado |
|--------|----------|------------------|-----------------|-----------|-----------------|
| `npm run test:all` | 30-60s | No* | ✅ Consolidado | ✅ | Pre-commit, CI/CD |
| `npm test` | 5-10s | No | ✅ Cobertura | ✅ | Desarrollo |
| `npm run test:functional:report` | 15-30s | No* | ✅ Múltiples | ❌ | Validación funcional |
| `npm run test:functional:frontend` | 5-10s | No | ❌ | ❌ | Dev frontend |
| `npm run test:functional:backend` | 5-10s | ✅ Sí | ❌ | ❌ | Dev backend |
| `npm run security:audit` | 5s | No | ✅ JSON | ❌ | Verificar deps |
| `npm run lint` | 5s | No | ❌ | ❌ | Calidad código |

*Salta pruebas backend/integración si el servidor no está disponible

---

## 🚀 Flujos de Trabajo Recomendados

### 1. Desarrollo Diario

```bash
# Durante desarrollo de features
npm test -- --watch

# Antes de commit
npm run lint
npm run test:functional:frontend

# Verificación final
npm run test:all
```

### 2. Antes de Pull Request

```bash
# Ejecutar suite completa
npm run test:all

# Revisar reportes
cat test-reports/consolidated-report-*.md
open coverage/lcov-report/index.html
open tests/functional/reports/test-report-*.html
```

### 3. Antes de Deploy

```bash
# Verificación exhaustiva
npm run test:all
npm run security:audit
npm run audit:baseline

# Build
npm run build
```

### 4. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
- name: Run all tests
  run: npm run test:all

- name: Upload reports
  uses: actions/upload-artifact@v2
  with:
    name: test-reports
    path: |
      test-reports/
      coverage/
      tests/functional/reports/
```

---

## 📁 Estructura de Reportes

```
proyecto/
├── test-reports/                    # Reportes consolidados (npm run test:all)
│   ├── consolidated-report-*.md     # Resumen completo
│   ├── unit-tests-*.log             # Log pruebas unitarias
│   ├── functional-tests-*.log       # Log pruebas funcionales
│   ├── npm-audit-*.json             # Reporte auditoría
│   └── lint-*.log                   # Log lint
│
├── coverage/                        # Cobertura pruebas unitarias
│   └── lcov-report/index.html       # Dashboard visual
│
└── tests/functional/reports/        # Reportes funcionales
    ├── latest-summary.md            # Resumen actualizado
    ├── test-report-*.html           # Dashboard interactivo
    ├── *-jest-*.json                # Datos Jest
    └── *-output-*.txt               # Logs detallados
```

---

## 🔧 Configuración y Personalización

### Modificar el Script Maestro

Edita `run-all-tests.sh` para:

```bash
# Deshabilitar una sección (comentar)
# print_section "4/4 - Verificando Lint (ESLint)"
# ... código del lint ...

# Agregar nueva categoría
print_section "5/5 - E2E Tests (Cypress)"
# ... tu código ...

# Cambiar comportamiento de errores
set -e  # Salir al primer error
# o
set +e  # Continuar aunque haya errores
```

### Variables de Entorno

```bash
# Directorio de reportes personalizado
export REPORTS_DIR="custom/reports"

# CI mode (sin interacción)
export CI=true

npm run test:all
```

---

## 🐛 Troubleshooting

### Problema: Backend no disponible

```
⚠ Backend no disponible (pruebas backend/integración se saltarán)
```

**Solución:**

```bash
# Opción 1: Iniciar backend
npm run backend:start

# Opción 2: Usar Docker
npm run docker:start

# Opción 3: Solo frontend
npm run test:functional:frontend
```

### Problema: Tests unitarios en modo watch

```
Tests keep running in watch mode
```

**Solución:**

```bash
# En desarrollo (watch mode)
npm test

# Una sola ejecución
CI=true npm test
```

### Problema: Permisos denegados

```
Permission denied: ./run-all-tests.sh
```

**Solución:**

```bash
chmod +x run-all-tests.sh
chmod +x tests/functional/run-tests.sh
chmod +x tests/functional/generate-reports.sh
```

### Problema: Out of memory

```
JavaScript heap out of memory
```

**Solución:**

```bash
# Aumentar memoria de Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run test:all
```

---

## 📈 Métricas y KPIs

### Seguimiento de Calidad

```bash
# Ver tendencia de cobertura
grep "All files" test-reports/unit-tests-*.log | tail -5

# Ver historial de vulnerabilidades
jq '.metadata.vulnerabilities' test-reports/npm-audit-*.json

# Comparar reportes
diff test-reports/consolidated-report-20251125*.md \
     test-reports/consolidated-report-20251126*.md
```

### Dashboard de Métricas

Crea un script para rastrear métricas en el tiempo:

```bash
#!/bin/bash
# scripts/metrics-dashboard.sh

echo "Fecha,Tests,Cobertura,Vulnerabilidades,Errores Lint" > metrics.csv

for report in test-reports/consolidated-report-*.md; do
    date=$(grep "Fecha:" "$report" | cut -d: -f2-)
    tests=$(grep -c "✅ Pasadas" "$report")
    # ... extraer más métricas
    echo "$date,$tests,..." >> metrics.csv
done
```

---

## 💡 Mejores Prácticas

### ✅ DO (Hacer)

- Ejecutar `npm run test:all` antes de cada commit importante
- Revisar cobertura de código regularmente (objetivo: >80%)
- Mantener todas las pruebas en verde
- Actualizar tests al cambiar funcionalidad
- Integrar en CI/CD desde el inicio
- Revisar vulnerabilidades semanalmente

### ❌ DON'T (No Hacer)

- Hacer commit con tests fallando
- Ignorar warnings de seguridad
- Deshabilitar tests que fallan ("comentar temporalmente")
- Hacer push sin ejecutar test:all
- Ignorar baja cobertura de código
- Saltarse lint

---

## 🔗 Comandos Rápidos

```bash
# Quick check (desarrollo)
npm test && npm run lint

# Full verification (pre-commit)
npm run test:all

# Ver último reporte
cat test-reports/consolidated-report-*.md | tail -100

# Abrir dashboards
open coverage/lcov-report/index.html
open tests/functional/reports/test-report-*.html

# Limpiar reportes antiguos
rm -rf test-reports/* tests/functional/reports/* coverage/

# Solo seguridad
npm run security:audit && npm run security:secrets
```

---

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

## 🎓 Capacitación del Equipo

### Para Nuevos Desarrolladores

1. Lee esta guía completa
2. Ejecuta cada script individualmente para entender qué hace
3. Revisa los reportes generados
4. Integra `npm run test:all` en tu flujo de trabajo

### Para QA/Testers

1. Usa `npm run test:functional:report` para validaciones
2. Revisa dashboards HTML para presentaciones
3. Usa reportes JSON para automatizaciones

### Para DevOps

1. Integra `npm run test:all` en CI/CD
2. Configura artifacts para reportes
3. Establece quality gates basados en cobertura/vulnerabilidades

---

*Última actualización: 2025-11-26*
