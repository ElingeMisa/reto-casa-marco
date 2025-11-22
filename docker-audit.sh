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
REPORTS_DIR="$PROJECT_ROOT/security/owasp-zap/reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Configuración
SCAN_TYPE="${1:-baseline}"
TARGET_SERVICE="${2:-frontend}"

# Determinar la URL objetivo según el servicio
case "$TARGET_SERVICE" in
  frontend)
    TARGET_URL="http://museo_frontend:80"
    TARGET_NAME="Frontend"
    ;;
  backend)
    TARGET_URL="http://museo_backend:5001"
    TARGET_NAME="Backend API"
    ;;
  *)
    echo -e "${RED}❌ Error: Servicio no válido: $TARGET_SERVICE${NC}"
    echo -e "${YELLOW}Usa: frontend o backend${NC}\n"
    exit 1
    ;;
esac

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🛡️  OWASP ZAP Security Audit (Docker) - Museo MARCO${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Función para mostrar ayuda
show_help() {
  echo -e "${YELLOW}Uso:${NC} ./docker-audit.sh [tipo_de_escaneo] [servicio]"
  echo -e ""
  echo -e "${YELLOW}Tipos de escaneo:${NC}"
  echo -e "  ${GREEN}baseline${NC}  - Escaneo rápido pasivo (por defecto)"
  echo -e "  ${GREEN}api${NC}       - Escaneo de API endpoints"
  echo -e "  ${GREEN}full${NC}      - Escaneo completo activo (más lento)"
  echo -e ""
  echo -e "${YELLOW}Servicios:${NC}"
  echo -e "  ${GREEN}frontend${NC}  - Escanear el frontend (por defecto)"
  echo -e "  ${GREEN}backend${NC}   - Escanear el backend API"
  echo -e ""
  echo -e "${YELLOW}Ejemplos:${NC}"
  echo -e "  ./docker-audit.sh                    # Escaneo baseline del frontend"
  echo -e "  ./docker-audit.sh full frontend      # Escaneo completo del frontend"
  echo -e "  ./docker-audit.sh baseline backend   # Escaneo baseline del backend"
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

# Verificar que Docker Compose esté disponible
if ! docker compose version &> /dev/null; then
  echo -e "${RED}❌ Error: Docker Compose no está disponible${NC}\n"
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
echo -e "${GREEN}✓ Directorio de reportes configurado${NC}\n"

# Verificar que los servicios principales estén corriendo
echo -e "${YELLOW}🔍 Verificando que los servicios estén corriendo...${NC}"

cd "$PROJECT_ROOT"

# Verificar si los contenedores están corriendo
if ! docker ps | grep -q "museo_frontend" || ! docker ps | grep -q "museo_backend"; then
  echo -e "${RED}❌ Error: Los servicios no están corriendo${NC}"
  echo -e "${YELLOW}Por favor inicia los servicios primero:${NC}"
  echo -e "${YELLOW}  ./docker-start.sh${NC}"
  echo -e "${YELLOW}  o${NC}"
  echo -e "${YELLOW}  docker-compose up -d${NC}\n"
  exit 1
fi

echo -e "${GREEN}✓ Servicios están corriendo${NC}\n"

# Verificar que el servicio objetivo esté saludable
echo -e "${YELLOW}⏳ Esperando a que ${TARGET_NAME} esté listo...${NC}"
MAX_WAIT=30
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
  if docker exec "museo_${TARGET_SERVICE}" curl -sf "$TARGET_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ ${TARGET_NAME} está listo${NC}\n"
    break
  fi

  WAIT_COUNT=$((WAIT_COUNT + 1))
  if [ $WAIT_COUNT -eq $MAX_WAIT ]; then
    echo -e "${RED}❌ ${TARGET_NAME} no respondió a tiempo${NC}\n"
    exit 1
  fi

  sleep 2
done

# Información del escaneo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Configuración del escaneo:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Tipo:${NC}      $SCAN_TYPE"
echo -e "${CYAN}Target:${NC}    $TARGET_NAME ($TARGET_URL)"
echo -e "${CYAN}Network:${NC}   museo_network (Docker)"
echo -e "${CYAN}Timestamp:${NC} $TIMESTAMP"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Determinar el prefijo del reporte según el servicio y tipo
REPORT_PREFIX="${TARGET_SERVICE}_${SCAN_TYPE}_${TIMESTAMP}"

# Seleccionar el tipo de escaneo
case "$SCAN_TYPE" in
  baseline)
    echo -e "${YELLOW}📊 Ejecutando escaneo BASELINE (pasivo) en ${TARGET_NAME}...${NC}\n"

    docker run --rm -i \
      --network="museo_network" \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-baseline.py \
      -t "$TARGET_URL" \
      -r "${REPORT_PREFIX}.html" \
      -J "${REPORT_PREFIX}.json" \
      -w "${REPORT_PREFIX}.md" \
      -I \
      -d
    ;;

  api)
    echo -e "${YELLOW}🔌 Ejecutando escaneo de API en ${TARGET_NAME}...${NC}\n"

    # Determinar la URL de la API
    if [ "$TARGET_SERVICE" == "backend" ]; then
      API_URL="${TARGET_URL}/api/v1"
    else
      API_URL="${TARGET_URL}/api"
    fi

    docker run --rm -i \
      --network="museo_network" \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-api-scan.py \
      -t "$API_URL" \
      -f openapi \
      -r "${REPORT_PREFIX}.html" \
      -J "${REPORT_PREFIX}.json" \
      -w "${REPORT_PREFIX}.md" \
      -I \
      -d
    ;;

  full)
    echo -e "${YELLOW}🔥 Ejecutando escaneo COMPLETO (activo) en ${TARGET_NAME}...${NC}"
    echo -e "${YELLOW}⚠️  Esto puede tomar varios minutos${NC}\n"

    docker run --rm -i \
      --network="museo_network" \
      -v "$REPORTS_DIR:/zap/wrk:rw" \
      ghcr.io/zaproxy/zaproxy:stable \
      zap-full-scan.py \
      -t "$TARGET_URL" \
      -r "${REPORT_PREFIX}.html" \
      -J "${REPORT_PREFIX}.json" \
      -w "${REPORT_PREFIX}.md" \
      -I \
      -d
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
  FILE_SIZE=$(ls -lh "$REPORTS_DIR/${REPORT_PREFIX}.html" | awk '{print $5}')
  echo -e "           Tamaño: $FILE_SIZE"
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
echo -e "   1. Abre el reporte HTML en tu navegador:"
echo -e "      ${CYAN}open $REPORTS_DIR/${REPORT_PREFIX}.html${NC}"
echo -e "   2. Revisa vulnerabilidades de severidad alta y media"
echo -e "   3. Documenta las vulnerabilidades encontradas"
echo -e "   4. Implementa las correcciones necesarias"
echo -e "   5. Ejecuta el escaneo nuevamente para verificar\n"

echo -e "${CYAN}📋 Otros escaneos disponibles:${NC}"
echo -e "   ./docker-audit.sh baseline frontend"
echo -e "   ./docker-audit.sh baseline backend"
echo -e "   ./docker-audit.sh full frontend\n"

exit $SCAN_EXIT_CODE
