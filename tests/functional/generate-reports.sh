#!/bin/bash

# Script para ejecutar pruebas funcionales y generar reportes completos
# Museo MARCO - Testing de Seguridad OWASP

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración
REPORTS_DIR="tests/functional/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$REPORTS_DIR/test-report-$TIMESTAMP.txt"
JSON_REPORT="$REPORTS_DIR/test-report-$TIMESTAMP.json"
HTML_REPORT="$REPORTS_DIR/test-report-$TIMESTAMP.html"
SUMMARY_FILE="$REPORTS_DIR/latest-summary.md"

# Crear directorio de reportes si no existe
mkdir -p "$REPORTS_DIR"

# Banner
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                      ║${NC}"
echo -e "${BLUE}║       GENERADOR DE REPORTES - PRUEBAS FUNCIONALES                    ║${NC}"
echo -e "${BLUE}║       Museo MARCO - Testing de Seguridad OWASP                       ║${NC}"
echo -e "${BLUE}║                                                                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Fecha: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${CYAN}Reportes se guardarán en: $REPORTS_DIR${NC}"
echo ""

# Función para verificar backend
check_backend() {
    echo -e "${YELLOW}Verificando disponibilidad del backend...${NC}"
    if curl -s http://localhost:5001/api/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend disponible en http://localhost:5001${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Backend no disponible (pruebas backend/integración se saltarán)${NC}"
        return 1
    fi
}

