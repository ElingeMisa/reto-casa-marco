# Documentación de Pruebas Funcionales - Museo MARCO

Esta carpeta contiene la documentación detallada de todas las pruebas funcionales implementadas en el proyecto, basadas en el plan de pruebas OWASP y los requerimientos de seguridad.

## 📚 Índice de Documentación

### Pruebas de Frontend (PF)
- [PF-01: Validación de Formularios](./PF-01-validacion-formularios.md)
- [PF-02: Protección Clickjacking](./PF-02-proteccion-clickjacking.md)
- [PF-03: Almacenamiento Seguro de Tokens](./PF-03-almacenamiento-tokens.md)
- [PF-04: Rate Limiting Visual](./PF-04-rate-limiting-visual.md)

### Pruebas de Backend (PB)
- [PB-01: Hash Seguro de Contraseñas](./PB-01-hash-passwords.md)
- [PB-02: Protección SQL Injection](./PB-02-sql-injection.md)
- [PB-03: Política de Contraseñas](./PB-03-politica-passwords.md)

### Pruebas de Integración (PIA)
- [PIA-01: Control de Acceso por Roles](./PIA-01-control-acceso-roles.md)
- [PIA-02: Validación de Sesión](./PIA-02-validacion-sesion.md)

## 🎯 Objetivo

Cada documento de prueba incluye:

1. **Descripción**: Qué se prueba y por qué es importante
2. **Referencia OWASP**: Mapeo a vulnerabilidades OWASP Top 10
3. **Casos de Prueba**: Lista detallada de escenarios
4. **Implementación**: Ejemplos de código y configuración
5. **Resultados Esperados**: Qué debe pasar cuando se ejecuta la prueba
6. **Remediaciones**: Cómo solucionar vulnerabilidades encontradas
7. **Referencias**: Documentación adicional y recursos

## 📊 Estado de Implementación

| ID | Prueba | Estado | Archivo Test | Documentación |
|----|--------|--------|--------------|---------------|
| PF-01 | Validación formularios | ✅ | `PF-01-validacion-formulario-login.test.tsx` | ✅ |
| PF-02 | Clickjacking | ✅ | `PF-02-proteccion-clickjacking.test.ts` | ✅ |
| PF-03 | Tokens seguros | ✅ | `PF-03-almacenamiento-tokens.test.ts` | ✅ |
| PF-04 | Rate limiting | ✅ | `PF-04-rate-limiting-visual.test.tsx` | ✅ |
| PB-01 | Hash passwords | ✅ | `PB-01-hash-passwords.test.ts` | ✅ |
| PB-02 | SQL Injection | ✅ | `PB-02-sql-injection.test.ts` | ✅ |
| PB-03 | Política passwords | ✅ | `PB-03-politica-passwords.test.ts` | ✅ |
| PIA-01 | Control acceso | ✅ | `PIA-01-control-acceso-roles.test.ts` | ✅ |
| PIA-02 | Validación sesión | ✅ | `PIA-02-validacion-sesion.test.ts` | ✅ |

**Total**: 9/16 pruebas implementadas (56%)

## 🚀 Cómo Usar Esta Documentación

### Para Desarrolladores

1. **Antes de implementar una feature**: Lee la documentación relevante para entender los requisitos de seguridad
2. **Durante el desarrollo**: Usa los ejemplos de código como referencia
3. **Después de implementar**: Ejecuta las pruebas para verificar cumplimiento

### Para QA/Testers

1. **Planificación**: Revisa los casos de prueba documentados
2. **Ejecución**: Usa los comandos especificados para ejecutar pruebas
3. **Reporte**: Documenta resultados según la estructura proporcionada

### Para Auditores de Seguridad

1. **Revisión**: Cada prueba está mapeada a OWASP Top 10
2. **Verificación**: Los resultados esperados están claramente definidos
3. **Evidencia**: Las pruebas generan logs y reportes automáticos

## 📖 Estructura de Documentos

Cada documento sigue esta estructura:

```markdown
# [ID]: [Nombre de la Prueba]

## 📋 Información General
- Categoría
- Prioridad
- OWASP
- Estado

## 🎯 Objetivo
Descripción de qué se prueba

## 🔍 Casos de Prueba
Lista de escenarios

## 💻 Implementación
Ejemplos de código

## ✅ Resultados Esperados
Comportamiento correcto

## 🔧 Remediación
Cómo fix vulnerabilidades

## 📚 Referencias
Links y recursos
```

## 🔗 Enlaces Útiles

- **Código de Pruebas**: `../../tests/functional/`
- **Plan de Pruebas Original**: `../design/pruebas de página.pdf`
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP Testing Guide**: https://owasp.org/www-project-web-security-testing-guide/

## 📝 Notas

- Esta documentación se actualiza con cada nueva prueba implementada
- Los ejemplos de código son funcionales y probados
- Las remediaciones están alineadas con mejores prácticas de la industria
