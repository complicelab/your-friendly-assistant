# Calendario Cómplice Lab — Conciliación y sincronización

Actualización: 21 de noviembre de 2026. Código en GitHub, base de datos de Lovable Cloud y calendario de complicelab@gmail.com.

## Qué está implementado
1. En /admin > Configuración > Google Calendar aparece "Citas de Google sin cliente asociado". Lista eventos dentro de la ventana de 180 días previos y 365 siguientes. Muestra título, fecha, correo de asistentes y una coincidencia sugerida, cuando existe. No asigna por nombre ni crea clientes.
2. Cada evento puede vincularse a un contacto EXISTENTE, ignorarse o restaurarse a revisión. Las decisiones se conservan en una tabla privada.
3. La vinculación se hace con una función transaccional de base de datos que bloquea concurrencia y respeta el ID único del evento. Si ya existe la misma reunión para el mismo contacto y fecha, vincula su ID sin duplicarla. Los eventos importados no deben generar nuevos mensajes de confirmación.
4. "Probar conexión (solo lectura)" comprueba acceso al calendario y consulta FreeBusy de las próximas 24 horas. NO crea eventos de Google ni citas CRM; por eso no sustituye una prueba completa de reserva real.
5. La Agenda permite cambiar la fecha de una cita ya vinculada, comprobando solapes de otros eventos Google (incluidos de día completo), reuniones CRM y estado actual del evento. Si falla la base tras modificar Google, intenta restaurar Google; si falla esa restauración, advierte que requiere revisión manual.
6. Cancelar desde Agenda ya utiliza la API protegida para cancelar en Google y actualizar el CRM. Los cambios/cancelaciones realizados en Google se aplican en la siguiente sincronización mediante la rutina existente.

## Migración obligatoria, una sola vez
En la MISMA base de Lovable que ya contiene crm_contacts y crm_meetings, aplica:

supabase/migrations/20261121_calendar_review_and_attach.sql

Existe una copia equivalente en drizzle/migrations/0008_calendar_review_and_attach.sql. Ejecuta UNA sola vía de migración según el sistema de Lovable para evitar aplicaciones duplicadas. La migración es idempotente y no borra datos existentes.

Crea:
- last_cron_at: fecha del último ciclo programado exitoso, distinta de la sincronización manual.
- crm_calendar_event_reviews: tabla privada de decisiones de ignorar, con RLS y permisos de service_role solamente.
- crm_attach_google_calendar_event: función SECURITY DEFINER invocable únicamente con service_role, valida contacto, id, tiempos, evita duplicados y no activa la creación de clientes.

Antes de aplicar, comparar recuentos y estado de crm_contacts, crm_meetings, crm_activities, crm_notifications, crm_agent_jobs. Después, verificar los mismos datos, RLS y permisos. No mostrar, exportar ni sobrescribir credenciales OAuth.

## Activación del sincronizador con el administrador cerrado
Se preparó .github/workflows/calendar-scheduled-sync.yml para ejecutar un POST HTTPS al servidor publicado cada 10 minutos (UTC, el horario efectivo puede retrasarse en GitHub Actions).

No funcionará sin la MISMA clave privada en ambos lados:
- Lovable Cloud (secreto servidor): CRM_CALENDAR_CRON_SECRET
- GitHub > Settings > Secrets and variables > Actions (secreto del repositorio): CRM_CALENDAR_CRON_SECRET

Debe ser un secreto aleatorio mínimo 32 caracteres, exclusivo de esta función. Nunca se pone en código, captura ni conversación. La tarea es segura ante ausencia del secreto: termina sin hacer llamadas e indica que falta configurar.

Confirmar que la API /api/calendar/cron responde 401 sin autenticación y 200 a la tarea con credencial válida; verificar en GitHub Actions el último resultado. La tarjeta Google Calendar en /admin indica la última fecha de sincronización programada exitosa; si aún no aparece, no se ha comprobado el funcionamiento con el panel cerrado. La tarea solo debe activarse tras instalar y probar la migración. No crear ni modificar eventos de prueba desde el cron.

## Prueba real controlada de reserva de extremo a extremo (después de desplegar)
1. Crear un evento personal de bloqueo de 30 minutos para una fecha futura en Google y comprobar que ese hueco desaparece de los horarios ofrecidos por la web.
2. Elegir otro horario libre. Completar el formulario de agendamiento con datos propios de prueba, usando un correo y WhatsApp a los que el administrador tenga derecho a enviar avisos.
3. Comprobar exactamente una reunión en crm_meetings, su external_calendar_id y exactamente un evento en Google Calendar, con horario correcto America/Bogota.
4. Confirmar que el correo/WhatsApp tienen registro de entrega o pendiente real y que no hay dobles mensajes.
5. Desde Agenda, mover esa cita a un horario libre. Comprobar que Google y CRM coinciden y que los invitados reciben la actualización si procede.
6. Cambiar luego la misma cita desde Google y sincronizar. Comprobar que el CRM refleja el cambio.
7. Cancelarla desde Google y sincronizar; comprobar que queda cancelada en el CRM. En una cita distinta controlada, probar la cancelación desde el CRM y verificar el resultado en Google.
8. Marcar un evento sin contacto como ignorado, refrescar y comprobar que permanece ignorado; restaurarlo y verificar que vuelve a la bandeja.
9. Probar que un usuario sin sesión y un usuario no autorizado no pueden acceder a la bandeja ni usar sus operaciones. Validar que las tablas nuevas no se pueden consultar desde el navegador.

