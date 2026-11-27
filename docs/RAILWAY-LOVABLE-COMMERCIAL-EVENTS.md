# Cómplice Lab — Railway → Lovable Cloud: eventos comerciales

## Estado y límites
- El agente real permanece en Railway: proyecto `discerning-analysis`,
  servicios `agente-whatsapp-complicelab` y `Worker`, repositorio
  `b2homelatam-arch/agente-whatsapp-complicelab`.
- Esta modificación prepara **el receptor** del CRM y la migración **en la base
  Lovable Cloud EXISTENTE**. No cambia ni despliega código de Railway.
- El panel Railway confirmó el repositorio, pero el GitHub conectado no permite
  leerlo (404); la función de agente editor remoto estaba deshabilitada:
  «Turn on the agent dashboard to start runs from outside it».
- Nunca duplicar recordatorios, modificar el payload de asistencia existente,
  ni enviar estos eventos antes de desplegar la migración y Edge Function.

## Implementación receptora
La función `recibir-prospecto-whatsapp` conserva la cabecera `x-clave` de
`CRM_WEBHOOK_SECRET`. Los eventos nuevos se envían a la función PostgreSQL
`crm_apply_commercial_agent_event` (solo service_role), separada de la RPC
de leads y de la de asistencia. No crea contactos, reservas ni mensajes.

**Eventos nuevos aceptados en la versión preparada:**

- `interes_confirmado`: actualiza prospectos elegibles a calificado;
  no sobrescribe etapas más avanzadas, ventas ganadas u opt-out.
- `seguimiento_pendiente`: registra seguimiento y mueve casos tempranos
  a seguimiento; no deshace reservas ni ventas.
- `prospecto_abandonado`: solo con prueba de al menos dos seguimientos
  completados, último seguimiento hace >=48 h, motivo explícito, sin
  reserva futura vigente ni propuesta/venta ni no-contactar.
- `prospecto_reactivado`: solamente un prospecto que esté en
  estado abandonado; conserva el historial anterior y pasa a contactado.

## Contrato HTTP para Railway (DESACTIVADO hasta el rollout)

Endpoint ya existente: `CRM_WEBHOOK_URL` (Railway tiene variable definida).
Header privado `x-clave` con `CRM_WEBHOOK_SECRET` existente, Content-Type JSON.

Ejemplo de interés, reemplazar valores ficticios por IDs reales:

```json
{
  "event_type": "interes_confirmado",
  "wa_id": "573000000000",
  "timestamp": "2026-11-27T18:00:00Z",
  "payload": {
    "message_id": "wamid.EJEMPLOUNICO123",
    "motivo": "Solicitó información y precio"
  }
}
```

Ejemplo de abandono tras seguimientos verificados, no por silencio genérico:

```json
{
  "event_type": "prospecto_abandonado",
  "wa_id": "573000000000",
  "timestamp": "2026-11-27T18:00:00Z",
  "payload": {
    "message_id": "agent.abandono.EJEMPLO001",
    "evidence_type": "dos_seguimientos_sin_respuesta",
    "follow_up_count": 2,
    "last_followup_at": "2026-11-25T17:00:00Z",
    "motivo": "Sin respuesta tras dos seguimientos enviados"
  }
}
```

Cada mensaje requiere ID único estable y teléfono que coincida con exactamente
un contacto existente. Si un contacto fue captado por múltiples vías,
deduplicar previamente. Reintentos del mismo ID no duplican actividades.
La hora del evento debe ser válida y reciente. El receptor no almacena textos
de conversación ni secretos en metadata; solo señales mínimas.
Una reactivación debe basarse en respuesta real, no en un mensaje saliente.

El cierre exitoso de una cita, `cita_confirmada`, sigue siendo un evento comercial
antiguo y NO demuestra una reserva real en `crm_meetings`. Tampoco equivale al
`asistencia_confirmada` de la respuesta de 24 horas.

## Orden de activación
1. **Lovable Cloud**: revisar backup/conteos, aplicar una sola vez
   `drizzle/migrations/0012_commercial_agent_events.sql` en el proyecto
   existente; comprobar constraint y RPC. No ejecutar migraciones repetidas.
2. Desplegar la nueva versión de `supabase/functions/recibir-prospecto-whatsapp`
   en el MISMO proyecto Lovable Cloud, preservando `CRM_WEBHOOK_SECRET`.
3. Probar con contacto autorizado de prueba: interés, seguimiento, abandono
   válido/inválido, reactivación, duplicados, número ajeno, opt-out, cita futura,
   cronología antigua; verificar escritura correcta en `crm_activities` y
   que CRM/Agenda/RSVP siguen funcionando.
4. Solo después, modificar el repositorio del agente Railway usando acceso
   GitHub autorizado o habilitando su Agent Dashboard. Implementar el flag
   `CRM_COMMERCIAL_EVENTS_ENABLED=false` por defecto, pruebas y rollout
   controlado sin duplicar eventos.
5. Medir tasas reales y monitorear errores del webhook en Railway.
   Mantener capacidad de desactivar el flag si aparecen anomalías.

## Incidencias Railway pendientes de corregir en el repositorio del agente
- HTTP 5xx: `KeyError: 'from'` en `app/webhook/normalize.py:39`, llamado
  desde `app/webhook/router.py:77`. Mensajes de estado Meta sin remitente
  no deben producir HTTP 500.
- Worker: `AttributeError: 'Settings' object has no attribute
  'elevenlabs_api_key'` en `app/voz.py`. Hacer fallback seguro a texto
  si no existe configuración de ElevenLabs.
- En siete días se observaron 247 respuestas HTTP 5xx de 1858 solicitudes
  (13,3 %) del servicio público, sin inferir que todas correspondan
  a mensajes de clientes: revisar rutas y errores reales.
- No cambiar el webhook existente ni reiniciar servicios para ocultar
  los síntomas. Añadir tests al repositorio del agente y desplegar
  solo tras pruebas verdes y verificación de producción.

## Interpretación de indicadores
- Agendados: solo reuniones verificadas en Lovable Cloud.
- Abandonados actuales: estado comercial `abandonado` o último evento de
  abandono sin posterior reactivación. No se presume abandono por silencio.
- Reactivados: evento de recuperación registrado; no significa reserva ni venta.
- Interés: etapa o evento de interés; no equivale a una venta cerrada.
- Venta: `ganado` marcado explícitamente por responsable comercial.
