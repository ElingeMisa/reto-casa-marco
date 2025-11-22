#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Guardar el directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Iniciando servicios del Museo MARCO${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Función de limpieza al salir
cleanup() {
  echo -e "\n${YELLOW}🛑 Deteniendo servicios...${NC}"
  cd "$PROJECT_ROOT"
  npm run stop > /dev/null 2>&1
  echo -e "${GREEN}✅ Servicios detenidos${NC}"
  exit 0
}

# Capturar Ctrl+C y otros señales
trap cleanup SIGINT SIGTERM

# Detener servicios previos si existen
echo -e "${YELLOW}🧹 Limpiando procesos previos...${NC}"
cd "$PROJECT_ROOT"
npm run stop > /dev/null 2>&1
echo -e "${GREEN}✓ Procesos limpiados${NC}\n"

# Verificar si existe la base de datos
echo -e "${YELLOW}🗄️  Verificando base de datos PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
  if psql -U vicm -d museo_marco -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✓ Base de datos disponible${NC}\n"
  else
    echo -e "${YELLOW}⚠️  Base de datos no encontrada, asegúrate de que PostgreSQL esté corriendo${NC}"
    echo -e "${YELLOW}   Puedes iniciar con Docker: docker-compose up -d postgres${NC}\n"
  fi
else
  echo -e "${YELLOW}⚠️  PostgreSQL CLI no encontrado, continuando...${NC}\n"
fi

# Verificar dependencias del backend
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
  echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
  cd "$PROJECT_ROOT/backend"
  npm install
  echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}\n"
fi

# Verificar dependencias del frontend
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
  echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
  cd "$PROJECT_ROOT"
  npm install
  echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}\n"
fi

# Iniciar backend
echo -e "${YELLOW}📦 Iniciando backend en puerto 5001...${NC}"
cd "$PROJECT_ROOT/backend"
npm run dev > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  # Verificar si el proceso del backend sigue corriendo
  if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo -e "\n${RED}❌ Error: El backend falló al iniciar${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}Logs del backend:${NC}\n"
    cat "$PROJECT_ROOT/backend.log"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
  fi

  # Intentar conectar al endpoint de salud
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/v1/health 2>/dev/null)

  if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend listo y respondiendo${NC}\n"
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))

  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "\n${RED}❌ Timeout: El backend no respondió después de 30 segundos${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}Logs del backend:${NC}\n"
    cat "$PROJECT_ROOT/backend.log"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi

  echo -e "${YELLOW}   Intento $ATTEMPT/$MAX_ATTEMPTS...${NC}"
  sleep 1
done

# Iniciar frontend
echo -e "${YELLOW}🎨 Iniciando frontend en puerto 3000...${NC}"
cd "$PROJECT_ROOT"
npm start > "$PROJECT_ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

# Esperar a que el frontend compile y esté listo
echo -e "${YELLOW}⏳ Esperando compilación del frontend...${NC}"
MAX_FRONTEND_ATTEMPTS=60
FRONTEND_ATTEMPT=0

while [ $FRONTEND_ATTEMPT -lt $MAX_FRONTEND_ATTEMPTS ]; do
  # Verificar si el proceso del frontend sigue corriendo
  if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo -e "\n${RED}❌ Error: El frontend falló al iniciar${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}Logs del frontend:${NC}\n"
    cat "$PROJECT_ROOT/frontend.log"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    npm run backend:stop > /dev/null 2>&1
    exit 1
  fi

  # Verificar si el frontend está listo
  if grep -q "webpack compiled" "$PROJECT_ROOT/frontend.log" || \
     grep -q "Compiled successfully" "$PROJECT_ROOT/frontend.log" || \
     curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend compilado y listo${NC}\n"
    break
  fi

  # Verificar si hay errores de compilación
  if grep -q "Failed to compile" "$PROJECT_ROOT/frontend.log"; then
    echo -e "\n${RED}❌ Error: El frontend falló al compilar${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    tail -n 50 "$PROJECT_ROOT/frontend.log"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    npm run stop > /dev/null 2>&1
    exit 1
  fi

  FRONTEND_ATTEMPT=$((FRONTEND_ATTEMPT + 1))

  if [ $FRONTEND_ATTEMPT -eq $MAX_FRONTEND_ATTEMPTS ]; then
    echo -e "\n${YELLOW}⚠️  Timeout esperando compilación del frontend${NC}"
    echo -e "${YELLOW}El frontend puede estar iniciando, verifica los logs${NC}\n"
  fi

  sleep 2
done

# Mostrar resumen
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Todos los servicios están corriendo ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Frontend:${NC}  http://localhost:3000"
echo -e "${GREEN}🔌 Backend:${NC}   http://localhost:5001"
echo -e "${GREEN}📊 API Docs:${NC}  http://localhost:5001/api/v1/health"
echo -e "${GREEN}💾 Database:${NC} PostgreSQL en localhost:5432"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${YELLOW}📝 Comandos útiles:${NC}"
echo -e "${YELLOW}   - Detener servicios:${NC} npm run stop ${YELLOW}o${NC} Ctrl+C"
echo -e "${YELLOW}   - Ver logs backend:${NC} tail -f backend.log"
echo -e "${YELLOW}   - Ver logs frontend:${NC} tail -f frontend.log"
echo -e "${YELLOW}   - Ejecutar auditoría:${NC} npm run audit${NC}\n"

# Mantener el script corriendo y mostrar logs en tiempo real
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Logs en tiempo real (Ctrl+C para salir)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Mostrar logs de ambos servicios
tail -f "$PROJECT_ROOT/backend.log" "$PROJECT_ROOT/frontend.log"
