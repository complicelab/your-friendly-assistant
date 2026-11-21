# Cómplice Lab · conexión a Google Calendar (preparación segura)

**Repositorio:** complicelab/your-friendly-assistant  
**Calendario esperado:** complicelab@gmail.com  
**Zona horaria:** America/Bogota  
**Estado:** integración preparada en rama de revisión, **NO autorizada ni probada en producción**.

## Hallazgos previos

La rama main ya tiene Agenda y Configuración en /admin; la rama lovable-sync, divergente, no tiene esas vistas. No mezclar automáticamente ramas: resolver primero los cambios de Lovable y ejecutar la batería completa de pruebas.

Las reservas públicas se guardan con crm_public_book_meeting y aparecen en crm_meetings si el backend y las políticas RLS están configurados. Google Calendar no estaba vinculado.

## Configuración OAuth para una sola cuenta

1. Ingresar a https://console.cloud.google.com/ con el proyecto correcto.
2. Habilitar Google Calendar API en **APIs y servicios**.
3. Configurar la pantalla de consentimiento OAuth, y autorizar complicelab@gmail.com. Para uso persistente, verificar el estado de publicación de OAuth: en modo de pruebas algunos refresh tokens caducan en 7 días.
4. Crear un cliente OAuth 2.0, obtener autorización **offline** con el scope exacto https://www.googleapis.com/auth/calendar y obtener un refresh token mediante un flujo autorizado de Google. La cuenta que da consentimiento debe ser complicelab@gmail.com. No copiar secretos al chat, a commits ni a variables VITE_.
5. Guardar **solo como secretos de servidor** de Lovable Cloud:
   - GOOGLE_CALENDAR_CLIENT_ID
   - GOOGLE_CALENDAR_CLIENT_SECRET
   - GOOGLE_CALENDAR_REFRESH_TOKEN
   - GOOGLE_CALENDAR_ID = complicelab@gmail.com
6. Comprobar que SUPABASE_URL y SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) están configuradas en servidor, para guardar el ID del evento en crm_meetings.

## Flujo implementado en esta rama

- GET /api/booking usa la disponibilidad de la base existente y consulta Google FreeBusy cuando las cuatro variables están configuradas; quita horarios con solapamientos.
- Si Google Calendar está configurado pero falla, responde 503 y **no muestra horarios sin verificar**.
- POST /api/booking vuelve a comprobar el horario en la base y en Google antes de crear la reserva.
- Tras registrar la reserva en crm_meetings, crea un evento en Google Calendar e invita al correo del cliente. Usa un ID determinista derivado del UUID de crm_meetings para reducir duplicados en reintentos.
- Si se crea el evento y existe la clave de servidor de Supabase, registra external_calendar_id en crm_meetings.
- Si Google falla **después** de guardar la reserva, el CRM conserva la cita y responde calendar_status=pending; es necesario revisar y recuperar la sincronización antes de considerar el flujo totalmente operativo.
- Sin credenciales, el comportamiento de reservas existente se conserva; **no significa que Google esté conectado**.
- La interfaz del CRM muestra si una reunión tiene external_calendar_id.

## Limitaciones para la siguiente fase

- La rama prepara consulta de ocupación y creación inicial; todavía **no implementa sincronización automática de cambios/cancelaciones, reintentos programados, ni lectura/importación de eventos existentes al CRM**.
- Google Meet no se crea automáticamente; el campo meeting_url solo muestra un enlace si realmente existe.
- Si una cita queda pending, requiere reparación; antes del despliegue real debe implementarse y probarse un reintento autenticado y el tratamiento de cancelaciones.
- Los cambios en GitHub no demuestran que las migraciones se ejecutaron en Lovable Cloud ni que las credenciales se hayan autorizado.

## Pruebas obligatorias antes de desplegar

1. Verificar la rama que publica Lovable, reconciliar main/lovable-sync sin borrar versiones.
2. Ejecutar bun install --frozen-lockfile, bun test y bun run build.
3. Abrir /admin con el administrador autorizado y comprobar que se ven **Oportunidades, Agenda y Configuración**.
4. Verificar que una cuenta normal no pueda leer ni editar crm_meetings, settings o clientes.
5. Bloquear un horario de prueba en el calendario Google y confirmar que no aparece en /api/booking.
6. Registrar una reserva de prueba, confirmar que aparece una sola vez en CRM y en Google, y que el cliente recibe invitación según permisos.
7. Simular fallo de acceso a Google y comprobar que la disponibilidad no se publica equivocadamente.
8. Probar cancelación y reprogramación; no activar producción mientras estas operaciones no estén sincronizadas.
9. Validar uso de America/Bogota en cambios de día y horarios con UTC.
