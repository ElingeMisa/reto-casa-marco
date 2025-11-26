# Guía de Generación de Reportes - Pruebas Funcionales

## 📋 Descripción

El sistema de pruebas funcionales incluye un generador automático de reportes que ejecuta todas las pruebas y crea documentos en múltiples formatos para diferentes audiencias.

## 🚀 Uso Rápido

```bash
# Generar reportes completos
npm run test:functional:report

# O directamente
./tests/functional/generate-reports.sh
```

## 📊 Reportes Generados

### 1. Resumen Ejecutivo (Markdown)

**Ubicación**: `tests/functional/reports/latest-summary.md`

**Contenido**:
- Fecha y usuario de ejecución
- Resumen por categoría (Frontend, Backend, Integración)
- Estadísticas de tests (total, pasados, fallidos)
- Duración de ejecución
- Links a reportes detallados
- Próximos pasos recomendados

**Ideal para**:
- ✅ Desarrolladores
- ✅ Pull Requests
- ✅ Documentación del proyecto

### 2. Reporte HTML Interactivo

**Ubicación**: `tests/functional/reports/test-report-YYYYMMDD_HHMMSS.html`

**Contenido**:
- Dashboard visual con tarjetas de estadísticas
- Tabla interactiva de resultados
- Código con colores
- Diseño responsive

**Ideal para**:
- ✅ Presentaciones
- ✅ Management
- ✅ Stakeholders no técnicos

**Abrir en navegador**:
```bash
open tests/functional/reports/test-report-*.html
```

### 3. Reportes JSON (Jest)

**Ubicación**: `tests/functional/reports/*-jest-TIMESTAMP.json`

**Contenido**:
- Resultados completos de Jest
- Tiempos de ejecución
- Stack traces de errores
- Metadata de tests

**Ideal para**:
- ✅ CI/CD pipelines
- ✅ Integración con herramientas
- ✅ Análisis automático

### 4. Logs de Salida

**Ubicación**: `tests/functional/reports/*-output-TIMESTAMP.txt`

**Contenido**:
- Output completo de consola
- Mensajes de info/warning
- Detalles de ejecución

**Ideal para**:
- ✅ Debugging
- ✅ Auditoría
- ✅ Análisis detallado

## 📁 Estructura de Reportes

```
tests/functional/reports/
├── latest-summary.md                    # Último resumen (siempre actualizado)
├── test-report-20251126_143022.html    # Reporte HTML con timestamp
├── test-report-20251126_143022.txt     # Reporte texto con timestamp
├── frontend-jest-20251126_143022.json  # Resultados Jest frontend
├── backend-jest-20251126_143022.json   # Resultados Jest backend
├── integration-jest-20251126_143022.json # Resultados Jest integración
├── frontend-output-20251126_143022.txt  # Log frontend
├── backend-output-20251126_143022.txt   # Log backend
└── integration-output-20251126_143022.txt # Log integración
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Opcional: Configurar directorio de reportes
export REPORTS_DIR="custom/path/to/reports"

# Ejecutar
./tests/functional/generate-reports.sh
```

### Personalización

Editar `tests/functional/generate-reports.sh`:

```bash
# Cambiar formato de fecha
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")  # Actual
TIMESTAMP=$(date +"%Y-%m-%d")        # Solo fecha

# Cambiar nombre de archivos
REPORT_FILE="$REPORTS_DIR/mi-reporte-$TIMESTAMP.txt"
```

## 📈 Ejemplo de Resumen Generado

```markdown
# Reporte de Pruebas Funcionales - Museo MARCO

## 📊 Resumen de Ejecución

**Fecha**: 2025-11-26 14:30:22
**Ejecutado por**: usuario

### Suites de Pruebas

| Categoría | Archivos | Estado |
|-----------|----------|--------|
| Frontend | 4 | ✅ Pasadas |
| Backend | 3 | ✅ Pasadas |
| Integración | 2 | ⏭ Saltado |
| **Total** | **9** | - |

## 📈 Resultados Detallados

### Frontend Tests
- Tests totales: 42
- Tests pasados: 41
- Tests fallidos: 1
- Duración: 1.23s

### Backend Tests
- Tests totales: 75
- Tests pasados: 75
- Tests fallidos: 0
- Duración: 5.67s
```

## 🎯 Casos de Uso

### 1. Pre-Commit

```bash
#!/bin/bash
# .git/hooks/pre-commit

npm run test:functional:report

# Verificar si hay fallos
if grep -q "Tests fallidos: [^0]" tests/functional/reports/latest-summary.md; then
    echo "❌ Tests fallando, commit abortado"
    exit 1
fi
```

