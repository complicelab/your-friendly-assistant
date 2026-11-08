import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { contactPayload, SOURCES, STAGES, SERVICES, type Contact } from '@/lib/crm-model';
import { supabase } from '@/integrations/supabase/client';
import { isCrmAdministrator } from '@/lib/crm-access';
import { CrmModal, FormField } from './shared';

export function ContactForm({open,onOpenChange,onCreated}: {open:boolean;onOpenChange:(open:boolean)=>void;onCreated:(contact:Contact,warning:string)=>void}) {
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy(true);setError('');
    try {
      const payload=contactPayload(form);
      const {data:auth}=await supabase.auth.getUser();
      if (!isCrmAdministrator(auth.user)) throw new Error('La sesión no tiene acceso. Vuelve a entrar.');
      const {data,error:failure}=await supabase.from('crm_contacts').insert(payload).select('*').single();
      if (failure || !data) throw new Error('No se pudo guardar el contacto. Intenta de nuevo.');
      const {error:activityError}=await supabase.from('crm_activities').insert({contact_id:data.id,activity_type:'contact_created',actor_type:'admin',body:'Contacto creado manualmente por el administrador.'});
      onCreated(data,activityError?'Contacto guardado; no se pudo registrar la actividad.':'Contacto creado.');
      onOpenChange(false);
    } catch(failure) {setError(failure instanceof Error?failure.message:'No se pudo guardar.');}
    finally {setBusy(false);}
  }
  return <CrmModal open={open} onOpenChange={(value)=>{if (!busy){setError('');onOpenChange(value);}}} title="Nuevo contacto" description="Registrar una oportunidad en el CRM interno.">
    <form onSubmit={submit} className="crm-form-grid">
      <FormField label="Nombre y apellido *" wide><input name="full_name" required maxLength={180} autoComplete="name" /></FormField>
      <FormField label="Marca / empresa"><input name="brand_name" maxLength={180}/></FormField>
      <FormField label="WhatsApp"><input name="whatsapp" type="tel" autoComplete="tel"/></FormField>
      <FormField label="Correo"><input name="email" type="email" autoComplete="email"/></FormField>
      <FormField label="País"><input name="country"/></FormField>
      <FormField label="Profesión"><input name="profession"/></FormField>
      <FormField label="Tipo de negocio"><input name="business_type"/></FormField>
      <FormField label="Qué necesita" wide><textarea name="need" rows={2}/></FormField>
      <FormField label="Servicio de interés" wide><select name="solution_interest" defaultValue=""><option value="">Seleccionar servicio</option>{SERVICES.map(value=><option key={value}>{value}</option>)}</select></FormField>
      <FormField label="Origen"><select name="source" defaultValue="manual">{SOURCES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></FormField>
      <FormField label="Estado inicial"><select name="status" defaultValue="nuevo">{STAGES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></FormField>
      <FormField label="Próximo seguimiento" wide><input name="next_follow_up_at" type="datetime-local"/></FormField>
      <FormField label="Notas" wide><textarea name="notes" rows={3}/></FormField>
      <div className="crm-wide crm-permissions"><label><input type="checkbox" name="consent_service"/> Autorizó contacto para atender su solicitud</label><label><input type="checkbox" name="consent_marketing"/> Autorizó expresamente comunicaciones de marketing</label></div>
      {error && <p role="alert" className="crm-notice crm-wide">{error}</p>}
      <div className="crm-form-actions crm-wide"><Button type="button" variant="outline" disabled={busy} onClick={()=>onOpenChange(false)}>Cancelar</Button><Button disabled={busy} type="submit">{busy?'Guardando…':'Guardar contacto'}</Button></div>
    </form>
  </CrmModal>;
}