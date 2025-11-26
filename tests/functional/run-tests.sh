#!/bin/bash

# Script para ejecutar pruebas funcionales del proyecto MARCO
# Basado en el plan de pruebas documentado en docs/design/pruebas de página.pdf

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Pruebas Funcionales - Museo MARCO                        ║${NC}"
echo -e "${BLUE}║  Basadas en Plan de Pruebas OWASP                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que el backend esté corriendo
check_backend() {
    echo -e "${YELLOW}Verificando backend...${NC}"
    if curl -s http://localhost:5001/api/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend corriendo en http://localhost:5001${NC}"
        return 0
    else
        echo -e "${RED}✗ Backend no está corriendo${NC}"
        echo -e "${YELLOW}  Inicia el backend con: npm run backend:start${NC}"
        return 1
    fi
}

# Función para ejecutar categoría de pruebas
run_category() {
    local category=$1
    local description=$2

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $description${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    npx jest --config=tests/functional/jest.config.js \
        --testPathPatterns="tests/functional/$category" \
        --verbose

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $description - PASADAS${NC}"
    else
        echo -e "${RED}✗ $description - FALLIDAS${NC}"
    fi
}

# Función principal
main() {
    local category=${1:-all}

    case $category in
        frontend)
            echo -e "${YELLOW}Ejecutando pruebas de Frontend (PF-01 a PF-05)${NC}"
            run_category "frontend" "Pruebas de Frontend"
            ;;

        backend)
            if ! check_backend; then
                exit 1
            fi
            echo -e "${YELLOW}Ejecutando pruebas de Backend (PB-01 a PB-05)${NC}"
            run_category "backend" "Pruebas de Backend"
            ;;

        integration)
            if ! check_backend; then
                exit 1
            fi
            echo -e "${YELLOW}Ejecutando pruebas de Integración (PIA-01 a PIA-07)${NC}"
            run_category "integration" "Pruebas de Integridad, Autenticación y Acceso"
            ;;

        all)
            echo -e "${YELLOW}Ejecutando todas las pruebas funcionales${NC}"

            # Frontend tests (no requieren backend)
            run_category "frontend" "Pruebas de Frontend"

            # Backend e Integration tests (requieren backend)
            if check_backend; then
                run_category "backend" "Pruebas de Backend"
                run_category "integration" "Pruebas de Integración"
            else
                echo -e "${YELLOW}⚠ Saltando pruebas de backend e integración (backend no disponible)${NC}"
            fi
            ;;

        coverage)
            echo -e "${YELLOW}Ejecutando pruebas con cobertura${NC}"
            npx jest --config=tests/functional/jest.config.js --coverage
            echo ""
            echo -e "${GREEN}Reporte de cobertura generado en: tests/functional/coverage/${NC}"
            ;;

        *)
            echo -e "${RED}Uso: $0 {frontend|backend|integration|all|coverage}${NC}"
            exit 1
            ;;
    esac

    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Pruebas completadas                                      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
}

main "$@"
