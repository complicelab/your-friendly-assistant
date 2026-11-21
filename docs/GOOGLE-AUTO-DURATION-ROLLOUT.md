# Cómplice Lab - Duracion automatica con Google Calendar
Actualizacion: 21 de noviembre de 2026.

## Regla
Con la cuenta complicelab@gmail.com enlazada, la duracion y el intervalo entre horarios dejan de ser editables por el administrador. El servidor los actualiza a partir de reservas confirmadas y verificables. Al desconectar Google, vuelven a ser editables.

## Limite importante de Google
La API publica Calendar v3 incluye Events y FreeBusy, pero no expone el parametro de duracion ni las franjas de la pagina Google "Paginas de reserva". Esta implementacion NO afirma leer esa configuracion directamente ni reflejar instantaneamente sus cambios: infiere la duracion de los eventos de reservas reales.

## Deteccion
1. Consulta eventos entre 100 dias previos y 210 dias posteriores, expandiendo las repeticiones.
2. Acepta solo reservas llamadas "Diagnostico Complice Lab" (y variantes de acentos, seguidas de nombre de cliente), con asistentes u organizador externo.
3. Excluye cancelados, transparentes, dia completo, reuniones internas, eventos sin clientes y eventos creados desde el propio CRM.
4. Necesita dos o mas ejemplos coincidentes y consenso >= 2/3 de las seis reservas recientes. Si hay contradicciones, conserva el ultimo valor y muestra "Pendiente".
5. Si confirma 45 minutos, el servidor actualiza crm_booking_settings.meeting_duration_minutes y slot_minutes a 45. El paso entre horarios se iguala por convencion interna de CRM, NO porque Google exponga su paso, buffers o reglas.
6. Se revisa al abrir Configuracion y cada cinco minutos, durante sincronizacion Google manual y cron, y antes de calcular o confirmar horarios publicos. Usa cache para evitar llamadas excesivas.
7. No altera reuniones ya creadas ni modifica citas de Google. Solo cambia las reglas de reservas futuras del CRM.

## Migracion obligatoria en Lovable Cloud
Aplicar a la misma base CRM existente UNA SOLA VIA:
supabase/migrations/20261121_google_automatic_booking_duration.sql
O su copia drizzle/migrations/0009_google_automatic_booking_duration.sql

No ejecutar ambas copias. No borra datos. Anade columnas de diagnostico a la conexion privada y un trigger que prohíbe cambios de duracion e intervalo desde el navegador mientras exista Google OAuth; solo el service_role puede aplicar un valor verificado.

Verificar migracion, RLS, permisos y recuentos de contactos/reuniones/actividades antes y despues. No modificar secretos OAuth.

## Pruebas de aceptacion en produccion
1. Identificar dos reservas reales de "Diagnostico Complice Lab" de 45 minutos en Google, con asistentes externos. Los bloques de disponibilidad azules NO cuentan.
2. Entrar a /admin > Configuracion y pulsar "Verificar duracion con Google".
3. Comprobar etiqueta "45 minutos verificados" y que los campos de duracion e intervalo estan deshabilitados.
4. Comprobar que crm_booking_settings guarda meeting_duration_minutes=45 y slot_minutes=45.
5. Consultar los horarios publicos: el RPC debe generar reuniones de 45 minutos. Crear una unica cita de prueba autorizada en fecha libre y comprobar en Google y CRM exactamente una cita de 45 minutos.
6. Un usuario no administrador y el navegador admin no deben poder escribir duraciones nuevas por la tabla cuando Google esta conectado.
7. Tras cambiar la duracion de la pagina de reservas de Google, es necesario tener nuevas reservas confirmadas suficientes para inferir el nuevo valor; no se puede prometer lectura directa del cambio al instante.
8. Las reglas semanales, excepciones y bloqueos del CRM siguen siendo independientes. FreeBusy evita que la web ofrezca horarios ocupados.

Este documento es una guia de despliegue. El codigo en GitHub por si solo no ejecuta las migraciones en Lovable Cloud ni demuestra la duracion real de las reservas Google sin un test de produccion.
