import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/calendar')({
 server:{handlers:{
  GET:async({request})=>{
   try{
    const {requireCalendarAdmin,calendarStatus}=await import('@/lib/calendar-connection.server');
    await requireCalendarAdmin(request);
    return Response.json({ok:true,...await calendarStatus()},{headers:{'Cache-Control':'no-store'}});
   }catch(error){
    return Response.json({ok:false,error:error instanceof Error&&error.message==='NO_AUTH'?'Acceso denegado.':'No se pudo consultar el estado de Calendar.'},{
     status:error instanceof Error&&error.message==='NO_AUTH'?401:503,
     headers:{'Cache-Control':'no-store'},
    });
   }
  },
  POST:async({request})=>{
   try{
    const cal=await import('@/lib/calendar-connection.server');
    await cal.requireCalendarAdmin(request);
    const body=await request.json() as {action?:string;meeting_id?:string};
    if(body.action==='connect')return Response.json({ok:true,url:await cal.startCalendarConsent(request)});
    if(body.action==='status')return Response.json({ok:true,...await cal.calendarStatus()});
    if(body.action==='disconnect'){
      await cal.disconnectCalendar();
      return Response.json({ok:true});
    }
    if(body.action==='sync'){
      const {synchronizeGoogleAppointments}=await import('@/lib/google-calendar-sync.server');
      return Response.json({ok:true,stats:await synchronizeGoogleAppointments()});
    }
    if(body.action==='cancel'&&body.meeting_id){
      const {cancelGoogleMeeting}=await import('@/lib/google-calendar-sync.server');
      await cancelGoogleMeeting(body.meeting_id);
      return Response.json({ok:true});
    }
    return Response.json({ok:false,error:'Acción no válida.'},{status:400});
   }catch(error){
    const message=error instanceof Error?error.message:'Error del calendario.';
    const status=message==='NO_AUTH'?401:message.includes('no corresponde')?403:503;
    return Response.json({ok:false,error:message==='NO_AUTH'?'Acceso denegado.':message},{status,headers:{'Cache-Control':'no-store'}});
   }
  },
 }}
});