Los pasos anteriores NO han sido ejecutados en la cuenta de producción solo por existir el código: requieren autorización y comprobación en el entorno real. Nunca crear una cita de prueba con un cliente real ni enviarle mensajes sin permiso.

## Limitaciones y observaciones
- Los 8 eventos sin vincular vistos el 21/11/2026 fueron un resultado de la sincronización del panel; su detalle no está disponible desde el acceso de GitHub. Pueden incluir eventos personales; solo vincular tras verificar identidad.
- El cron no está activo hasta que la clave privada se configure en Lovable y GitHub y se confirme una ejecución correcta.
- La página pública debe estar realmente actualizada con el nuevo código de main; los cambios de GitHub pueden tardar en sincronizar a Lovable y requerir publicación.
- La ruta /api/calendar/cron utiliza un solo secreto, no los secretos OAuth; no reutilizar GOOGLE_CALENDAR_ENCRYPTION_KEY.
- Si un evento se modificó en ambos lados casi simultáneamente, el servidor rechazará el cambio concurrente; primero sincronizar y revisar.
- Los cambios en Google que no tengan vínculo inequívoco o que estén marcados como ignorados no crearán citas de cliente automáticamente.


## Corrección de la agenda visual — 21/11/2026

**Problema observado:** en `calendar.google.com` se ven varias franjas tituladas “Diagnóstico Cómplice Lab”, y en `complicelab.com/admin > Agenda` solamente se veía la reunión del CRM del 10 de noviembre. Era un comportamiento del código: la agenda del CRM solo consultaba `crm_meetings`, mientras que la rutina de conciliación de Google solo importaba citas con contacto inequívoco.

**Solución integrada:**
- La agenda consulta `POST /api/calendar` con `action=agenda` y el rango del mes/semana visible. Solo el administrador autenticado puede llamar esta acción. Google se consulta desde el servidor con el OAuth existente.
- Los eventos de Google aparecen directamente en las celdas, en el listado del día y en “Eventos próximos de Google”, aunque no existan en `crm_meetings`.
- Las reuniones ya asociadas a Google se muestran **una sola vez**, comparando `external_calendar_id` y el identificador del evento de Google.
- Los eventos sin vínculo quedan en un color diferenciado, se pueden abrir y llevan a Configuración para asociarlos a un contacto verificado.
- Si Google API falla o la autorización expira, el administrador ve una alerta clara; no se sustituye el fallo por “0 reuniones”.
- La vista se actualiza cada minuto con el panel visible o al recuperar el foco y ofrece un botón de actualización manual.
- Este cambio es **solo lectura**: no crea ni cancela reservas, contactos, notificaciones o eventos; no requiere migraciones adicionales.

**Importante acerca de las capturas:** el panel izquierdo de Google Calendar enseña `Páginas de reserva > Diagnóstico Cómplice Lab`. Sus franjas de disponibilidad suelen aparecer como bloques largos; **no son necesariamente reservas confirmadas**. La API Google Calendar Events sí entrega eventos reales (reservas ya creadas, reuniones, bloqueos), pero no replica automáticamente la configuración de esa página de reservas. Hay que revisar un bloque concreto en Google para distinguir disponibilidad de reserva confirmada. Las franjas de citas de la captura parecen tener duración de 45 minutos, mientras la configuración del CRM mostrada antes tenía 60 minutos de duración e intervalo: ambos sistemas deben alinearse manualmente si se requiere el mismo horario.

**Validación pendiente en el entorno real:**
1. Publicar el último código `main` en Lovable y abrir `https://complicelab.com/admin`.
2. Entrar a **Agenda**, comprobar que aparece “Mostrar eventos reales de Google Calendar”, pulsar “Actualizar Google”.
3. Verificar una reserva confirmada de Google que tenga fecha y hora conocidas: debe verse en la fecha correspondiente con etiqueta de Google, aunque no tenga cliente CRM.
4. Comprobar que la misma reunión no aparece dos veces si ya tiene `external_calendar_id` en el CRM.
5. Verificar que si hay solo franjas de disponibilidad en Google, no se inventan reuniones y se explica la diferencia.
6. Abrir un evento sin vínculo y usar “Revisar y vincular cliente” si la migración de conciliación del PR #4 fue aplicada a la base existente. No asignar un evento personal a un cliente.
7. Si hace falta sincronización con el panel cerrado, activar por separado `CRM_CALENDAR_CRON_SECRET` en Lovable y GitHub Actions, y confirmar la fecha del último ciclo exitoso.

La ejecución de pruebas de GitHub valida el código y la compilación, no demuestra todavía que el backend Lovable haya servido la revisión nueva ni que los eventos reales de esta cuenta aparezcan.
