import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/calendar/cron')({
 server:{handlers:{
  POST:async({request})=>{
   const {timingSafeEqual}=await import('node:crypto');
   const configured=String(process.env.CRM_CALENDAR_CRON_SECRET||'');
   const provided=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
   // When no secret exists, this endpoint is strictly disabled.
   if(configured.length<32||provided.length!==configured.length||
     !timingSafeEqual(Buffer.from(configured),Buffer.from(provided)))
      return Response.json({ok:false,error:'Acceso denegado.'},{status:401});
   try{
    const {synchronizeGoogleAppointments}=await import('@/lib/google-calendar-sync.server');
    const stats=await synchronizeGoogleAppointments();
    return Response.json({ok:true,stats},{headers:{'Cache-Control':'no-store'}});
   }catch{
    return Response.json({ok:false,error:'No se pudo sincronizar el calendario.'},{status:503});
   }
  },
 }}
});
