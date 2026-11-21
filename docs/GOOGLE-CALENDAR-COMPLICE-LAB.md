# Cómplice Lab · Google Calendar desde el administrador

## Experiencia de uso
En /admin > Configuración: Enlazar Google Calendar, Sincronizar ahora, Desconectar, estado de cuenta, última sincronización y contadores.
En /admin > Clientes: listado independiente de oportunidades con nombre, empresa, email, WhatsApp, país, fecha de contacto, estado, buscador y paginación.

## Configuración inicial ÚNICA
Google exige registrar una aplicación OAuth y obtener el consentimiento de la cuenta propietaria. Después de completar estos pasos, el administrador podrá enlazar o reconectar desde el botón.

1. En https://console.cloud.google.com habilitar Google Calendar API.
2. Configurar pantalla OAuth. Si queda en Testing, algunos refresh tokens caducan a los 7 días; revisar el estado de publicación y sus requisitos.
3. Crear credencial OAuth Client tipo Web Application y registrar EXACTAMENTE https://complicelab.com/api/calendar/callback (ajustar si se utiliza otro dominio confirmado).
4. Guardar secretos exclusivamente en el servidor Lovable Cloud (nunca en variables públicas VITE_):
   - GOOGLE_CALENDAR_CLIENT_ID
   - GOOGLE_CALENDAR_CLIENT_SECRET
   - GOOGLE_CALENDAR_REDIRECT_URI = https://complicelab.com/api/calendar/callback
   - GOOGLE_CALENDAR_ENCRYPTION_KEY = 32 bytes aleatorios expresados en 64 caracteres hexadecimales; generar localmente con openssl rand -hex 32
   - SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya existentes.
5. Ejecutar en la MISMA base del CRM y en este orden:
   - supabase/migrations/20261121_google_calendar_connection.sql
   - supabase/migrations/20261121_calendar_import_no_notifications.sql
6. Confirmar que Lovable está utilizando el código de esta revisión. Entrar a /admin con complicelab@gmail.com y presionar Enlazar Google Calendar. Solo se acepta el consentimiento de esa misma cuenta Google.
7. Al volver del consentimiento, el panel abre Configuración e intenta sincronizar las citas existentes.

Seguridad: refresh token cifrado con AES-256-GCM en base de datos; tablas privadas con RLS y sin permisos de navegador; estado OAuth de un solo uso con PKCE y vencimiento; operaciones administrativas autenticadas.

## Sincronización
Busca citas de los últimos 180 días y próximos 365 días. Vincula solo si encuentra UNA coincidencia inequívoca por email de invitado, organizador o campos etiquetados de email/WhatsApp en la descripción. Ante ambigüedad no vincula ni crea contactos ficticios. Los eventos de todo el día bloquean disponibilidad, pero no se importan como citas de cliente.

Si ya hay una reunión del mismo contacto y hora en el CRM, añade el ID Google sin crear duplicados. Los eventos históricos importados no deben generar nuevas confirmaciones, WhatsApp ni trabajos de agente. Google -> CRM actualiza hora y cancelaciones al sincronizar; la cancelación desde Agenda actualiza Google antes de marcar el CRM.

El panel de configuración sincroniza cada cinco minutos cuando está abierto. Para continuar con el panel CERRADO hay que configurar un programador HTTPS que invoque POST https://complicelab.com/api/calendar/cron con Authorization: Bearer y el valor privado de CRM_CALENDAR_CRON_SECRET (mínimo 32 caracteres). El archivo de código incluye el endpoint, pero NO configura ni activa por sí solo el programador en Lovable.

Límites actuales: no hay editor de reprogramación CRM -> Google, importación de eventos sin identidad verificable, Google Meet automático, ni garantía de recuperación de todos los eventos eliminados fuera de la ventana de consulta.

## Validaciones previas a producción
- Ejecutar CI (tests, typecheck, build) y revisar su resultado.
- Conciliar main y lovable-sync sin sobrescribir historial; son ramas divergentes.
- Verificar RLS de clientes y tablas de OAuth, secreto servidor y migraciones.
- Conectar cuenta correcta y rechazar cualquier otra.
- Probar hora ocupada en Google, cita creada en web, importación de una anterior, duplicados, coincidencias ambiguas y cancelaciones desde ambos lados.
- Simular token revocado, caída temporal de Google y fallo de base.
- Confirmar política de tratamiento de datos para citas previamente almacenadas.
- No activar producción ni cron sin pruebas completas y aprobación de despliegue.

La existencia de estos archivos no demuestra por sí sola que Lovable Cloud ya esté conectado ni que Google haya sido autorizado.
