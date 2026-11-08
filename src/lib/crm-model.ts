import type { Database } from '@/integrations/supabase/types';

export type Contact = Database['public']['Tables']['crm_contacts']['Row'];
export type Activity = Database['public']['Tables']['crm_activities']['Row'];
export type Task = Database['public']['Tables']['crm_tasks']['Row'];
export const STAGES = [['nuevo','Nuevo'],['contactado','Contactado'],['calificado','Calificado'],['cita_agendada','Cita agendada'],['propuesta','Propuesta'],['seguimiento','Seguimiento'],['ganado','Ganado'],['perdido','Perdido']] as const;
export const SOURCES = [['manual','Manual'],['web','Web'],['whatsapp','WhatsApp'],['meta_ads','Meta Ads'],['instagram','Instagram'],['referido','Referido'],['otro','Otro']] as const;
export const SERVICES = ['Sistemas con IA a la medida','Agente de IA automatizado','Marketing digital','Otro'];
export function stageLabel(value: string) { return STAGES.find(([key]) => key === value)?.[1] ?? value; }
export function sourceLabel(value: string) { return SOURCES.find(([key]) => key === value)?.[1] ?? value; }
export function validatePassword(password: string, confirmation: string) {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (password !== confirmation) return 'Las contraseñas no coinciden.';
  return '';
}
export function contactPayload(form: FormData): Database['public']['Tables']['crm_contacts']['Insert'] {
  const text = (key: string) => String(form.get(key) ?? '').trim();
  const full_name = text('full_name');
  if (!full_name) throw new Error('El nombre y apellido es obligatorio.');
  const source = text('source') || 'manual';
  if (!SOURCES.some(([key]) => key === source)) throw new Error('Selecciona un origen válido.');
  const status = text('status') || 'nuevo';
  if (!STAGES.some(([key]) => key === status)) throw new Error('Selecciona una etapa válida.');
  const consent_service = form.get('consent_service') === 'on';
  const consent_marketing = form.get('consent_marketing') === 'on';
  return {
    full_name, brand_name: text('brand_name') || null, whatsapp: text('whatsapp') || null,
    email: text('email') || null, country: text('country') || null, profession: text('profession') || null,
    business_type: text('business_type') || null, need: text('need') || null,
    solution_interest: text('solution_interest') || null, source, status,
    next_follow_up_at: text('next_follow_up_at') ? new Date(text('next_follow_up_at')).toISOString() : null,
    notes: text('notes') || null, consent_service, consent_marketing,
    consent_at: consent_service || consent_marketing ? new Date().toISOString() : null,
    consent_text: consent_service || consent_marketing ? 'Autorización registrada expresamente por el administrador en contacto manual.' : null,
    agent_enabled: false,
  };
}
export function matchesContact(contact: Contact, query: string, status: string, source: string) {
  const q = query.trim().toLocaleLowerCase('es');
  return (!status || contact.status === status) && (!source || contact.source === source) &&
    [contact.full_name,contact.brand_name,contact.whatsapp,contact.email,contact.profession,contact.business_type,contact.source,sourceLabel(contact.source),contact.status,stageLabel(contact.status)]
      .join(' ').toLocaleLowerCase('es').includes(q);
}
export function dateLabel(value: string | null) {
  return value ? new Date(value).toLocaleString('es-CO', {dateStyle:'medium',timeStyle:'short'}) : 'Sin registrar';
}
export function localDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,16);
}