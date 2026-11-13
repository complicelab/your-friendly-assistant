import { describe,it,expect } from 'vitest';
import {contactPayload,validatePassword,matchesContact,serviceCategory,normalizedServiceInterest,SERVICES,type Contact} from '@/lib/crm-model';
describe('CRM rules',()=>{
 it('requires at least 8 characters',()=>{expect(validatePassword('1234567','1234567')).not.toBe('');expect(validatePassword('12345678','12345678')).toBe('');});
 it('requires matching password confirmation',()=>{expect(validatePassword('12345678','87654321')).not.toBe('');});
 it('manual contacts never default to marketing consent',()=>{const form=new FormData();form.set('full_name','Test contact');const payload=contactPayload(form);expect(payload.consent_marketing).toBe(false);expect(payload.source).toBe('manual');expect(payload.agent_enabled).toBe(false);});
 it('marketing consent requires explicit selection',()=>{const form=new FormData();form.set('full_name','Test contact');form.set('consent_marketing','on');expect(contactPayload(form).consent_marketing).toBe(true);});
 it('persists the selected source',()=>{const form=new FormData();form.set('full_name','Test contact');form.set('source','meta_ads');expect(contactPayload(form).source).toBe('meta_ads');});
 it('requires a name',()=>{expect(()=>contactPayload(new FormData())).toThrow();});
 it('searches profession and localized status and source and applies filters',()=>{const contact={full_name:'Test',profession:'Arquitecta',source:'meta_ads',status:'cita_agendada'} as Contact;expect(matchesContact(contact,'arquitecta','','')).toBe(true);expect(matchesContact(contact,'Cita agendada','','')).toBe(true);expect(matchesContact(contact,'Meta Ads','','')).toBe(true);expect(matchesContact(contact,'','ganado','')).toBe(false);expect(matchesContact(contact,'','','web')).toBe(false);});

 it('keeps the four current service interests distinct',()=>{
   expect(SERVICES).toContain('Sistemas con IA a la medida');
   expect(SERVICES).toContain('Agentes de IA automatizados');
   expect(SERVICES).toContain('Páginas Web');
   expect(SERVICES).toContain('Publicidad Digital');
   expect(normalizedServiceInterest('Creamos sistemas con IA a la medida')).toBe('Sistemas con IA a la medida');
   expect(normalizedServiceInterest('Agente de IA automatizado')).toBe('Agentes de IA automatizados');
   expect(normalizedServiceInterest('Páginas Web')).toBe('Páginas Web');
   expect(normalizedServiceInterest('Publicidad Digital')).toBe('Publicidad Digital');
 });
 it('preserves legacy combined interests without incorrectly attributing them to one current service',()=>{
   expect(serviceCategory('Páginas web y publicidad en redes sociales')).toBe('Web + Publicidad (anterior)');
   expect(serviceCategory('Marketing digital')).toBe('Marketing digital (anterior)');
   expect(serviceCategory('Aún no lo sé, quiero un diagnóstico')).toBe('Diagnóstico general');
   expect(serviceCategory(null)).toBe('Sin especificar');
 });
});
