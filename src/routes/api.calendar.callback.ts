import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/calendar/callback')({
 server:{handlers:{
  GET:async({request})=>{
   // Trust only the explicitly configured callback origin, not arbitrary Host.
   const redirect=String(process.env['GOOGLE_CALENDAR_REDIRECT_URI']||'');
   const host=redirect?new URL(redirect).origin:new URL(request.url).origin;
   const back=(code:string)=>Response.redirect(new URL('/admin?calendar='+code,host),303);
   const url=new URL(request.url);
   if(url.searchParams.get('error'))return back('denied');
   const code=url.searchParams.get('code'),state=url.searchParams.get('state');
   if(!code||!state)return back('invalid');
   try{
    const {completeCalendarConsent}=await import('@/lib/calendar-connection.server');
    await completeCalendarConsent(code,state);
    return back('connected');
   }catch(error){
    console.error('[calendar] OAuth callback failed:',error instanceof Error?error.message:'unknown');
    return back('error');
   }
  },
 }}
});
