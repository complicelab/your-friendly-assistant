# Conciliación real Railway → CRM Cómplice Lab (sin modificar el agente)

## Diagnóstico
En /admin > Oportunidades, «Total» era número de contactos de Lovable Cloud,
NO cantidad de conversaciones de Railway. La vista mostraba 41 contactos.
Railway Postgres reportó como ESTIMACIÓN 109 filas `conversations` y 937
filas `message_logs`. La tabla `conversations` tiene `wa_id` como
clave primaria. Los 109 no prueban que falten exactamente 68 clientes: se
deben comparar los teléfonos únicos y filtrar conversaciones no elegibles.

El CRM solo crea contactos al recibir determinados eventos de WhatsApp;
no había importador histórico de `conversations`. Una respuesta automática
en Railway NO garantiza que el lead se registró en CRM.

## Qué implementa el nuevo módulo
- Configuración → Comparar registros: consulta por lectura SQL a Railway,
  y compara los teléfonos normalizados contra TODOS los contactos actuales
  (incluidos manuales/web). No crea contactos durante la vista previa.
- Detecta IDs inválidos, grupos/broadcast, teléfonos repetidos, clientes
  ya registrados y conversaciones sin indicios estructurados de mensajes
  entrantes. No inventa resultados de intención a partir de frases sin contexto.
- El administrador confirma expresamente la importación de candidatos con
  `role=user`, `direction=inbound` o `from_me=false`, tras comprobarlos.
- Usa la RPC existente `crm_receive_whatsapp_event`, con bloqueo por número,
  para crear contactos `nuevo` sin nombre inventado, sin conceder consentimiento
  de marketing, sin agendar citas ni confirmar asistencia.
- No lee `message_logs`: son registros individuales, con número resumido
  mediante `wa_id_hash`; la conciliación usa `conversations` (wa_id).
- No comparte texto de chats, números ni contraseñas con el navegador o logs.

## Acción de configuración necesaria
La conexión de Railway a ChatGPT NO inyecta variables al servidor de Lovable.
Se requiere `RAILWAY_READONLY_DATABASE_URL` como secreto del entorno
**Lovable Cloud servidor**, apuntando a Postgres de Railway con una cuenta
que solo posea permiso SELECT para `public.conversations`.

La URL debe ser externa y accesible desde Lovable Cloud, con TLS. Crear una
cuenta PostgreSQL limitada, nunca reutilizar la cuenta administradora ni
compartir una cadena de conexión en ChatGPT. Una vez configurado:
1. Publicar la versión de main que incluya este módulo.
2. Abrir /admin → Configuración → «Comparar registros».
3. Revisar los conteos exactos: conversaciones, WhatsApp válidos, ya en CRM,
   candidatos con entrada verificable y formato de historial no reconocido.
4. Importar explícitamente candidatos; comprobar totales y que no hubo duplicados.
5. Repetir vista previa: `readyToImport` debería quedar en cero para los
   perfiles importados, mientras `needsReview` requiere auditoría humana.

Si Railway almacena `history_json` con otra estructura, se necesita
adaptar el detector de entrada ANTES de usar «Importar». Jamás importar
automáticamente sistemas, campañas de mensajes solo salientes o histories
ilegibles como clientes reales.

## Límites
Este módulo no convierte automáticamente chats en «Interesados» o
«Abandonados»: eso requiere evidencia comercial explícita. No interviene en
el Worker o en las respuestas del agente. No modifica Google Calendar ni la
Agenda y no inventa citas a partir de `cita_confirmada`.

La importación histórica guarda `created_at` del contacto el día de
la importación (la tabla de origen solo ofrece último `updated_at`).
Por tanto, las tasas por período de captación NO deben considerarse
cohortes históricas exactas de conversaciones antiguas sin un
`first_message_at` fiable. Para métricas históricas robustas,
añadir captura verificable de primera conversación en una fase posterior.

## Seguridad
- Solo administrador autenticado `complicelab@gmail.com` mediante JWT.
- Importación solo bajo acción explícita; vista previa nunca modifica.
- Railway SELECT-only, LIMIT seguro, TLS, sin materializar secretos ni texto.
- Las credenciales de Railway y Lovable no se trasladan al frontend.
- La respuesta HTTP solo contiene cifras agregadas, sin WhatsApp.
