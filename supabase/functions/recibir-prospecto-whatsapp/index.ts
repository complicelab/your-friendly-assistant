// Supabase Edge Function — public endpoint authenticated by a server-side shared secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowed = new Set(["lead_creado","diagnostico_solicitado","cita_confirmada","escalado_a_humano","no_interesado","opt_out"]);
const response = (status:number, data:Record<string,unknown>) =>
  new Response(JSON.stringify(data), {status,headers:{"content-type":"application/json; charset=utf-8"}});
const equal = (a:string,b:string) => {
  const enc = new TextEncoder();
  const x=enc.encode(a), y=enc.encode(b);
  let diff=x.length^y.length;
  for(let i=0;i<Math.max(x.length,y.length);i++) diff |= (x[i]??0)^(y[i]??0);
  return diff===0;
};

Deno.serve(async (request) => {
  if(request.method!=="POST") return response(405,{ok:false,error:"Método no permitido."});
  const secret=Deno.env.get("CRM_WEBHOOK_SECRET");
  if(!secret || !equal(request.headers.get("x-clave")??"",secret))
    return response(401,{ok:false,error:"No autorizado."});
  if(Number(request.headers.get("content-length")??"0")>16384)
    return response(413,{ok:false,error:"Solicitud demasiado grande."});
  let input:unknown;
  try { input=await request.json(); } catch {return response(400,{ok:false,error:"JSON inválido."});}
  if(!input || typeof input!=="object" || Array.isArray(input)) return response(400,{ok:false,error:"Solicitud inválida."});
  const event=input as Record<string,unknown>;
  const wa=typeof event.wa_id==="string"?event.wa_id.replace(/\D/g,""):"";
  const timestamp=typeof event.timestamp==="string"?event.timestamp:"";
  if(!allowed.has(String(event.event_type)) || wa.length<8 || wa.length>15 ||
    !timestamp || !Number.isFinite(Date.parse(timestamp)) ||
    !event.payload || typeof event.payload!=="object" || Array.isArray(event.payload))
    return response(400,{ok:false,error:"Evento inválido."});
  if(JSON.stringify(event).length>16384) return response(413,{ok:false,error:"Solicitud demasiado grande."});
  const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url || !key) return response(500,{ok:false,error:"Configuración incompleta."});
  try {
    const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {error}=await supabase.rpc("crm_receive_whatsapp_event",{
      p_event_type:event.event_type,
      p_wa_id:wa,
      p_timestamp:timestamp,
      p_payload:event.payload,
    });
    if(error){console.error("CRM inbound RPC failed",error.code);return response(500,{ok:false,error:"No se pudo guardar el evento."});}
    return response(200,{ok:true});
  } catch(e){console.error("CRM inbound failed",e instanceof Error?e.name:"unknown");return response(500,{ok:false,error:"No se pudo guardar el evento."});}
});
