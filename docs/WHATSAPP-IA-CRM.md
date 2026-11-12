# Integración WhatsApp IA → CRM Cómplice Lab

## Estado
Código preparado en GitHub. **No afirmar que está desplegado u operativo** sin aplicar migración, configurar secretos y completar la prueba de extremo a extremo.

## Destino existente, sin crear otro CRM
- Prospectos: `public.crm_contacts`. Clave de coincidencia: número normalizado en `whatsapp` con `+`.
- `payload.nombre` → `full_name`, `empresa` → `brand_name`, `tipo_negocio` → `business_type`, `resumen_necesidad` → `need`, `interes` → `solution_interest`.
- Origen de captura del agente → `source = whatsapp_ia` para contactos nuevos; `payload.origen` → `source_detail` (si el contacto ya tenía otro origen, se conserva). `redes`, `pais_ciudad`, `profesionales_o_sedes`, `tiene_pagina_web`, `urgencia`, `origen`, `tema`, `detalle`, `motivo`, `fecha`, `mensaje` → `metadata.whatsapp_ia`.
- Cada evento → `public.crm_activities`, con su tipo, marca de tiempo recibida y resumen legible. Se impiden reintentos idénticos por identificador calculado.
- `lead_creado` → `nuevo`; `diagnostico_solicitado` → `diagnostico_solicitado`; `cita_confirmada` → `cita_agendada`; `escalado_a_humano` → `requiere_atencion`; `no_interesado` → `no_interesado`; `opt_out` → `no_contactar`. Los eventos nuevos no hacen retroceder etapas existentes.
- **Importante:** `cita_confirmada` indica la afirmación del agente y guarda `payload.fecha` en el historial y metadata. NO crea una reunión real en `crm_meetings` sin validar una reserva en la agenda.
- Los nuevos contactos del agente se crean sin asumir consentimiento para marketing o mensajes salientes (`consent_service=false`, `consent_marketing=false`). La aplicación del opt-out también debe respetarse en cualquier sistema emisor externo.

## Activación segura en el proyecto Supabase correcto
1. Confirmar la base real y migraciones previas del CRM.
2. Aplicar `supabase/migrations/20261112_whatsapp_ia_inbound.sql` después de `20261108_complice_lab_crm.sql` desde el entorno autorizado.
3. Crear en el gestor **privado** de secretos del proyecto el valor aleatorio de `CRM_WEBHOOK_SECRET`. No copiarlo a GitHub, código web, conversaciones ni capturas. Confirmar que el proyecto tiene `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como secretos de Edge Functions.
4. Desplegar `supabase/functions/recibir-prospecto-whatsapp`, con `verify_jwt = false` y validación obligatoria de `x-clave` dentro de la función.
5. URL esperada **solo después de confirmar despliegue**: `https://nrtokpnkaraltrzrgayi.supabase.co/functions/v1/recibir-prospecto-whatsapp`. El ID procede del `supabase/config.toml` versionado, pero no verifica despliegue ni entorno operativo.

## Pruebas obligatorias (sin enviar el secreto al chat)
- Sin `x-clave` o con clave incorrecta → HTTP 401 y cero registros creados.
- GET → HTTP 405 y cero escrituras.
- JSON inválido, evento no permitido o `wa_id` inválido → HTTP 400.
- POST válido → HTTP 200 `{"ok":true}`; contacto con marca WhatsApp IA visible en `/admin`.
- Mismo evento dos veces → un único registro de actividad.
- Evento posterior con valores vacíos → no borra campos.
- `diagnostico_solicitado`, `cita_confirmada`, `escalado_a_humano`, `no_interesado` y `opt_out` → etapas correctas; un `lead_creado` posterior no debe volver a Nuevo.
- Revisar filtro por origen, filtro por etapa, empresa, redes, necesidad, ciudad/país, historial y botón de WhatsApp.
- Verificar escritorio y móvil. El registro de prueba debe eliminarse con autorización del administrador después de validar el flujo.

## Límite de la verificación
Un commit de GitHub no equivale a migración ejecutada, secreto creado, función desplegada o webhook conectado al agente externo.
