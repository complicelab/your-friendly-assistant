import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/calendar')({
 server:{handlers:{
  GET:async({request})=>{
   try{
    const {requireCalendarAdmin,calendarStatus}=await import('@/lib/calendar-connection.server');
    await requireCalendarAdmin(request);
    const basic=await calendarStatus();
    let bookingDuration=null;
    if(basic.connected){
      try{
        const {readGoogleBookingDurationStatus}=await import('@/lib/google-booking-duration.server');
        bookingDuration=await readGoogleBookingDurationStatus();
      }catch{
        bookingDuration={connected:true,minutes:null,observations:0,checkedAt:null,
          status:'error',source:'none'};
      }
    }
    return Response.json({ok:true,...basic,booking_duration:bookingDuration},{headers:{'Cache-Control':'no-store'}});
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
    const body=await request.json() as {action?:string;meeting_id?:string;event_id?:string;contact_id?:string;starts_at?:string;from?:string;to?:string};
    if(body.action==='connect')return Response.json({ok:true,url:await cal.startCalendarConsent(request)});
    if(body.action==='status')return Response.json({ok:true,...await cal.calendarStatus()});
    if(body.action==='disconnect'){
      await cal.disconnectCalendar();
      return Response.json({ok:true});
    }
    if(body.action==='duration_sync'){
      const {syncGoogleBookingDuration}=await import('@/lib/google-booking-duration.server');
      const status=await syncGoogleBookingDuration(true);
      return Response.json({ok:true,booking_duration:status},{headers:{'Cache-Control':'no-store'}});
    }
    if(body.action==='sync'){
      const {synchronizeGoogleAppointments}=await import('@/lib/google-calendar-sync.server');
      return Response.json({ok:true,stats:await synchronizeGoogleAppointments()});
    }
    if(body.action==='agenda'&&body.from&&body.to){
      // This endpoint is authenticated above. Never return raw Google descriptions,
      // guest emails, OAuth credentials or event-conference metadata.
      const {googleAgendaForAdmin}=await import('@/lib/calendar-agenda.server');
      const result=await googleAgendaForAdmin(body.from,body.to);
      return Response.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}});
    }
    if(body.action==='review'){
      const {reviewCalendarEvents}=await import('@/lib/calendar-review.server');
      return Response.json({ok:true,...await reviewCalendarEvents()},{headers:{'Cache-Control':'no-store'}});
    }
    if(body.action==='ignore'&&body.event_id){
      const {markCalendarEventIgnored}=await import('@/lib/calendar-review.server');
      await markCalendarEventIgnored(body.event_id);
      return Response.json({ok:true});
    }
    if(body.action==='restore'&&body.event_id){
      const {restoreCalendarEvent}=await import('@/lib/calendar-review.server');
      await restoreCalendarEvent(body.event_id);
      return Response.json({ok:true});
    }
    if(body.action==='link'&&body.event_id&&body.contact_id){
      const {linkCalendarEventToClient}=await import('@/lib/calendar-review.server');
      return Response.json({ok:true,...await linkCalendarEventToClient(body.event_id,body.contact_id)});
    }
    if(body.action==='probe'){
      const {verifyCalendarConnectionWithoutWrites}=await import('@/lib/calendar-review.server');
      return Response.json({ok:true,...await verifyCalendarConnectionWithoutWrites()});
    }
    if(body.action==='reschedule'&&body.meeting_id&&body.starts_at){
      const {moveCalendarMeeting}=await import('@/lib/calendar-review.server');
      return Response.json({ok:true,...await moveCalendarMeeting(body.meeting_id,body.starts_at)});
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
