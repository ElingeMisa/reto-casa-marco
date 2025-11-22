#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 Limpieza de Docker - Museo MARCO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Error: Docker no está instalado${NC}\n"
  exit 1
fi

cd "$PROJECT_ROOT"

echo -e "${YELLOW}Esta operación va a:${NC}"
echo -e "  • Detener todos los contenedores del proyecto"
echo -e "  • Eliminar todos los contenedores del proyecto"
echo -e "  • Eliminar todas las imágenes del proyecto"
echo -e "  • Eliminar volúmenes de datos (incluyendo base de datos)"
echo -e "  • Eliminar redes creadas\n"

read -p "$(echo -e ${YELLOW}¿Estás seguro de continuar? [y/N]:${NC} )" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Operación cancelada${NC}\n"
  exit 0
fi

echo -e "\n${YELLOW}🛑 Deteniendo contenedores...${NC}"
docker-compose down -v

echo -e "${YELLOW}🗑️  Eliminando imágenes del proyecto...${NC}"
docker images | grep -E "museo|marco" | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true

echo -e "${YELLOW}🧼 Limpiando recursos no utilizados...${NC}"
docker system prune -f

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Limpieza completada${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${CYAN}💡 Para volver a iniciar los servicios:${NC}"
echo -e "   npm run docker:start:build\n"
