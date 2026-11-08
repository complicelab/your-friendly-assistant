import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { isCrmAdministrator, CRM_ADMIN_EMAIL } from '@/lib/crm-access';
import { validatePassword } from '@/lib/crm-model';
import { CrmModal, FormField } from './shared';

export async function sendRecovery() {
  const {error}=await supabase.auth.resetPasswordForEmail(CRM_ADMIN_EMAIL,{redirectTo:window.location.origin+'/reset-password'});
  if(error) throw new Error('No se pudo enviar la recuperación. Intenta más tarde.');
}
export function Security({open,onOpenChange}: {open:boolean;onOpenChange:(value:boolean)=>void}) {
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const element=event.currentTarget; const form=new FormData(element);
    const password=String(form.get('password')??''); const current=String(form.get('current_password')??'');
    const error=validatePassword(password,String(form.get('confirmation')??'')); if(error){setMessage(error);return;}
    setBusy(true);setMessage('');
    try {
      const {data}=await supabase.auth.getUser(); if(!isCrmAdministrator(data.user)) throw new Error('Tu sesión no tiene acceso.');
      const {error:failure}=await supabase.auth.updateUser(current?{password,current_password:current}:{password});
      if(failure) throw new Error(failure.code==='current_password_required' || /current password/i.test(failure.message)?'Se requiere tu contraseña actual. Si todavía no tienes una, utiliza la recuperación por correo.':'No se pudo cambiar la contraseña. Revisa la contraseña actual o elige una nueva más segura.');
      element.reset();setMessage('Contraseña guardada. Tu próximo acceso será con correo y contraseña.');
    } catch(failure){setMessage(failure instanceof Error?failure.message:'No se pudo guardar.');}finally{setBusy(false);}
  }
  return <CrmModal open={open} onOpenChange={onOpenChange} title="Seguridad" description="Establecer / cambiar contraseña">
    <form onSubmit={submit} className="crm-stack">
      <p className="crm-subtle">{CRM_ADMIN_EMAIL}</p>
      <FormField label="Contraseña actual"><input type="password" name="current_password" autoComplete="current-password"/><small>Para cambiar una contraseña existente. Déjala vacía si es tu primera contraseña.</small></FormField>
      <FormField label="Contraseña nueva"><input type="password" name="password" required minLength={8} autoComplete="new-password"/></FormField>
      <FormField label="Confirmar contraseña nueva"><input type="password" name="confirmation" required minLength={8} autoComplete="new-password"/></FormField>
      <small className="crm-subtle">Mínimo 8 caracteres.</small>
      {message&&<p role="status" className="crm-notice">{message}</p>}
      <Button disabled={busy} type="submit">{busy?'Guardando…':'Guardar contraseña'}</Button>
      <Button variant="link" type="button" disabled={busy} onClick={async()=>{setBusy(true);try{await sendRecovery();setMessage('Revisa tu correo para restablecer la contraseña.');}catch(error){setMessage(error instanceof Error?error.message:'No se pudo enviar.');}finally{setBusy(false);}}}>Recuperar por correo</Button>
    </form>
  </CrmModal>;
}