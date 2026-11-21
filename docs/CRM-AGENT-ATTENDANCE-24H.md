# Cómplice Lab — Confirmación de asistencia por agente WhatsApp (24 h)
Actualización: 21 de noviembre de 2026.

## Separación obligatoria de eventos
- cita_confirmada (evento antiguo) = el agente registró una reserva comercial. NO demuestra que la persona aceptó asistir 24 h antes.
- recordatorio_asistencia_enviado = el agente externo confirmó que envió el recordatorio de la reunión específica. El CRM registra el envío, **no** la entrega ni la lectura de WhatsApp.
- asistencia_confirmada = el usuario respondió claramente que sí asistirá; status confirmada y attendance_status confirmada.
- asistencia_rechazada = el usuario respondió claramente que NO asistirá; status cancelada y attendance_status no_asistira.
- asistencia_dudosa = no hay decisión clara / solicita coordinación; status pendiente y attendance_status requiere_atencion.
- Sin respuesta = status pendiente y attendance_status por_confirmar. No cancelar automáticamente por silencio.

La confirmación viene del agente externo que ya opera la mensajería. ESTA IMPLEMENTACIÓN NO ENVÍA NUEVOS RECORDATORIOS NI DEBE DUPLICAR LOS QUE CRISTIAN YA PROGRAMÓ EN SU AGENTE. Debe configurarse la automatización existente para emitir estos eventos estructurados al webhook ya conectado. Un mensaje del usuario en WhatsApp que NO llegue como evento al webhook NO modifica el CRM.

## Contrato de eventos para el agente existente
Endpoint existente de recepción del proyecto Supabase:
https://nrtokpnkaraltrzrgayi.supabase.co/functions/v1/recibir-prospecto-whatsapp

POST con Content-Type application/json y cabecera privada x-clave (mismo CRM_WEBHOOK_SECRET del agente ya conectado). No compartir ni volver a crear el secreto.

Evento de recordatorio tras confirmar envío del agente (aproximadamente 24 h antes):
{
  "event_type": "recordatorio_asistencia_enviado",
  "wa_id": "573001234567",
  "timestamp": "2026-11-23T14:00:00Z",
  "payload": {
    "meeting_id": "UUID_REAL_DE_LA_CITA",
    "message_id": "wamid.MENSAJE_SALIENTE_UNICO"
  }
}

Evento de respuesta entrante clara (sí o no, no inventar clasificación):
{
  "event_type": "asistencia_confirmada",
  "wa_id": "573001234567",
  "timestamp": "2026-11-23T14:30:00Z",
  "payload": {
    "meeting_id": "MISMO_UUID_REAL_DE_LA_CITA",
    "message_id": "wamid.MENSAJE_ENTRANTE_UNICO",
    "respuesta_texto": "Sí, confirmo asistencia"
  }
}

Para NO usar event_type asistencia_rechazada; para dudas usar asistencia_dudosa. El agente debe clasificar únicamente cuando sea inequívoco, no inferir un "sí" por saludos, mensajes del sistema ni palabras aisladas fuera del contexto de esa reunión. Si hubo duda, marcar requiere_atencion. NO usar cita_confirmada para la RSVP.

## Seguridad e idempotencia
- La Edge Function autentica x-clave de forma constante y distingue los eventos antiguos de estos nuevos.
- El evento requiere meeting_id válido y message_id original único, sin los cuales no cambia ninguna cita.
- La base confirma que el WhatsApp remitente coincide con la reunión específica o su contacto asociado y que la respuesta fue posterior al recordatorio de esa MISMA reunión.
- Solo se admiten respuestas entre la ventana de 36 h previa a la cita y la hora de inicio; duplicados por message_id no crean acciones repetidas.
- Mensajes antiguos fuera de orden no sustituyen respuestas más recientes. La cita cancelada por un rechazo NO se reactiva automáticamente con un mensaje tardío; se debe programar una nueva cita.
- Se escriben actividades en el historial del contacto con fecha, meeting_id, message_id y texto breve. No se generan contactos nuevos ni se modifica el estado de clientes no relacionados.
- El estado de asistencia del navegador no se puede sobrescribir manualmente; el servidor service_role es quien registra las respuestas del agente.

## Google Calendar
- La cita rechazada queda cancelada inmediatamente en el CRM.
- Si tiene external_calendar_id, calendar_cancel_pending=true hasta que una sincronización autorizada cancele el evento Google.
- La rutina de sincronización elimina el evento en Google con sendUpdates=all, registra el resultado y evita que la sincronización recree una cita declinada.
- Si Google no responde o el cron no está activo, el administrador verá "cancelación en Google pendiente"; no se declara liberado el horario hasta que la API lo confirme.
- El cron protegido CRM_CALENDAR_CRON_SECRET debe estar configurado y probado por separado. No confundir conexión OAuth con cron funcionando.

