# OWASP ZAP Security Audit Container

Contenedor de auditoria de seguridad para evaluar la aplicacion Museo MARCO usando el framework OWASP.

## Requisitos

- Docker y Docker Compose instalados
- La aplicacion debe estar corriendo (frontend, backend, postgres)

## Uso Rapido

```bash
# Desde la raiz del proyecto

# Escaneo rapido (baseline) - ~5-10 minutos
./security/run-security-audit.sh baseline

# Escaneo completo activo - ~30-60 minutos
./security/run-security-audit.sh full

# Escaneo de API - ~15-30 minutos
./security/run-security-audit.sh api

# Todos los escaneos
./security/run-security-audit.sh all

# Interfaz web interactiva
./security/run-security-audit.sh ui
```

## Tipos de Escaneo

### 1. Baseline Scan (Pasivo)
- Escaneo rapido y no intrusivo
- Analiza respuestas HTTP sin modificar peticiones
- Detecta: headers de seguridad faltantes, cookies inseguras, divulgacion de informacion
- Ideal para: CI/CD pipelines, escaneos frecuentes

### 2. Full Scan (Activo)
- Escaneo completo con pruebas activas
- Realiza spider automatico de la aplicacion
- Detecta: XSS, SQL Injection, CSRF, vulnerabilidades de configuracion
- Ideal para: auditorias periodicas, pre-produccion

### 3. API Scan
- Enfocado en el backend REST API
- Prueba endpoints de la API
- Detecta: autenticacion debil, inyecciones, IDOR
- Ideal para: testing de APIs

### 4. UI Mode
- Interfaz web de ZAP para testing manual
- Accesible en: http://localhost:8080/zap/
- Permite configuracion avanzada y exploracion manual

## Reportes

Los reportes se generan en `security/owasp-zap/reports/` en multiples formatos:

- `*_report_*.html` - Reporte visual HTML
- `*_report_*.json` - Datos estructurados para integracion
- `*_report_*.md` - Markdown para documentacion

## Marco de Referencia OWASP Top 10 (2021)

Este contenedor evalua la aplicacion contra las categorias OWASP Top 10:

| Codigo | Categoria | Descripcion |
|--------|-----------|-------------|
| A01 | Broken Access Control | Control de acceso inadecuado |
| A02 | Cryptographic Failures | Fallos criptograficos |
| A03 | Injection | Inyeccion SQL, XSS, etc. |
| A04 | Insecure Design | Diseno inseguro |
| A05 | Security Misconfiguration | Configuracion de seguridad |
| A06 | Vulnerable Components | Componentes vulnerables |
| A07 | Auth Failures | Fallos de autenticacion |
| A08 | Data Integrity Failures | Integridad de datos |
| A09 | Logging Failures | Fallos de logging |
| A10 | SSRF | Server-Side Request Forgery |

## Comandos Docker Directos

```bash
# Baseline scan directo
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-baseline

# Full scan directo
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-full

# API scan directo
docker compose -f docker-compose.yml -f docker-compose.security.yml run --rm owasp-zap-api

# UI interactiva
docker compose -f docker-compose.yml -f docker-compose.security.yml up owasp-zap-ui
```

## Integracion con CI/CD

Ejemplo para GitHub Actions:

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Start services
      run: docker compose up -d

    - name: Wait for services
      run: sleep 30

    - name: Run OWASP ZAP baseline scan
      run: |
        docker compose -f docker-compose.yml -f docker-compose.security.yml \
          run --rm owasp-zap-baseline

    - name: Upload security reports
      uses: actions/upload-artifact@v4
      with:
        name: owasp-zap-reports
        path: security/owasp-zap/reports/
```

## Configuracion Personalizada

Editar `security/owasp-zap/zap-config.conf` para ajustar:

- Duracion maxima de escaneo
- Profundidad del spider
- Reglas activas/desactivadas
- Parametros de conexion

## Solucion de Problemas

### El escaneo no encuentra la aplicacion
```bash
# Verificar que los servicios estan corriendo
docker compose ps

# Verificar conectividad
docker compose exec owasp-zap-baseline curl -I http://frontend:80
```

### Permisos de reportes
```bash
# Los reportes se crean como usuario 'zap' (UID 1000)
# Si hay problemas de permisos:
sudo chown -R $USER:$USER security/owasp-zap/reports/
```

### Memoria insuficiente
ZAP puede requerir memoria adicional. Agregar a docker-compose.security.yml:
```yaml
deploy:
  resources:
    limits:
      memory: 4G
```
