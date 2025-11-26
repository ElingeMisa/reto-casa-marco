#!/bin/bash
# Resumen rápido de pruebas implementadas

echo "📊 RESUMEN DE PRUEBAS FUNCIONALES"
echo "=================================="
echo ""
echo "Frontend (PF):"
ls -1 tests/functional/frontend/*.test.* 2>/dev/null | wc -l | xargs echo "  Archivos:"
echo ""
echo "Backend (PB):"
ls -1 tests/functional/backend/*.test.* 2>/dev/null | wc -l | xargs echo "  Archivos:"
echo ""
echo "Integración (PIA):"
ls -1 tests/functional/integration/*.test.* 2>/dev/null | wc -l | xargs echo "  Archivos:"
echo ""
echo "Total:"
find tests/functional -name "*.test.*" -type f | wc -l | xargs echo "  Archivos de pruebas:"
