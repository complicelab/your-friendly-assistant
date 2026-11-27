import {createFileRoute} from '@tanstack/react-router';

/** Protected server route. No Railway SQL or secrets in browser bundles. */
export const Route=createFileRoute('/api/railway/reconcile')({
 server:{handlers:{
  POST:async({request})=>{
   try{
    const {requireCalendarAdmin}=await import('@/lib/calendar-connection.server');
    await requireCalendarAdmin(request);
    if(Number(request.headers.get('content-length')||'0')>1024)
      return Response.json({ok:false,error:'Solicitud demasiado grande.'},{status:413});
    const body=await request.json() as {action?:string};
    if(body.action!=='preview'&&body.action!=='import')
      return Response.json({ok:false,error:'Acción no válida.'},{status:400});
    const {reconcileRailwayContacts}=await import('@/lib/railway-conversation-reconcile.server');
    const result=await reconcileRailwayContacts(body.action);
    return Response.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}});
   }catch(error){
    const message=error instanceof Error?error.message:'No se pudo conciliar Railway.';
    const denied=message==='NO_AUTH';
    const config=message.startsWith('Falta configurar RAILWAY_READONLY_DATABASE_URL');
    const errorText=denied?'Acceso denegado.':
      config?'La integración de lectura de Railway aún no está configurada en Lovable Cloud.':
      'La conciliación no pudo completarse. No se modificó Railway.';
    return Response.json({ok:false,error:errorText,configured:!config},{status:denied?401:config?503:500,
      headers:{'Cache-Control':'no-store'}});
   }
  },
 }}
});
