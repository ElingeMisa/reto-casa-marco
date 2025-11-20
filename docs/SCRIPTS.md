# 📜 Documentación de Scripts NPM

Este documento explica todos los scripts disponibles en el proyecto y cómo funcionan.

## 🚀 Scripts de Inicio

### `npm run dev`
**Inicio automático de backend + frontend**

Este es el comando recomendado para desarrollo. Ejecuta el script `start-services.sh` que:

1. **Limpia procesos previos**: Detiene cualquier servicio anterior en los puertos 5001 y 3000
2. **Inicia el backend**: Lanza el servidor Node.js/Express en puerto 5001
3. **Verifica salud del backend**: Hace hasta 30 intentos de conectar al endpoint `/api/v1/health`
4. **Valida el backend**: Si el backend no responde en 30 segundos, aborta y muestra los logs
5. **Inicia el frontend**: Si el backend está OK, lanza React en puerto 3000
6. **Muestra información**: Imprime URLs de acceso y ubicación de logs
7. **Streaming de logs**: Muestra los logs del backend en tiempo real

**Uso:**
```bash
npm run dev
```

**Salida esperada:**
```
🚀 Iniciando servicios del Museo MARCO...
🧹 Limpiando procesos previos...
📦 Iniciando backend en puerto 5001...
⏳ Esperando a que el backend esté listo...
✅ Backend iniciado correctamente en http://localhost:5001
🎨 Iniciando frontend en puerto 3000...
✅ Frontend iniciado correctamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Todos los servicios están corriendo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend: http://localhost:3000
🔌 Backend:  http://localhost:5001
💾 Database: PostgreSQL en localhost:5432
```

**Logs guardados en:**
- `backend.log` - Logs del servidor Node.js
- `frontend.log` - Logs de React

---

## 🛑 Scripts de Detención

### `npm run stop`
**Detiene todos los servicios (backend + frontend)**

```bash
npm run stop
```

Ejecuta secuencialmente:
1. `npm run backend:stop`
2. `npm run frontend:stop`

### `npm run backend:stop`
**Detiene solo el backend**

```bash
npm run backend:stop
```

Busca y mata el proceso en el puerto 5001 usando:
```bash
lsof -ti:5001 | xargs kill -9
```

### `npm run frontend:stop`
**Detiene solo el frontend**

```bash
npm run frontend:stop
```

Busca y mata el proceso en el puerto 3000 usando:
```bash
lsof -ti:3000 | xargs kill -9
```

---

## ⚙️ Scripts de Backend

### `npm run backend:start`
**Inicia el backend en modo desarrollo**

```bash
npm run backend:start
```

Equivalente a:
```bash
cd backend && npm run dev
```

Inicia el servidor con **nodemon** para hot-reload automático.

### `npm run backend:prod`
**Inicia el backend en modo producción**

```bash
npm run backend:prod
```

Equivalente a:
```bash
cd backend && npm start
```

Inicia el servidor con **Node.js** sin hot-reload.

---

## 🎨 Scripts de Frontend

### `npm start`
**Inicia el frontend en modo desarrollo**

```bash
npm start
```

Ejecuta `react-scripts start` y abre el navegador automáticamente en http://localhost:3000

### `npm run build`
**Crea build de producción**

```bash
npm run build
```

Genera archivos optimizados en la carpeta `/build` listos para deployment.

### `npm test`
**Ejecuta tests con coverage**

```bash
npm test
```

Corre los tests de Jest con reporte de cobertura.

---

## 🔄 Scripts de Utilidad

### `npm run restart`
**Reinicia el frontend**

```bash
npm run restart
```

Ejecuta:
1. `npm run stop` - Detiene todos los servicios
2. `npm start` - Inicia solo el frontend

⚠️ **Nota**: Solo reinicia el frontend, no el backend.

### `npm run lint`
**Analiza código con ESLint**

```bash
npm run lint
```

Verifica archivos TypeScript/TSX en busca de errores de estilo.

### `npm run format`
**Formatea código con Prettier**

```bash
npm run format
```

Formatea automáticamente archivos TS, TSX, JSON, CSS y MD.

---

## 🔒 Scripts de Seguridad

### `npm run security:audit`
**Auditoría de dependencias**

```bash
npm run security:audit
```

Ejecuta `npm audit` solo en dependencias de producción.

### `npm run security:snyk`
**Escaneo de vulnerabilidades con Snyk**

```bash
npm run security:snyk
```

Requiere cuenta de Snyk configurada.

### `npm run security:secrets`
**Detecta secretos en el código**

```bash
npm run security:secrets
```

Usa `gitleaks` para encontrar credenciales hardcodeadas.

---

## 📊 Otros Scripts

### `npm run analyze`
**Analiza el tamaño del bundle**

```bash
npm run analyze
```

Requiere hacer `npm run build` primero. Muestra visualización del tamaño de los archivos JS.

---

## 🎯 Flujo de Trabajo Recomendado

### Desarrollo Diario

```bash
# 1. Iniciar todo
npm run dev

# 2. Trabajar en el código...

# 3. Al terminar
npm run stop
```

### Testing y Validación

```bash
# Formatear código
npm run format

# Verificar estilo
npm run lint

# Correr tests
npm test

# Auditar seguridad
npm run security:audit
```

### Deployment

```bash
# Crear build
npm run build

# Iniciar backend en producción
npm run backend:prod
```

---

## 🐛 Troubleshooting

### Error: "Backend no responde"
Si `npm run dev` falla porque el backend no responde:

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   brew services list | grep postgresql
   ```

2. Revisa el archivo `backend.log`:
   ```bash
   cat backend.log
   ```

3. Verifica las credenciales en `backend/.env`

### Error: "Port already in use"
Si los puertos están ocupados:

```bash
# Detener todo
npm run stop

# Si persiste, matar manualmente
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Permisos denegados en start-services.sh
Si obtienes error de permisos:

```bash
chmod +x start-services.sh
```

---

## 📝 Notas

- Los archivos `backend.log` y `frontend.log` están en `.gitignore`
- El script `start-services.sh` es específico para Unix/Linux/macOS
- Para Windows, considera usar WSL o Git Bash
- Los scripts usan `lsof` que viene preinstalado en macOS y Linux

---

**¡Listo!** Con estos scripts puedes gestionar fácilmente el ciclo de vida de tu aplicación. 🚀
