#!/bin/bash

# =============================================================================
# Script Maestro de Pruebas - Museo MARCO
# Ejecuta TODAS las pruebas del proyecto y genera reportes consolidados
# =============================================================================

set -e  # Salir si algún comando falla (comentar para continuar con errores)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORTS_DIR="test-reports"
CONSOLIDATED_REPORT="$REPORTS_DIR/consolidated-report-$TIMESTAMP.md"
EXIT_CODE=0

# Crear directorio de reportes
mkdir -p "$REPORTS_DIR"

# =============================================================================
# Banner
# =============================================================================
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                      ║${NC}"
echo -e "${BLUE}║       SUITE COMPLETA DE PRUEBAS - MUSEO MARCO                        ║${NC}"
echo -e "${BLUE}║       Pruebas Unitarias + Funcionales + Seguridad                    ║${NC}"
echo -e "${BLUE}║                                                                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Fecha: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${CYAN}Usuario: $(whoami)${NC}"
echo -e "${CYAN}Reportes: $REPORTS_DIR${NC}"
echo ""

# =============================================================================
# Función para imprimir secciones
# =============================================================================
print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =============================================================================
# Iniciar reporte consolidado
# =============================================================================
cat > "$CONSOLIDATED_REPORT" << EOF
# Reporte Consolidado de Pruebas - Museo MARCO

**Fecha**: $(date '+%Y-%m-%d %H:%M:%S')
**Usuario**: $(whoami)
**Timestamp**: $TIMESTAMP

---

## 📊 Resumen Ejecutivo

EOF

# =============================================================================
# 1. PRUEBAS UNITARIAS (React Tests)
# =============================================================================
print_section "1/4 - Ejecutando Pruebas Unitarias (React)"

echo -e "${CYAN}Ejecutando: npm test -- --coverage --watchAll=false${NC}"
echo ""

UNIT_START=$(date +%s)
if CI=true npm test -- --coverage --watchAll=false --passWithNoTests > "$REPORTS_DIR/unit-tests-$TIMESTAMP.log" 2>&1; then
    UNIT_STATUS="${GREEN}✓ PASADAS${NC}"
    UNIT_STATUS_MD="✅ Pasadas"
    echo -e "${GREEN}✓ Pruebas unitarias completadas exitosamente${NC}"
else
    UNIT_STATUS="${RED}✗ FALLIDAS${NC}"
    UNIT_STATUS_MD="❌ Fallidas"
    echo -e "${RED}✗ Algunas pruebas unitarias fallaron (ver log)${NC}"
    EXIT_CODE=1
fi
UNIT_END=$(date +%s)
UNIT_DURATION=$((UNIT_END - UNIT_START))

echo -e "${CYAN}Duración: ${UNIT_DURATION}s${NC}"
echo -e "${CYAN}Log: $REPORTS_DIR/unit-tests-$TIMESTAMP.log${NC}"

# Agregar al reporte
cat >> "$CONSOLIDATED_REPORT" << EOF

