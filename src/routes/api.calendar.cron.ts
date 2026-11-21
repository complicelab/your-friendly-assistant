import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/calendar/cron')({
 server:{handlers:{
  POST:async({request})=>{
   const configured=String(process.env['CRM_CALENDAR_CRON_SECRET']||'');
   const provided=(request.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
   // When no secret exists, this endpoint is strictly disabled.
   const secretBytes=new TextEncoder().encode(configured);
   const providedBytes=new TextEncoder().encode(provided);
   let difference=0;
   if(secretBytes.length===providedBytes.length){
     for(let i=0;i<secretBytes.length;i++)difference|=secretBytes[i]!^providedBytes[i]!;
   }
   if(configured.length<32||secretBytes.length!==providedBytes.length||difference!==0)
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
