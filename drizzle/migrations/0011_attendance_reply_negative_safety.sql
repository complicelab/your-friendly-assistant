CREATE OR REPLACE FUNCTION public.crm_classify_attendance_reply(p_text text)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path=public AS $$
DECLARE t text:=lower(trim(coalesce(p_text,'')));
BEGIN
 IF t ~ '(no sé|no se|todavía|todavia|posiblemente|quizás|quizas|déjame|dejame|reprogram|cambiar|otra hora|hablar con|pero|si puedo)' THEN
   RETURN 'asistencia_dudosa';
 ELSIF t ~ '(no puedo|no voy|no asistir|no podré|no podre|no estaré|no estare|cancela.*cita|cancelar.*cita|mañana no puedo)' THEN
   RETURN 'asistencia_rechazada';
 ELSIF t ~ '(^sí[, .!]|^si[, .!]|confirmo.*asistencia|voy a asistir|estaré presente|estare presente|nos vemos mañana)' THEN
   RETURN 'asistencia_confirmada';
 END IF;
 RETURN 'asistencia_dudosa';
END; $$;
REVOKE ALL ON FUNCTION public.crm_classify_attendance_reply(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.crm_classify_attendance_reply(text) TO service_role;