### 1. Pruebas Unitarias (React)
- **Estado**: $UNIT_STATUS_MD
- **Duración**: ${UNIT_DURATION}s
- **Cobertura**: Ver \`coverage/\` folder
- **Log**: \`$REPORTS_DIR/unit-tests-$TIMESTAMP.log\`

EOF

# =============================================================================
# 2. PRUEBAS FUNCIONALES (Frontend + Backend + Integración)
# =============================================================================
print_section "2/4 - Ejecutando Pruebas Funcionales"

echo -e "${CYAN}Ejecutando: npm run test:functional:report${NC}"
echo ""

FUNCTIONAL_START=$(date +%s)
if npm run test:functional:report > "$REPORTS_DIR/functional-tests-$TIMESTAMP.log" 2>&1; then
    FUNCTIONAL_STATUS="${GREEN}✓ PASADAS${NC}"
    FUNCTIONAL_STATUS_MD="✅ Pasadas"
    echo -e "${GREEN}✓ Pruebas funcionales completadas exitosamente${NC}"
else
    FUNCTIONAL_STATUS="${YELLOW}⚠ COMPLETADAS CON ADVERTENCIAS${NC}"
    FUNCTIONAL_STATUS_MD="⚠️ Ver reportes"
    echo -e "${YELLOW}⚠ Pruebas funcionales completadas (revisar reportes)${NC}"
    # No cambiar EXIT_CODE porque algunas pueden fallar si backend está apagado
fi
FUNCTIONAL_END=$(date +%s)
FUNCTIONAL_DURATION=$((FUNCTIONAL_END - FUNCTIONAL_START))

echo -e "${CYAN}Duración: ${FUNCTIONAL_DURATION}s${NC}"
echo -e "${CYAN}Reportes: tests/functional/reports/${NC}"

# Copiar resumen de pruebas funcionales
if [ -f "tests/functional/reports/latest-summary.md" ]; then
    cat >> "$CONSOLIDATED_REPORT" << EOF

### 2. Pruebas Funcionales
- **Estado**: $FUNCTIONAL_STATUS_MD
- **Duración**: ${FUNCTIONAL_DURATION}s
- **Resumen detallado**: \`tests/functional/reports/latest-summary.md\`
- **Dashboard HTML**: Ver \`tests/functional/reports/test-report-*.html\`

#### Detalles

EOF
    # Agregar contenido del resumen funcional (sin el header)
    tail -n +3 tests/functional/reports/latest-summary.md >> "$CONSOLIDATED_REPORT"
fi

# =============================================================================
# 3. AUDITORÍA DE SEGURIDAD NPM
# =============================================================================
print_section "3/4 - Ejecutando Auditoría de Seguridad (npm audit)"

echo -e "${CYAN}Ejecutando: npm audit --production${NC}"
echo ""

AUDIT_START=$(date +%s)
if npm audit --production --json > "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" 2>&1; then
    AUDIT_STATUS="${GREEN}✓ SIN VULNERABILIDADES${NC}"
    AUDIT_STATUS_MD="✅ Sin vulnerabilidades"
    echo -e "${GREEN}✓ No se encontraron vulnerabilidades${NC}"
else
    # npm audit retorna código de error si hay vulnerabilidades
    AUDIT_STATUS="${YELLOW}⚠ VULNERABILIDADES ENCONTRADAS${NC}"
    AUDIT_STATUS_MD="⚠️ Ver reporte"
    echo -e "${YELLOW}⚠ Se encontraron vulnerabilidades (revisar reporte)${NC}"
fi
AUDIT_END=$(date +%s)
AUDIT_DURATION=$((AUDIT_END - AUDIT_START))

# Extraer resumen de npm audit
AUDIT_SUMMARY=$(npm audit --production 2>/dev/null | tail -10 || echo "Ver archivo JSON para detalles")

echo -e "${CYAN}Duración: ${AUDIT_DURATION}s${NC}"

cat >> "$CONSOLIDATED_REPORT" << EOF

### 3. Auditoría de Seguridad (npm)
- **Estado**: $AUDIT_STATUS_MD
- **Duración**: ${AUDIT_DURATION}s
- **Reporte JSON**: \`$REPORTS_DIR/npm-audit-$TIMESTAMP.json\`

\`\`\`
$AUDIT_SUMMARY
\`\`\`

EOF

# =============================================================================
# 4. LINT Y FORMATO (Opcional)
# =============================================================================
print_section "4/4 - Verificando Lint (ESLint)"

echo -e "${CYAN}Ejecutando: npm run lint${NC}"
echo ""

LINT_START=$(date +%s)
if npm run lint > "$REPORTS_DIR/lint-$TIMESTAMP.log" 2>&1; then
    LINT_STATUS="${GREEN}✓ SIN ERRORES${NC}"
    LINT_STATUS_MD="✅ Sin errores"
    echo -e "${GREEN}✓ No se encontraron errores de lint${NC}"
else
    LINT_STATUS="${YELLOW}⚠ ERRORES ENCONTRADOS${NC}"
    LINT_STATUS_MD="⚠️ Ver log"
    echo -e "${YELLOW}⚠ Se encontraron errores de lint${NC}"
fi
LINT_END=$(date +%s)
LINT_DURATION=$((LINT_END - LINT_START))

echo -e "${CYAN}Duración: ${LINT_DURATION}s${NC}"

cat >> "$CONSOLIDATED_REPORT" << EOF

### 4. Lint y Calidad de Código
- **Estado**: $LINT_STATUS_MD
- **Duración**: ${LINT_DURATION}s
- **Log**: \`$REPORTS_DIR/lint-$TIMESTAMP.log\`

EOF

# =============================================================================
# RESUMEN FINAL
# =============================================================================
print_section "Resumen Final"

TOTAL_DURATION=$((UNIT_DURATION + FUNCTIONAL_DURATION + AUDIT_DURATION + LINT_DURATION))

echo ""
echo -e "${BOLD}Resultados:${NC}"
echo -e "  1. Pruebas Unitarias:    $UNIT_STATUS"
echo -e "  2. Pruebas Funcionales:  $FUNCTIONAL_STATUS"
echo -e "  3. Auditoría Seguridad:  $AUDIT_STATUS"
echo -e "  4. Lint:                 $LINT_STATUS"
echo ""
echo -e "${CYAN}Duración total: ${TOTAL_DURATION}s ($(($TOTAL_DURATION / 60))m $(($TOTAL_DURATION % 60))s)${NC}"
echo ""

# Agregar métricas finales al reporte
cat >> "$CONSOLIDATED_REPORT" << EOF

---

## ⏱️ Métricas de Tiempo

| Categoría | Duración |
|-----------|----------|
| Pruebas Unitarias | ${UNIT_DURATION}s |
| Pruebas Funcionales | ${FUNCTIONAL_DURATION}s |
| Auditoría de Seguridad | ${AUDIT_DURATION}s |
| Lint | ${LINT_DURATION}s |
| **Total** | **${TOTAL_DURATION}s** |

---

## 📁 Archivos Generados

- **Este reporte**: \`$CONSOLIDATED_REPORT\`
- **Pruebas unitarias**: \`$REPORTS_DIR/unit-tests-$TIMESTAMP.log\`
- **Pruebas funcionales**: \`tests/functional/reports/\`
- **Auditoría npm**: \`$REPORTS_DIR/npm-audit-$TIMESTAMP.json\`
- **Lint**: \`$REPORTS_DIR/lint-$TIMESTAMP.log\`
- **Cobertura**: \`coverage/\` (abrir \`coverage/lcov-report/index.html\`)

---

## 🔍 Próximos Pasos

- [ ] Revisar tests fallidos (si hay)
- [ ] Mejorar cobertura de código
- [ ] Resolver vulnerabilidades de seguridad
- [ ] Corregir errores de lint
- [ ] Ejecutar antes de cada commit
- [ ] Integrar en CI/CD pipeline

---

*Generado automáticamente por run-all-tests.sh*
EOF

echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}  Archivos Generados${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✓ Reporte consolidado: $CONSOLIDATED_REPORT${NC}"
echo -e "${CYAN}  Ver con: cat $CONSOLIDATED_REPORT${NC}"
echo ""
echo -e "${GREEN}✓ Cobertura de código: coverage/lcov-report/index.html${NC}"
echo -e "${CYAN}  Abrir con: open coverage/lcov-report/index.html${NC}"
echo ""
echo -e "${GREEN}✓ Dashboard funcional: tests/functional/reports/test-report-*.html${NC}"
echo -e "${CYAN}  Abrir con: open tests/functional/reports/test-report-*.html${NC}"
echo ""

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Ejecución Completa                                                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════╝${NC}"

exit $EXIT_CODE
