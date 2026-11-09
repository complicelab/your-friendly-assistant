# Módulo interno de agenda
- [x] Conservar Oportunidades y verificar Agenda, Configuración, notificaciones y responsive.
- [x] Destacar la próxima reunión y conservar la lista completa en el detalle del contacto.
- [x] Ejecutar tipos, compilación y pruebas; no tocar home/SEO ni publicar.

# Agenda real y CRM
- [x] Mantener dos caminos de reserva: formulario inline y popup dedicado; ambos usan /api/booking y el mismo CRM.
- [x] Sustituir días/horas ficticios por disponibilidad y reserva reales en America/Bogota.
- [x] Añadir navegación Oportunidades / Agenda / Configuración, calendario, reuniones y estados en /admin.
- [x] Guardar configuración, reglas semanales y excepciones reales de disponibilidad.
- [x] Mostrar reuniones en contactos y estados honestos de notificaciones, sin proveedores simulados.
- [x] Sincronizar los archivos críticos de agenda entre main y lovable-sync, incluyendo runtime, API, tipos, migraciones y pruebas de regresión.

# Autenticación CRM
- [x] Corregir recuperación dentro de /admin; el flujo exige evento PASSWORD_RECOVERY y administrador verificado.
- [x] Cambiar /admin a contraseña; seguridad y recuperación sin pantalla de registro público.
- [x] Completar dashboard, creación y detalle de contactos, actividades y tareas usando tablas existentes.
- [x] Verificar escrituras/lecturas bajo sesión admin y vistas desktop/tablet/móvil; no publicar ni tocar SEO público; retirar registros temporales.
- [ ] Verificar establecimiento y entrada con contraseña correcta: necesita que el administrador establezca su contraseña privada; no se cambió durante pruebas.
- [ ] Cerrar registro público en More → Users → Auth settings: el ajuste sigue abierto; no hay lectura del valor HIBP para preservarlo al usar la herramienta de configuración.
- [x] Verificar entrada con sesión confirmada y cierre de sesión; acceso a datos comprobado con el administrador.

# Corrección comparador
- [x] Sustituir únicamente las escenas derechas 2 y 3 en el render original v10.
- [x] Eliminar el montaje anterior y conservar el movimiento existente.
- [x] Verificar pasos 2 y 3 en escritorio y móvil, y regreso a otros estados.

# Flujo del sistema a tu medida
- [ ] Sustituir solo pasos 2, 3, 7 y 8; preservar navegación, tiempos y demás escenas.
- [ ] Adaptar web dental y agenda; crear campañas e indicadores con datos ilustrativos.
- [ ] Verificar interacción, reproducción, compilación y vistas desktop/tablet/móvil sin publicar.

# Teléfono de Marketing
- [ ] Auditar el teléfono de Agentes y la reproducción actual de Marketing.
- [ ] Unificar marco y escala; eliminar flotantes; mejorar las cuatro escenas y sincronización sin tocar otras secciones.
- [ ] Verificar pasos, nichos, autoplay y contención en desktop/tablet/móvil; comprobar compilación sin publicar.