## Activación Lovable Cloud
1. Usar la misma base CRM existente. Hacer conteos y copia/registro de los datos antes de migrar.
2. Aplicar UNA SOLA VEZ el archivo supabase/migrations/20261121_agent_attendance_confirmation.sql (o su espejo drizzle/migrations/0010_agent_attendance_confirmation.sql, no ambas).
3. Comprobar tipos, función crm_apply_attendance_agent_event, trigger crm_guard_meeting_attendance, permisos y RLS. No cambiar ni borrar secretos.
4. Desplegar la nueva versión de supabase/functions/recibir-prospecto-whatsapp/index.ts en el MISMO proyecto con la misma CRM_WEBHOOK_SECRET.
5. Actualizar el agente externo para enviar el nuevo formato de eventos. Conectar el meeting_id real al mensaje de recordatorio: el texto del cliente, sin ID de reunión, no es suficiente para modificar el CRM.
6. Verificar la agenda web actualizada (nueva bandeja: Por confirmar, Confirmadas por respuesta, Requieren atención, Canceladas).
7. Simular el flujo únicamente con una reunión ficticia controlada y datos propios consentidos: primero recordatorio, luego un "sí" con message_id diferente; comprobar 1 solo cambio. Hacer prueba análoga de "no" en otra reunión controlada y comprobar cancelación en Google. Repetir cada webhook para confirmar idempotencia.
8. Probar teléfono incorrecto, cita inexistente, message_id repetido, respuestas antes del recordatorio, respuesta posterior a cita, evento antiguo cita_confirmada y cancelación Google fallida. En ninguno se debe modificar otra cita.
9. Verificar publicación de la web. No declarar operativo 24/7 hasta tener prueba de agente > webhook > SQL > CRM > Google.

## Observaciones importantes
### Auditoría de activación en Lovable Cloud
- Base existente: asistencia activada mediante `0009_activate_agent_attendance_confirmation.sql`; no ejecutar el espejo legado dañado `0010_agent_attendance_confirmation.sql`.
- Se reparó una expresión regular SQL sin cierre y un bloque duplicado fuera de la función. Se añadió `extensions` al contexto de ejecución de la recepción y autenticación segura incluso sin rol.
- Se aplicó `0010_calendar_review_and_attach_dependency.sql` para las dependencias faltantes de revisión Calendar y `0011_attendance_reply_negative_safety.sql` para evitar afirmaciones sobre textos negativos.
- Webhook existente desplegado y probado con citas identificadas como auditoría. Los fixtures quedan cancelados, con historial conservado; no se enviaron mensajes ni correos.
- Reversión segura: deshabilitar emisión de los cuatro eventos de asistencia en el agente externo y volver al receptor anterior; mantener columnas e historial, sin retirar tablas. Cualquier reversión de funciones debe ser una migración nueva y revisada, nunca ejecutar el SQL legado roto.
- Cancelaciones: callback autenticado `/api/public/calendar/attendance` verifica identidad y horario del evento antes de borrarlo en Google; la sincronización reutiliza la misma verificación.
- La publicación fue rechazada. El callback y la interfaz nueva no están confirmados en producción. No hay tarea HTTP programada ni `CRM_CALENDAR_CRON_SECRET`; no se afirma reconciliación 24/7.
- Confirmación, rechazo, silencio, dudas, duplicados y bloqueo admin se verificaron contra el webhook/base reales. Cancelación Google exitosa/fallida se verificó con proveedor simulado; lectura Calendar y FreeBusy con la cuenta real. No se canceló una cita real.

La migración restablece como pendientes SOLO las reuniones futuras de diagnóstico de origen web/google_calendar sin RSVP demostrada; conserva reuniones pasadas y estados de resultado ya finalizados. Al cambiar la fecha de una cita vigente se invalida el RSVP antiguo y el CRM vuelve a exigir confirmación para la nueva fecha. Las citas de Google que no estén vinculadas a un contacto del CRM deben relacionarse primero mediante la bandeja de revisión; no se asocian por nombre.

Este proyecto no tiene acceso directo desde GitHub a los secretos del agente externo, al tráfico privado de Meta ni a la base de datos en vivo. El código puede estar integrado en main, pero su despliegue y el envío real de recordatorios deben verificarse independientemente.
