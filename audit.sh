#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Guardar el directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
SECURITY_DIR="$PROJECT_ROOT/security/owasp-zap"
REPORTS_DIR="$SECURITY_DIR/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Configuración
TARGET_URL="${TARGET_URL:-http://localhost:3000}"
SCAN_TYPE="${1:-baseline}"

# Detectar el sistema operativo para usar la URL correcta en Docker
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - usar host.docker.internal
  DOCKER_TARGET_URL="${TARGET_URL//localhost/host.docker.internal}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux - usar la IP del host
  HOST_IP=$(ip route | grep default | awk '{print $3}' 2>/dev/null || echo "172.17.0.1")
  DOCKER_TARGET_URL="${TARGET_URL//localhost/$HOST_IP}"
else
  # Windows u otro - intentar con host.docker.internal
  DOCKER_TARGET_URL="${TARGET_URL//localhost/host.docker.internal}"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🛡️  OWASP ZAP Security Audit - Museo MARCO${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Función para mostrar ayuda
show_help() {
  echo -e "${YELLOW}Uso:${NC} ./audit.sh [tipo_de_escaneo] [opciones]"
  echo -e ""
  echo -e "${YELLOW}Tipos de escaneo:${NC}"
  echo -e "  ${GREEN}baseline${NC}  - Escaneo rápido pasivo (por defecto)"
  echo -e "  ${GREEN}api${NC}       - Escaneo de API endpoints"
  echo -e "  ${GREEN}full${NC}      - Escaneo completo activo (más lento)"
  echo -e ""
  echo -e "${YELLOW}Variables de entorno:${NC}"
  echo -e "  ${GREEN}TARGET_URL${NC} - URL objetivo (default: http://localhost:3000)"
  echo -e ""
  echo -e "${YELLOW}Ejemplos:${NC}"
  echo -e "  ./audit.sh                           # Escaneo baseline"
  echo -e "  ./audit.sh full                      # Escaneo completo"
  echo -e "  TARGET_URL=http://localhost:5001 ./audit.sh api"
  echo -e ""
  exit 0
}

# Verificar si se pidió ayuda
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
  show_help
fi

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Error: Docker no está instalado${NC}"
  echo -e "${YELLOW}Por favor instala Docker desde: https://docs.docker.com/get-docker/${NC}\n"
  exit 1
fi

# Verificar que Docker esté corriendo
if ! docker info &> /dev/null; then
  echo -e "${RED}❌ Error: Docker no está corriendo${NC}"
  echo -e "${YELLOW}Por favor inicia Docker Desktop${NC}\n"
  exit 1
fi

echo -e "${GREEN}✓ Docker está disponible${NC}\n"

# Crear directorio de reportes si no existe
mkdir -p "$REPORTS_DIR"
echo -e "${GREEN}✓ Directorio de reportes configurado: $REPORTS_DIR${NC}\n"

# Verificar que la aplicación esté corriendo
echo -e "${YELLOW}🔍 Verificando que la aplicación esté corriendo...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL" 2>/dev/null)

if [ "$HTTP_STATUS" != "200" ] && [ "$HTTP_STATUS" != "301" ] && [ "$HTTP_STATUS" != "302" ]; then
  echo -e "${RED}❌ Error: La aplicación no está respondiendo en $TARGET_URL${NC}"
  echo -e "${YELLOW}Por favor inicia la aplicación primero:${NC}"
  echo -e "${YELLOW}  npm run dev${NC}\n"
  exit 1
fi

echo -e "${GREEN}✓ Aplicación disponible en $TARGET_URL${NC}\n"

