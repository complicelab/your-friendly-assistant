import { describe, expect, it } from 'vitest';
import { matchContactForGoogleEvent } from '@/lib/google-calendar-sync.server';

const contacts=[
 {id:'one',email:'ana@empresa.com',whatsapp:'+57 300 111 1111'},
 {id:'two',email:'pablo@empresa.com',whatsapp:'+57 300 222 2222'},
];
describe('Google Calendar matches verified clients only',()=>{
 it('matches an existing attendee by exact email',()=>{
  expect(matchContactForGoogleEvent({attendees:[{email:'ANA@EMPRESA.COM'}]},contacts)).toEqual({contactId:'one',ambiguous:false});
 });
 it('matches the client when they organized the event and invited the agency',()=>{
  expect(matchContactForGoogleEvent({organizer:{email:'pablo@empresa.com'},attendees:[{email:'complicelab@gmail.com',self:true}]},contacts).contactId).toBe('two');
 });
 it('matches a CRM-labelled WhatsApp when the attendee list is empty',()=>{
  expect(matchContactForGoogleEvent({description:'Reunión comercial\nWhatsApp: +57 300 222 2222'},contacts).contactId).toBe('two');
 });
 it('ignores name-only calendar events',()=>{
  expect(matchContactForGoogleEvent({description:'Reunión con Ana'},contacts).contactId).toBeNull();
 });
 it('does not use the agency address to match a client',()=>{
  expect(matchContactForGoogleEvent({attendees:[{email:'complicelab@gmail.com',self:true}]},contacts).contactId).toBeNull();
 });
 it('rejects competing contact identifiers',()=>{
  expect(matchContactForGoogleEvent({attendees:[{email:'ana@empresa.com'}],description:'Correo: pablo@empresa.com'},contacts)).toEqual({contactId:null,ambiguous:true});
 });
 it('does not choose a CRM client when an email is duplicated',()=>{
  const duplicated=[...contacts,{id:'three',email:'ana@empresa.com',whatsapp:null}];
  expect(matchContactForGoogleEvent({attendees:[{email:'ana@empresa.com'}]},duplicated)).toEqual({contactId:null,ambiguous:true});
 });
});