# Función para ejecutar pruebas y capturar resultado
run_tests() {
    local category=$1
    local description=$2
    local output_file="$REPORTS_DIR/${category}-output-$TIMESTAMP.txt"

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $description${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Ejecutar pruebas y capturar salida
    if npx jest --config=tests/functional/jest.config.js \
        --testPathPatterns="tests/functional/$category" \
        --json --outputFile="$REPORTS_DIR/${category}-jest-$TIMESTAMP.json" \
        --testLocationInResults \
        --verbose > "$output_file" 2>&1; then

        echo -e "${GREEN}✓ $description - PASADAS${NC}"
        return 0
    else
        echo -e "${RED}✗ $description - ALGUNAS FALLARON${NC}"
        return 1
    fi
}

# Función para generar resumen ejecutivo
generate_summary() {
    echo -e "${CYAN}Generando resumen ejecutivo...${NC}"

    cat > "$SUMMARY_FILE" << 'EOF'
# Reporte de Pruebas Funcionales - Museo MARCO

## 📊 Resumen de Ejecución

EOF

    echo "**Fecha**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$SUMMARY_FILE"
    echo "**Ejecutado por**: $USER" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"

    # Contar archivos de prueba
    local frontend_count=$(find tests/functional/frontend -name "*.test.*" | wc -l | xargs)
    local backend_count=$(find tests/functional/backend -name "*.test.*" | wc -l | xargs)
    local integration_count=$(find tests/functional/integration -name "*.test.*" | wc -l | xargs)
    local total_count=$((frontend_count + backend_count + integration_count))

    cat >> "$SUMMARY_FILE" << EOF
### Suites de Pruebas

| Categoría | Archivos | Estado |
|-----------|----------|--------|
| Frontend | $frontend_count | $FRONTEND_STATUS |
| Backend | $backend_count | $BACKEND_STATUS |
| Integración | $integration_count | $INTEGRATION_STATUS |
| **Total** | **$total_count** | - |

## 📈 Resultados Detallados

### Frontend Tests
EOF

    # Agregar resultados de frontend si existen
    if [ -f "$REPORTS_DIR/frontend-jest-$TIMESTAMP.json" ]; then
        local frontend_stats=$(node -e "
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$REPORTS_DIR/frontend-jest-$TIMESTAMP.json'));
            console.log(\`- Tests totales: \${data.numTotalTests}\`);
            console.log(\`- Tests pasados: \${data.numPassedTests}\`);
            console.log(\`- Tests fallidos: \${data.numFailedTests}\`);
            console.log(\`- Duración: \${(data.testResults.reduce((a,b) => a + b.perfStats.runtime, 0) / 1000).toFixed(2)}s\`);
        " 2>/dev/null || echo "- No disponible")
        echo "$frontend_stats" >> "$SUMMARY_FILE"
    fi

    echo "" >> "$SUMMARY_FILE"
    echo "### Backend Tests" >> "$SUMMARY_FILE"

    if [ -f "$REPORTS_DIR/backend-jest-$TIMESTAMP.json" ]; then
        local backend_stats=$(node -e "
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$REPORTS_DIR/backend-jest-$TIMESTAMP.json'));
            console.log(\`- Tests totales: \${data.numTotalTests}\`);
            console.log(\`- Tests pasados: \${data.numPassedTests}\`);
            console.log(\`- Tests fallidos: \${data.numFailedTests}\`);
            console.log(\`- Duración: \${(data.testResults.reduce((a,b) => a + b.perfStats.runtime, 0) / 1000).toFixed(2)}s\`);
        " 2>/dev/null || echo "- No disponible")
        echo "$backend_stats" >> "$SUMMARY_FILE"
    fi

    echo "" >> "$SUMMARY_FILE"
    echo "### Integration Tests" >> "$SUMMARY_FILE"

    if [ -f "$REPORTS_DIR/integration-jest-$TIMESTAMP.json" ]; then
        local integration_stats=$(node -e "
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('$REPORTS_DIR/integration-jest-$TIMESTAMP.json'));
            console.log(\`- Tests totales: \${data.numTotalTests}\`);
            console.log(\`- Tests pasados: \${data.numPassedTests}\`);
            console.log(\`- Tests fallidos: \${data.numFailedTests}\`);
            console.log(\`- Duración: \${(data.testResults.reduce((a,b) => a + b.perfStats.runtime, 0) / 1000).toFixed(2)}s\`);
        " 2>/dev/null || echo "- No disponible")
        echo "$integration_stats" >> "$SUMMARY_FILE"
    fi

    cat >> "$SUMMARY_FILE" << EOF

## 🔍 Archivos de Reporte

- **Reporte completo**: \`$REPORT_FILE\`
- **Reporte JSON**: \`$JSON_REPORT\`
- **Reporte HTML**: \`$HTML_REPORT\`

## 📝 Próximos Pasos

EOF

    if [ "$BACKEND_STATUS" = "⏭ Saltado" ]; then
        echo "- ⚠️  Iniciar backend para ejecutar pruebas backend/integración" >> "$SUMMARY_FILE"
    fi

    echo "- Revisar tests fallidos (si hay)" >> "$SUMMARY_FILE"
    echo "- Actualizar documentación si es necesario" >> "$SUMMARY_FILE"
    echo "- Considerar aumentar cobertura de código" >> "$SUMMARY_FILE"

    echo "" >> "$SUMMARY_FILE"
    echo "---" >> "$SUMMARY_FILE"
    echo "*Generado automáticamente por generate-reports.sh*" >> "$SUMMARY_FILE"
}

# Función para generar HTML report
generate_html_report() {
    echo -e "${CYAN}Generando reporte HTML...${NC}"

    cat > "$HTML_REPORT" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas Funcionales - Museo MARCO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .meta {
            color: #7f8c8d;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
        }
        .success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .warning { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #3498db;
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-danger {
            background: #f8d7da;
            color: #721c24;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #7f8c8d;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Reporte de Pruebas Funcionales</h1>
        <div class="meta">
            <strong>Proyecto:</strong> Museo MARCO<br>
            <strong>Fecha:</strong> TIMESTAMP_PLACEHOLDER<br>
            <strong>Usuario:</strong> USER_PLACEHOLDER
        </div>

        <div class="summary">
            <div class="stat-card info">
                <h3>Suites Ejecutadas</h3>
                <div class="value">SUITES_TOTAL</div>
            </div>
            <div class="stat-card success">
                <h3>Tests Pasados</h3>
                <div class="value">TESTS_PASSED</div>
            </div>
            <div class="stat-card warning">
                <h3>Tests Fallidos</h3>
                <div class="value">TESTS_FAILED</div>
            </div>
            <div class="stat-card">
                <h3>Duración Total</h3>
                <div class="value">DURATION</div>
            </div>
        </div>

        <h2>Resultados por Categoría</h2>
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Archivos</th>
                    <th>Tests</th>
                    <th>Pasados</th>
                    <th>Fallidos</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                RESULTS_TABLE_PLACEHOLDER
            </tbody>
        </table>

        <footer>
            <p>Generado automáticamente por generate-reports.sh</p>
            <p>Museo MARCO - Testing de Seguridad OWASP</p>
        </footer>
    </div>
</body>
</html>
HTMLEOF

    # Reemplazar placeholders (esto se hace con datos reales)
    sed -i.bak "s/TIMESTAMP_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "$HTML_REPORT"
    sed -i.bak "s/USER_PLACEHOLDER/$USER/g" "$HTML_REPORT"
    rm -f "$HTML_REPORT.bak"

    echo -e "${GREEN}✓ Reporte HTML generado: $HTML_REPORT${NC}"
}

# Main execution
main() {
    # Inicializar contadores
    TOTAL_SUITES=0
    PASSED_SUITES=0
    FAILED_SUITES=0

    # Verificar backend
    BACKEND_AVAILABLE=false
    if check_backend; then
        BACKEND_AVAILABLE=true
    fi
    echo ""

    # Ejecutar pruebas de frontend
    if run_tests "frontend" "Pruebas de Frontend"; then
        FRONTEND_STATUS="✅ Pasadas"
        PASSED_SUITES=$((PASSED_SUITES + 1))
    else
        FRONTEND_STATUS="❌ Fallidas"
        FAILED_SUITES=$((FAILED_SUITES + 1))
    fi
    TOTAL_SUITES=$((TOTAL_SUITES + 1))

    # Ejecutar pruebas de backend si está disponible
    if [ "$BACKEND_AVAILABLE" = true ]; then
        if run_tests "backend" "Pruebas de Backend"; then
            BACKEND_STATUS="✅ Pasadas"
            PASSED_SUITES=$((PASSED_SUITES + 1))
        else
            BACKEND_STATUS="❌ Fallidas"
            FAILED_SUITES=$((FAILED_SUITES + 1))
        fi
        TOTAL_SUITES=$((TOTAL_SUITES + 1))
    else
        BACKEND_STATUS="⏭ Saltado"
    fi

    # Ejecutar pruebas de integración si está disponible
    if [ "$BACKEND_AVAILABLE" = true ]; then
        if run_tests "integration" "Pruebas de Integración"; then
            INTEGRATION_STATUS="✅ Pasadas"
            PASSED_SUITES=$((PASSED_SUITES + 1))
        else
            INTEGRATION_STATUS="❌ Fallidas"
            FAILED_SUITES=$((FAILED_SUITES + 1))
        fi
        TOTAL_SUITES=$((TOTAL_SUITES + 1))
    else
        INTEGRATION_STATUS="⏭ Saltado"
    fi

    # Generar reportes
    echo ""
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}  Generando Reportes${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    generate_summary
    generate_html_report

    # Resumen final
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Ejecución Completa                                                  ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📊 Resumen:${NC}"
    echo -e "   Total de suites: $TOTAL_SUITES"
    echo -e "   ${GREEN}Pasadas: $PASSED_SUITES${NC}"
    echo -e "   ${RED}Fallidas: $FAILED_SUITES${NC}"
    echo ""
    echo -e "${CYAN}📄 Reportes generados:${NC}"
    echo -e "   - Resumen: ${GREEN}$SUMMARY_FILE${NC}"
    echo -e "   - HTML: ${GREEN}$HTML_REPORT${NC}"
    echo ""
    echo -e "${CYAN}💡 Ver resumen:${NC}"
    echo -e "   cat $SUMMARY_FILE"
    echo ""
    echo -e "${CYAN}🌐 Abrir reporte HTML:${NC}"
    echo -e "   open $HTML_REPORT"
    echo ""
}

# Ejecutar
main "$@"
