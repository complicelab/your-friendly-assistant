-- pgcrypto is installed in the managed extensions schema; preserve the inbound function body and existing data.
ALTER FUNCTION public.crm_receive_whatsapp_event(text,text,timestamptz,jsonb) SET search_path = public, extensions;
