// Supabase Edge Function — public endpoint authenticated by a server-side shared secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const attendanceTypes=new Set(["recordatorio_asistencia_enviado","asistencia_confirmada","asistencia_rechazada","asistencia_dudosa"]);
const commercialTypes=new Set(["interes_confirmado","seguimiento_pendiente","prospecto_abandonado","prospecto_reactivado"]);
const allowed = new Set(["lead_creado","diagnostico_solicitado","cita_confirmada","escalado_a_humano","no_interesado","opt_out",...attendanceTypes,...commercialTypes]);
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
  const attendanceEvent=attendanceTypes.has(String(event.event_type));
  const commercialEvent=commercialTypes.has(String(event.event_type));
  if(commercialEvent){
    const payload=event.payload as Record<string,unknown>;
    if(typeof payload.message_id!=="string" ||
       !/^[a-zA-Z0-9_.:/+=-]{6,180}$/.test(payload.message_id) ||
       (payload.motivo!==undefined && (typeof payload.motivo!=="string" || payload.motivo.length>240)))
      return response(400,{ok:false,error:"El evento comercial requiere message_id válido y motivo breve."});
    if(event.event_type==="prospecto_abandonado" &&
      (payload.evidence_type!=="dos_seguimientos_sin_respuesta" ||
       !/^[0-9]{1,3}$/.test(String(payload.follow_up_count??"")) ||
       Number(payload.follow_up_count)<2 ||
       typeof payload.last_followup_at!=="string" ||
       !Number.isFinite(Date.parse(payload.last_followup_at)) ||
       typeof payload.motivo!=="string" || !payload.motivo.trim()))
      return response(400,{ok:false,error:"Abandono requiere evidencia de dos seguimientos y tiempo transcurrido."});
  }
  if(attendanceEvent){
    const payload=event.payload as Record<string,unknown>;
    if(typeof payload.meeting_id!=="string" ||
       !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(payload.meeting_id) ||
       typeof payload.message_id!=="string" ||
       !/^[a-zA-Z0-9_.:/+=-]{6,180}$/.test(payload.message_id) ||
       (attendanceEvent && String(event.event_type)!=="recordatorio_asistencia_enviado" &&
        (typeof payload.respuesta_texto!=="string" ||
         !payload.respuesta_texto.trim() || payload.respuesta_texto.length>500)) ||
       (payload.respuesta_texto!==undefined && typeof payload.respuesta_texto!=="string"))
       return response(400,{ok:false,error:"La respuesta de asistencia debe indicar meeting_id y message_id válidos."});
  }
  const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url || !key) return response(500,{ok:false,error:"Configuración incompleta."});
  try {
    const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    // Existing cita_confirmada remains a booking/lead-stage event.
    // ONLY explicit RSVP events with a unique meeting ID may update attendance.
    const rpc=attendanceEvent?"crm_apply_attendance_agent_event":
      commercialEvent?"crm_apply_commercial_agent_event":"crm_receive_whatsapp_event";
    // The service role is the only caller. Commercial events can be emitted
    // by Railway only AFTER the Lovable Cloud migration is applied.
    const {error}=await supabase.rpc(rpc,{
      p_event_type:event.event_type,p_wa_id:wa,
      p_timestamp:timestamp,p_payload:event.payload,
    });
    if(error){
      console.error("CRM inbound RPC failed",error.code);
      if(attendanceEvent && error.code==="P0001")
        return response(422,{ok:false,error:"No se pudo aplicar la respuesta a esa reunión. Verifica meeting_id, teléfono, recordatorio y horario."});
      if(commercialEvent && error.code==="P0001")
        return response(422,{ok:false,error:"Evento comercial no válido para este contacto, su etapa o su evidencia."});
      return response(500,{ok:false,error:"No se pudo guardar el evento."});
    }
    // CRM receipt is already durable. A Google failure stays pending, never undo the RSVP.
    if(event.event_type==="asistencia_rechazada"){
      try{
        const result=await fetch("https://complicelab.com/api/public/calendar/attendance",{
          method:"POST",headers:{"content-type":"application/json","x-clave":secret},
          body:JSON.stringify({meeting_id:(event.payload as Record<string,unknown>).meeting_id}),
          signal:AbortSignal.timeout(4000),
        });
        await result.body?.cancel();
      }catch{/* Later verified sync retries the stored pending cancellation. */}
    }
    return response(200,{ok:true});
  } catch(e){console.error("CRM inbound failed",e instanceof Error?e.name:"unknown");return response(500,{ok:false,error:"No se pudo guardar el evento."});}
});
