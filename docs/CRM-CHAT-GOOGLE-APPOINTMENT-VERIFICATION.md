# Cómplice Lab · Comprobación de reservas de WhatsApp, CRM y Google

## Objetivo
Nunca confundir una sugerencia de horario conversada por WhatsApp, una reserva real
registrada y la **confirmación de asistencia** del cliente. Preservar el agente
de Railway sin alterar mensajes, prompts o recordatorios.

## Tres pruebas independientes
1. **Reserva real:** existe una fila concreta en `crm_meetings`.
   Un evento `cita_confirmada` en `crm_activities` solo demuestra lo que
   comunicó el agente; si el contacto no tiene reunión, queda en revisión.
2. **Google:** la cita tiene `external_calendar_id` y el evento existe en
   el Google Calendar conectado, con el mismo comienzo y fin. Fuera del rango
   consultado, se muestra `Google aún no verificado`, nunca "sincronizado".
3. **Confirmación de asistencia:** una actividad `asistencia_confirmada`
   del agente coincide en `contact_id`, `meeting_id`, `message_id`,
   `event_timestamp`, `attendance_reminder_at`,
   `attendance_responded_at`, estado de la cita y origen `whatsapp_ia`.
   `cita_confirmada` NO cuenta como RSVP afirmativa.

Un Google Event con estado `confirmed` significa que existe como evento,
NO que el cliente haya respondido «Sí asistiré». Una cita reservada sin esa
respuesta permanece `Por confirmar`; se puede mantener bloqueado el horario
para evitar reservas dobles, pero nunca presentar como asistencia confirmada.

## Correcciones
- `synchronizeGoogleAppointments` ya no reabre por su cuenta una reunión
  cancelada porque su evento reapareció en Google; requiere revisión humana.
- Los registros futuros `confirmada` sin `attendance_status=confirmada`
  se normalizan a `pendiente` al sincronizarlos.
- La Agenda muestra auditoría WhatsApp + Google por cita, avisos de desacuerdo
  de hora, eventos Google no encontrados y citas sin vínculo.
- Se muestran conversaciones donde el evento comercial del agente indicó
  `cita_confirmada` pero no se localiza una reunión del contacto entre las
  reuniones cargadas (máximo 500). No se inventa una cita.
- Si la consulta de evidencia de WhatsApp falla, NO se acredita automáticamente
  una confirmación.
- La configuración advierte cuando `last_cron_at` está vacío o tiene más
  de 30 minutos. Un GitHub Action verde no demuestra sincronización:
  el workflow existente termina exitosamente cuando no hay secreto.

## Problemas operativos pendientes comprobados
El último log consultado de GitHub Actions el 27/11/2026 tenía
`CALENDAR_CRON_TOKEN` vacío y el aviso de que falta
`CRM_CALENDAR_CRON_SECRET`. Así que el HTTP POST programado NO se ejecutó
en ese intento. Se necesita el mismo secreto (mínimo 32 caracteres) en
**Lovable Cloud servidor** y en **GitHub Actions Secrets**. No copiar los
valores al código ni a la conversación. Cuando esté presente, comprobar un
HTTP 200 real, `last_cron_at` reciente y cambios efectivos de eventos.

No se han inspeccionado íntegramente las conversaciones en Railway Postgres:
la integración de Railway de esta conversación permite estadísticas y logs,
pero no consultas SQL SELECT a las filas. La auditoría del CRM usa la evidencia
de agente recibida en `crm_activities`. Si no llegó el evento o `meeting_id`,
queda como NO VERIFICADO, nunca como una confirmación supuesta.

## Verificación posterior a publicación
1. Ver la nueva auditoría en /admin > Agenda, con registros reales y Google.
2. Identificar una cita de prueba consensuada y comprobar vinculación y horas.
3. Simular solo con datos propios: respuesta afirmativa del agente con
   `meeting_id` correcto y `message_id` único; comprobar una sola confirmación.
4. Contrastar con respuesta negativa: CRM cancelado, Google cancelado o pendiente
   visible, nunca reactivado por sincronización.
5. Repetir con evento comercial `cita_confirmada` sin reserva: NO se cuenta
   como reunión confirmada; debe aparecer en revisión.
6. Comprobar la sincronización programada con panel cerrado, sin enviar mensajes
   adicionales a clientes reales.
