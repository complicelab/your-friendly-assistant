import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route=createFileRoute('/api/public/calendar/attendance')({server:{handlers:{
  POST:async({request})=>{
    const expected=process.env['CRM_WEBHOOK_SECRET'];
    const supplied=request.headers.get('x-clave')||'';
    if(!expected)return Response.json({ok:false},{status:401});
    const encoder=new TextEncoder();
    const [a,b]=await Promise.all([crypto.subtle.digest('SHA-256',encoder.encode(expected)),
      crypto.subtle.digest('SHA-256',encoder.encode(supplied))]);
    const x=new Uint8Array(a),y=new Uint8Array(b);
    let difference=0;
    for(let i=0;i<x.length;i++)difference|=(x[i]??0)^(y[i]??0);
    if(difference!==0)return Response.json({ok:false},{status:401});
    let data:unknown;
    try{data=await request.json();}catch{return Response.json({ok:false},{status:400});}
    const parsed=z.object({meeting_id:z.string().uuid()}).strict().safeParse(data);
    if(!parsed.success)
      return Response.json({ok:false},{status:400});
    try{
      const {reconcileAttendanceCancellation}=await import('@/lib/calendar-attendance.server');
      const result=await reconcileAttendanceCancellation(parsed.data.meeting_id);
      return Response.json({ok:true,...result},{headers:{'Cache-Control':'no-store'}});
    }catch{return Response.json({ok:false,pending:true},{status:503,headers:{'Cache-Control':'no-store'}});}
  },
}}});