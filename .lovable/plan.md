# CRM privado de Cómplice Lab

## Alcance
Solo /admin y sus controles privados; sin cambios a la web pública, SEO público, políticas RLS ni publicación.

## Cambios
- Sustituir magic link por correo fijo y contraseña. Mantener la sesión actual y el administrador exclusivo.
- Añadir Seguridad para establecer/cambiar contraseña, con confirmación y mínimo 8 caracteres. Para cambios con contraseña existente, solicitar también la actual cuando el servicio lo requiera. Añadir recuperación por correo con página privada de restablecimiento no indexable.
- Mostrar explícitamente WhatsApp / Agente IA como no conectado.
- Componer encabezado, métricas, búsqueda/filtros, lista y detalle amplio adaptable a móviles.
- Crear contactos reales con todos los campos solicitados y consentimiento de marketing desmarcado.
- Editar etapa, seguimiento y notas; mostrar actividades y crear/completar tareas con las tablas existentes.

## Detalles técnicos
- Cliente Cloud generado y verificación del correo confirmado; todas las lecturas y escrituras mantienen RLS.
- Módulos aislados del CRM para formularios, detalle y reglas validables. Sin datos de ejemplo ni claves privilegiadas.
- Registrar actividades administrativas tras crear contactos y cambiar etapa; comunicar cualquier fallo parcial.

## Verificación
- Pruebas de administrador exclusivo, contraseñas, consentimiento y origen.
- Comprobar contactos/tareas/edición bajo sesión real y lectura posterior; retirar únicamente los registros de prueba.
- Revisar escritorio, tablet y móvil, errores de compilación y ausencia del método magic link normal.

## Supuesto
La recuperación es un acceso auxiliar no indexable, no una modificación de la web pública. No se cambiará la contraseña real del administrador durante las pruebas.