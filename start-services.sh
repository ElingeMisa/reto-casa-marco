#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Guardar el directorio raíz del proyecto
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo -e "${YELLOW}🚀 Iniciando servicios del Museo MARCO...${NC}\n"

# Detener servicios previos si existen
echo -e "${YELLOW}🧹 Limpiando procesos previos...${NC}"
cd "$PROJECT_ROOT"
npm run stop > /dev/null 2>&1

# Iniciar backend
echo -e "${YELLOW}📦 Iniciando backend en puerto 5001...${NC}"
cd "$PROJECT_ROOT/backend"
npm run dev > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo -e "${YELLOW}⏳ Esperando a que el backend esté listo...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  # Verificar si el proceso del backend sigue corriendo
  if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: El backend falló al iniciar${NC}"
    echo -e "${RED}Revisa el archivo backend.log para más detalles${NC}"
    cat "$PROJECT_ROOT/backend.log"
    exit 1
  fi

  # Intentar conectar al endpoint de salud
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/v1/health 2>/dev/null)

  if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend iniciado correctamente en http://localhost:5001${NC}\n"
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))

  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Timeout: El backend no respondió después de 30 segundos${NC}"
    echo -e "${RED}Revisa el archivo backend.log para más detalles${NC}"
    cat "$PROJECT_ROOT/backend.log"
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

# Esperar un momento para verificar que el frontend inició
sleep 3

if ps -p $FRONTEND_PID > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Frontend iniciado correctamente${NC}\n"
else
  echo -e "${RED}❌ Error: El frontend falló al iniciar${NC}"
  echo -e "${RED}Revisa el archivo frontend.log para más detalles${NC}"
  cat "$PROJECT_ROOT/frontend.log"
  npm run backend:stop > /dev/null 2>&1
  exit 1
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Todos los servicios están corriendo${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:3000"
echo -e "${GREEN}🔌 Backend:${NC}  http://localhost:5001"
echo -e "${GREEN}💾 Database:${NC} PostgreSQL en localhost:5432"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
echo -e "${YELLOW}📝 Para detener los servicios ejecuta:${NC} npm run stop"
echo -e "${YELLOW}📋 Logs disponibles en:${NC} backend.log y frontend.log\n"

# Mantener el script corriendo y mostrar logs del backend
echo -e "${YELLOW}📊 Mostrando logs del backend (Ctrl+C para salir):${NC}\n"
tail -f "$PROJECT_ROOT/backend.log"