# Información del escaneo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Configuración del escaneo:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Tipo:${NC}           $SCAN_TYPE"
echo -e "${CYAN}Target (host):${NC}  $TARGET_URL"
echo -e "${CYAN}Target (docker):${NC} $DOCKER_TARGET_URL"
echo -e "${CYAN}Timestamp:${NC}      $TIMESTAMP"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Seleccionar el tipo de escaneo
case "$SCAN_TYPE" in
  baseline)
    echo -e "${YELLOW}📊 Ejecutando escaneo BASELINE (pasivo)...${NC}\n"

    docker run --rm -i \
      --add-host=host.docker.internal:host-gateway \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-baseline.py \
      -t "$DOCKER_TARGET_URL" \
      -r "baseline_report_${TIMESTAMP}.html" \
      -J "baseline_report_${TIMESTAMP}.json" \
      -w "baseline_report_${TIMESTAMP}.md" \
      -I \
      -d

    REPORT_PREFIX="baseline_report_${TIMESTAMP}"
    ;;

  api)
    echo -e "${YELLOW}🔌 Ejecutando escaneo de API...${NC}\n"

    docker run --rm -i \
      --add-host=host.docker.internal:host-gateway \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-api-scan.py \
      -t "$DOCKER_TARGET_URL/api/v1" \
      -f openapi \
      -r "api_report_${TIMESTAMP}.html" \
      -J "api_report_${TIMESTAMP}.json" \
      -w "api_report_${TIMESTAMP}.md" \
      -I \
      -d

    REPORT_PREFIX="api_report_${TIMESTAMP}"
    ;;

  full)
    echo -e "${YELLOW}🔥 Ejecutando escaneo COMPLETO (activo)...${NC}"
    echo -e "${YELLOW}⚠️  Esto puede tomar varios minutos${NC}\n"

    docker run --rm -i \
      --add-host=host.docker.internal:host-gateway \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-full-scan.py \
      -t "$DOCKER_TARGET_URL" \
      -r "full_report_${TIMESTAMP}.html" \
      -J "full_report_${TIMESTAMP}.json" \
      -w "full_report_${TIMESTAMP}.md" \
      -I \
      -d

    REPORT_PREFIX="full_report_${TIMESTAMP}"
    ;;

  *)
    echo -e "${RED}❌ Error: Tipo de escaneo no válido: $SCAN_TYPE${NC}"
    echo -e "${YELLOW}Usa: baseline, api, o full${NC}\n"
    show_help
    ;;
esac

SCAN_EXIT_CODE=$?

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar si el escaneo se completó
if [ $SCAN_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ Escaneo completado exitosamente${NC}"
elif [ $SCAN_EXIT_CODE -eq 2 ]; then
  echo -e "${YELLOW}⚠️  Escaneo completado con advertencias${NC}"
  echo -e "${YELLOW}Se encontraron posibles vulnerabilidades${NC}"
else
  echo -e "${RED}❌ El escaneo falló o encontró vulnerabilidades críticas${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Mostrar reportes generados
echo -e "${MAGENTA}📄 Reportes generados:${NC}\n"
if [ -f "$REPORTS_DIR/${REPORT_PREFIX}.html" ]; then
  echo -e "${GREEN}✓${NC} HTML:     $REPORTS_DIR/${REPORT_PREFIX}.html"
fi
if [ -f "$REPORTS_DIR/${REPORT_PREFIX}.json" ]; then
  echo -e "${GREEN}✓${NC} JSON:     $REPORTS_DIR/${REPORT_PREFIX}.json"
fi
if [ -f "$REPORTS_DIR/${REPORT_PREFIX}.md" ]; then
  echo -e "${GREEN}✓${NC} Markdown: $REPORTS_DIR/${REPORT_PREFIX}.md"
fi

echo -e ""

# Resumen de vulnerabilidades si existe el reporte JSON
if [ -f "$REPORTS_DIR/${REPORT_PREFIX}.json" ]; then
  echo -e "${MAGENTA}📊 Resumen de vulnerabilidades:${NC}\n"

  if command -v jq &> /dev/null; then
    # Usar jq para parsear el JSON si está disponible
    HIGH=$(jq '[.site[0].alerts[] | select(.riskdesc | startswith("High"))] | length' "$REPORTS_DIR/${REPORT_PREFIX}.json" 2>/dev/null || echo "0")
    MEDIUM=$(jq '[.site[0].alerts[] | select(.riskdesc | startswith("Medium"))] | length' "$REPORTS_DIR/${REPORT_PREFIX}.json" 2>/dev/null || echo "0")
    LOW=$(jq '[.site[0].alerts[] | select(.riskdesc | startswith("Low"))] | length' "$REPORTS_DIR/${REPORT_PREFIX}.json" 2>/dev/null || echo "0")
    INFO=$(jq '[.site[0].alerts[] | select(.riskdesc | startswith("Informational"))] | length' "$REPORTS_DIR/${REPORT_PREFIX}.json" 2>/dev/null || echo "0")

    echo -e "${RED}🔴 Alta:          $HIGH${NC}"
    echo -e "${YELLOW}🟡 Media:         $MEDIUM${NC}"
    echo -e "${BLUE}🔵 Baja:          $LOW${NC}"
    echo -e "${CYAN}ℹ️  Informativa:  $INFO${NC}"
  else
    echo -e "${YELLOW}⚠️  Instala 'jq' para ver el resumen de vulnerabilidades${NC}"
    echo -e "${YELLOW}   brew install jq  (macOS)${NC}"
    echo -e "${YELLOW}   apt-get install jq  (Linux)${NC}"
  fi
fi

echo -e ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Auditoría de seguridad completada${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}💡 Próximos pasos:${NC}"
echo -e "   1. Revisa el reporte HTML para detalles completos"
echo -e "   2. Prioriza la corrección de vulnerabilidades de severidad alta"
echo -e "   3. Ejecuta escaneos regulares durante el desarrollo\n"

exit $SCAN_EXIT_CODE