### 2. Pull Request

```bash
# Generar reporte y agregarlo al PR
npm run test:functional:report

# Incluir en descripción del PR
cat tests/functional/reports/latest-summary.md >> PR-description.md
```

### 3. CI/CD (GitHub Actions)

```yaml
# .github/workflows/tests.yml
- name: Run Functional Tests
  run: npm run test:functional:report

- name: Upload Reports
  uses: actions/upload-artifact@v2
  with:
    name: test-reports
    path: tests/functional/reports/
```

### 4. Nightly Build

```bash
#!/bin/bash
# scripts/nightly-tests.sh

# Ejecutar tests
npm run test:functional:report

# Enviar email con resumen
mail -s "Nightly Test Report" team@museo.com < tests/functional/reports/latest-summary.md
```

## 🔍 Interpretación de Resultados

### Estados Posibles

| Estado | Significado | Acción |
|--------|-------------|--------|
| ✅ Pasadas | Todos los tests pasaron | Ninguna |
| ❌ Fallidas | Algunos tests fallaron | Revisar logs |
| ⏭ Saltado | Tests no ejecutados | Iniciar backend |

### Análisis de Fallos

1. **Ver resumen**:
   ```bash
   cat tests/functional/reports/latest-summary.md
   ```

2. **Ver detalles de fallos**:
   ```bash
   cat tests/functional/reports/frontend-output-*.txt | grep "FAIL"
   ```

3. **Ver stack trace**:
   ```bash
   cat tests/functional/reports/frontend-jest-*.json | jq '.testResults[].assertionResults[] | select(.status == "failed")'
   ```

## 📊 Métricas y KPIs

### Seguimiento en el Tiempo

```bash
# Comparar dos ejecuciones
diff tests/functional/reports/test-report-20251125_*.txt \
     tests/functional/reports/test-report-20251126_*.txt
```

### Dashboard de Tendencias

Crear script para rastrear tendencias:

```bash
#!/bin/bash
# scripts/test-trends.sh

echo "Fecha,Total,Pasados,Fallidos" > trends.csv

for file in tests/functional/reports/*-summary.md; do
    date=$(grep "Fecha:" "$file" | cut -d: -f2-)
    total=$(grep "Tests totales:" "$file" | awk '{sum+=$3} END {print sum}')
    passed=$(grep "Tests pasados:" "$file" | awk '{sum+=$3} END {print sum}')
    failed=$(grep "Tests fallidos:" "$file" | awk '{sum+=$3} END {print sum}')

    echo "$date,$total,$passed,$failed" >> trends.csv
done
```

## 🛠️ Troubleshooting

### Problema: Backend no disponible

```
⚠ Backend no disponible (pruebas backend/integración se saltarán)
```

**Solución**:
```bash
# Iniciar backend
npm run backend:start

# Esperar 5 segundos
sleep 5

# Re-ejecutar
npm run test:functional:report
```

### Problema: Permisos denegados

```
Permission denied: ./tests/functional/generate-reports.sh
```

**Solución**:
```bash
chmod +x tests/functional/generate-reports.sh
```

### Problema: Node no encontrado

```
node: command not found
```

**Solución**:
```bash
# Instalar Node.js >= 16
# macOS
brew install node

# Linux
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 📚 Referencias

- [Jest JSON Reporters](https://jestjs.io/docs/configuration#reporters-arraymodulename--modulename-options)
- [GitHub Actions Artifacts](https://docs.github.com/en/actions/guides/storing-workflow-data-as-artifacts)
- [Markdown Tables](https://www.markdownguide.org/extended-syntax/#tables)

## 🔗 Comandos Relacionados

```bash
# Solo ejecutar tests (sin reportes)
npm run test:functional

# Con cobertura
npm run test:functional:coverage

# Solo frontend
npm run test:functional:frontend

# Ver último resumen
cat tests/functional/reports/latest-summary.md

# Abrir HTML en navegador
open tests/functional/reports/test-report-*.html

# Limpiar reportes antiguos
rm -rf tests/functional/reports/*
```

## 💡 Mejoras Futuras

- [ ] Integración con Slack/Discord para notificaciones
- [ ] Gráficas de tendencias con Chart.js
- [ ] Export a PDF
- [ ] Comparación automática entre runs
- [ ] Alertas automáticas en fallos
- [ ] Dashboard web interactivo
- [ ] Integración con SonarQube
