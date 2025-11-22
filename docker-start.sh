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

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🐳 Iniciando Museo MARCO con Docker${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Función de limpieza al salir
cleanup() {
  echo -e "\n${YELLOW}🛑 Deteniendo contenedores...${NC}"
  cd "$PROJECT_ROOT"
  docker-compose down
  echo -e "${GREEN}✅ Contenedores detenidos${NC}"
  exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Error: Docker no está instalado${NC}"
  echo -e "${YELLOW}Por favor instala Docker desde: https://docs.docker.com/get-docker/${NC}\n"
  exit 1
fi

# Verificar que Docker Compose esté disponible
if ! docker compose version &> /dev/null; then
  echo -e "${RED}❌ Error: Docker Compose no está disponible${NC}"
  echo -e "${YELLOW}Por favor instala Docker Compose${NC}\n"
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
mkdir -p "$PROJECT_ROOT/security/owasp-zap/reports"

# Detener contenedores previos si existen
echo -e "${YELLOW}🧹 Limpiando contenedores previos...${NC}"
cd "$PROJECT_ROOT"
docker-compose down > /dev/null 2>&1
echo -e "${GREEN}✓ Contenedores previos limpiados${NC}\n"

# Verificar si necesitamos construir las imágenes
BUILD_FLAG=""
if [ "$1" == "--build" ] || [ "$1" == "-b" ]; then
  echo -e "${YELLOW}🔨 Construyendo imágenes Docker...${NC}"
  BUILD_FLAG="--build"
fi

# Iniciar servicios principales
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Iniciando servicios...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Iniciar los servicios en modo detached
if ! docker-compose up $BUILD_FLAG -d postgres backend frontend; then
  echo -e "\n${RED}❌ Error al iniciar los servicios${NC}"
  echo -e "${YELLOW}Revisa los logs con: docker-compose logs${NC}\n"
  exit 1
fi

echo -e "\n${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}\n"

# Función para verificar el estado de salud de un servicio
check_health() {
  local service=$1
  local max_attempts=60
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    health=$(docker inspect --format='{{.State.Health.Status}}' "museo_${service}" 2>/dev/null)

    if [ "$health" == "healthy" ]; then
      return 0
    fi

    # Si el contenedor no tiene healthcheck, verificar que esté corriendo
    if [ -z "$health" ]; then
      status=$(docker inspect --format='{{.State.Status}}' "museo_${service}" 2>/dev/null)
      if [ "$status" == "running" ]; then
        return 0
      fi
    fi

    attempt=$((attempt + 1))

    if [ $attempt -eq $max_attempts ]; then
      return 1
    fi

    echo -e "${YELLOW}   Esperando ${service}... (intento $attempt/$max_attempts)${NC}"
    sleep 2
  done

  return 1
}

# Verificar PostgreSQL
echo -e "${CYAN}🗄️  Verificando PostgreSQL...${NC}"
if check_health "db"; then
  echo -e "${GREEN}✅ PostgreSQL está listo${NC}\n"
else
  echo -e "${RED}❌ PostgreSQL no respondió a tiempo${NC}"
  echo -e "${YELLOW}Logs de PostgreSQL:${NC}"
  docker-compose logs postgres
  exit 1
fi

# Verificar Backend
echo -e "${CYAN}📦 Verificando Backend...${NC}"
if check_health "backend"; then
  echo -e "${GREEN}✅ Backend está listo${NC}\n"
else
  echo -e "${RED}❌ Backend no respondió a tiempo${NC}"
  echo -e "${YELLOW}Logs del Backend:${NC}"
  docker-compose logs backend
  exit 1
fi

# Verificar Frontend
echo -e "${CYAN}🎨 Verificando Frontend...${NC}"
if check_health "frontend"; then
  echo -e "${GREEN}✅ Frontend está listo${NC}\n"
else
  echo -e "${RED}❌ Frontend no respondió a tiempo${NC}"
  echo -e "${YELLOW}Logs del Frontend:${NC}"
  docker-compose logs frontend
  exit 1
fi

# Mostrar resumen
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Todos los servicios están corriendo ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Frontend:${NC}   http://localhost:3000"
echo -e "${GREEN}🔌 Backend:${NC}    http://localhost:5001"
echo -e "${GREEN}📊 API Health:${NC} http://localhost:5001/api/v1/health"
echo -e "${GREEN}💾 PostgreSQL:${NC} localhost:5432"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}📝 Comandos útiles:${NC}"
echo -e "${YELLOW}   - Ver logs de todos los servicios:${NC}    docker-compose logs -f"
echo -e "${YELLOW}   - Ver logs de un servicio:${NC}           docker-compose logs -f [postgres|backend|frontend]"
echo -e "${YELLOW}   - Detener servicios:${NC}                 docker-compose down ${YELLOW}o${NC} Ctrl+C"
echo -e "${YELLOW}   - Ejecutar auditoría de seguridad:${NC}   npm run docker:audit"
echo -e "${YELLOW}   - Reconstruir imágenes:${NC}              ./docker-start.sh --build${NC}\n"

# Mostrar estado de los contenedores
echo -e "${MAGENTA}📊 Estado de los contenedores:${NC}\n"
docker-compose ps

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Mostrando logs en tiempo real (Ctrl+C para salir)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Seguir los logs de todos los servicios
docker-compose logs -f
