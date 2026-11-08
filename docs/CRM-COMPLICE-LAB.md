# CRM interno de Cómplice Lab

## Objetivo
Una sola fuente de verdad para que ningún contacto se pierda y para que Cómplice Lab sepa quién llegó, desde dónde, qué necesita, en qué etapa está y cuándo corresponde hacer seguimiento.

## Administrador
- Email autorizado: `complicelab@gmail.com`
- El acceso del navegador se restringe por Row Level Security a ese correo.
- No crear usuarios públicos del CRM.

## Flujo público
1. La persona completa el formulario.
2. Se registra autorización para responder la solicitud.
3. El servidor crea `crm_contacts`.
4. Se crea automáticamente un trabajo `contact.created` en `crm_agent_jobs`.
5. La experiencia pública puede continuar a WhatsApp sin esperar al CRM.
6. El futuro agente consume el trabajo, responde por WhatsApp y registra cada interacción en `crm_activities`.

## Preparación para agente de IA / WhatsApp
El agente debe:
- leer únicamente trabajos pendientes de `crm_agent_jobs`;
- validar `consent_service` antes de escribir por WhatsApp;
- no usar `consent_marketing=false` para campañas promocionales;
- guardar mensajes entrantes y salientes en `crm_activities`;
- actualizar `last_contact_at`, `next_follow_up_at`, `agent_status` y `status`;
- ser idempotente usando IDs externos de WhatsApp para evitar mensajes duplicados;
- detener automatización cuando un administrador marque `agent_enabled=false` o `agent_status=pausado`.

## Variables previstas
Servidor:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Navegador / admin:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (o `VITE_SUPABASE_ANON_KEY`)

## Estado actual
El código y la migración están preparados, pero Lovable no permitió habilitar Supabase por falta de créditos. No debe presentarse el CRM como operativo hasta:
1. habilitar la base del proyecto;
2. ejecutar `supabase/migrations/20261108_complice_lab_crm.sql`;
3. crear/invitar el usuario Auth `complicelab@gmail.com`;
4. configurar las variables;
5. probar creación de un lead real de extremo a extremo.
