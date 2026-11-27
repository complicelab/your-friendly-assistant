# Cómplice Lab · Embudo comercial y analítica

## Qué mide
La sección **Embudo y métricas** dentro de /admin utiliza las tablas existentes
crm_contacts, crm_meetings y crm_activities a través de la sesión de administrador y RLS.
No crea ni reemplaza base de datos, no modifica contactos, reuniones ni WhatsApp.

- Leads: contactos únicos captados en el período (30/90/365 días o todo).
- Interesados: etapas expresas de interés, evento diagnóstico solicitado o cita real.
- Agendaron: contactos únicos con al menos una reunión real en crm_meetings,
  incluyendo canceladas para medir conversión de captación a agendamiento.
- Confirmaron asistencia: contactos con asistencia explícita del agente en crm_meetings.
- Asistencia efectiva: reuniones Realizadas / (Realizadas + No asistió).
  Excluye reuniones futuras, pendientes y canceladas.
- Cancelaciones: reuniones Canceladas / total de reuniones reales de la cohorte.
- Ventas: contactos con estado comercial ganado. No se deduce de haber asistido.
- Interesados sin cita: interesados menos los que agendaron.
- Situación actual: clasificación mutuamente excluyente por contacto,
  incluidos nuevos, conversación, interés, cita, confirmación, resultado,
  propuesta, ganado, perdido, no interesado, no contactar y abandono explícito.
- Desglose por fuente: canal registrado por CRM, no automáticamente ROAS
  o una atribución fiable por campaña de Meta sin UTMs y costos asociados.

## Modelo de períodos
Todas las conversiones se calculan por **cohorte de leads captados en el período
elegido**. Las reuniones posteriores de estos mismos clientes se contabilizan para
el histórico de la cohorte. No se deben comparar como si fueran "citas creadas
este mes". Un lead puede haber tenido múltiples citas, pero se cuenta una vez
para la tasa de leads que agendaron.

La interfaz excluye por defecto contactos identificados como pruebas por nombre
PRUEBA/TEST u origen prueba_tecnica/test_fixture y ofrece un control para incluirlos.
No se eliminan registros. El listado tiene límite explícito de 12.000 registros
por tabla; al excederlo NO muestra porcentajes como exhaustivos.

## Abandonados
**No se infiere abandono a partir de silencio.** El webhook existente NO registra
aún un evento documentado de abandono comercial. Hasta verificar el contrato del
agente desplegado en Railway, se muestra "Sin medición verificada", no un cero falso.

Al conectar Railway, inspeccionar los flujos de mensajes y acordar una señal
objetiva de abandono: por ejemplo, sin respuesta tras dos seguimientos y una
ventana de tiempo configurable, pero esto es una propuesta y requiere revisión
comercial. El agente debe emitir un evento de abandono con timestamp,
contact_id/wa_id, motivo, identificador único de evento y evidencia suficiente.
No se debe marcar abandonado a quien solicitó no contactar ni a quien ya agendó
o está pendiente de una cita. Debe poder reactivarse una oportunidad sin borrar
el historial previo. Registrar cada transición para medir recuperación y
conversión real con los mismos cohortes.

## Pendientes después de la fase de GitHub
1. Publicar en Lovable la versión de main que contenga este cambio; GitHub no
   publica automáticamente la interfaz.
2. Conectar el plugin Railway, inspeccionar qué tipos de eventos de conversaciones
   funcionan realmente y cómo se identifican conversaciones y clientes. No asumir
   que el acceso Railway está concedido sin autorización del propietario.
3. Crear el modelo de eventos comerciales del agente y las migraciones de Lovable
   Cloud necesarias **solo después de comprobar el contrato real**. Evitar
   modificar el manejo operativo de citas/RSVP que ya funciona.
4. Añadir tiempos de primera respuesta, conversaciones sin seguimiento,
   causas de abandono, reactivaciones, fuentes UTM y campaña, inversión publicitaria,
   propuestas y cierres cuando existan datos verificables. Sin costos reales no
   llamar ROI/ROAS al porcentaje de agendamiento.
5. Verificar los totales contra las filas reales con permisos de administrador.
   Ejecutar auditoría de embudo y navegación móvil antes de publicar.

No exponer secretos, nombres de clientes ni transcripciones de WhatsApp en logs.
