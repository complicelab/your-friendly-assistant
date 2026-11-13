import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";
import "./systems-booking.css";
type Slot={slot_start:string;[key:string]:unknown};
type BookingData={full_name:string;brand_name:string;country_code:string;whatsapp:string;email:string;consent:boolean};
const dateKey=(value:string)=>{const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(value));const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));return p["year"]+"-"+p["month"]+"-"+p["day"]};
const longDate=(value:string)=>new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",weekday:"long",day:"numeric",month:"long",hour:"numeric",minute:"2-digit",hour12:true}).format(new Date(value));
const shortDate=(value:string)=>new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",weekday:"short",day:"numeric",month:"short"}).format(new Date(value));
const hour=(value:string)=>new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",hour:"numeric",minute:"2-digit",hour12:true}).format(new Date(value));
const today=()=>dateKey(new Date().toISOString());
const DEFAULT_DATA:BookingData={full_name:"",brand_name:"",country_code:"+57",whatsapp:"",email:"",consent:false};


export function SystemsBooking({modal=false,onClose,serviceName="Sistemas con IA a la medida",interest="Creamos sistemas con IA a la medida"}:{modal?:boolean;onClose?:()=>void;serviceName?:string;interest?:string}){
 const id=useId();
 const [slots,setSlots]=useState<Slot[]>([]);
 const [date,setDate]=useState("");
 const [selected,setSelected]=useState("");
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [form,setForm]=useState<BookingData>(DEFAULT_DATA);
 const [sending,setSending]=useState(false);
 const [confirmed,setConfirmed]=useState("");
 const [step,setStep]=useState<"slot"|"data">("slot");
 useEffect(()=>{
  let live=true;
  const controller=new AbortController();
  fetch("/api/booking?start="+encodeURIComponent(today())+"&days=60",{signal:controller.signal,headers:{"Accept":"application/json"}})
    .then(async response=>{const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||"No se pudo cargar la disponibilidad.");return data;})
    .then(data=>{if(live){setSlots(Array.isArray(data.slots)?data.slots.filter((x:Slot)=>x&&x.slot_start):[]);setError("");}})
    .catch(e=>{if(live){setError(e?.message||"No se pudo cargar la disponibilidad.");}})
    .finally(()=>{if(live)setLoading(false)});
  return()=>{live=false;controller.abort()};
 },[]);
 useEffect(()=>{
  if(!modal)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"&&onClose)onClose()};
  document.addEventListener("keydown",key);
  return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",key)};
 },[modal,onClose]);
 const dates=useMemo(()=>[...new Set(slots.map(x=>dateKey(x.slot_start)))].sort(),[slots]);
 const times=useMemo(()=>slots.filter(s=>dateKey(s.slot_start)===date).sort((a,b)=>a.slot_start.localeCompare(b.slot_start)),[slots,date]);
 const chooseDay=(day:string)=>{setDate(day);setSelected("");setError("")};
 const setField=<K extends keyof BookingData>(key:K,value:BookingData[K])=>setForm(previous=>({...previous,[key]:value}));
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setError("");
  if(!selected){setError("Selecciona una fecha y una hora disponibles.");setStep("slot");return;}
  if(!form.consent){setError("Debes autorizar el uso de tus datos para gestionar el diagnóstico.");return;}
  setSending(true);
  const phone=form.whatsapp.trim();
  const fullPhone=(phone.startsWith("+")?phone:form.country_code+phone).replace(/\s+/g,"");
  const countryByCode:Record<string,string>={"+57":"Colombia","+1":"Estados Unidos","+52":"México","+51":"Perú","+34":"España","+56":"Chile"};
  try{
   const response=await fetch("/api/booking",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({full_name:form.full_name.trim(),brand_name:form.brand_name.trim(),country:countryByCode[form.country_code]||"Colombia",country_code:form.country_code,whatsapp:fullPhone,email:form.email.trim(),solution_interest:interest,starts_at:selected})});
   const result=await response.json();
   if(!response.ok||!result.ok)throw new Error(result.error||"No se pudo confirmar el diagnóstico.");
   setConfirmed(selected);
  }catch(e){setError(e instanceof Error?e.message:"No se pudo confirmar el diagnóstico.");}
  finally{setSending(false)}
 }
 const body=confirmed?<div className="sb-success" role="status"><CheckCircle2 size={36}/><h3>Diagnóstico agendado</h3><p>Tu reserva quedó registrada para <strong>{longDate(confirmed)}</strong>, hora de Colombia. Las notificaciones se enviarán según los canales configurados.</p>{modal?<button onClick={onClose} type="button">Cerrar</button>:null}</div>:
 <>
 <div className="sb-heading"><span>{serviceName==="Sistemas con IA a la medida"?"DIAGNÓSTICO PARA SISTEMAS CON IA":"DIAGNÓSTICO · CÓMPLICE LAB"}</span><h3>Conversemos sobre tu negocio.</h3><p>Elige una fecha real disponible y deja tus datos. Nos reuniremos por videollamada.</p></div>
 <div className={"sb-form-layout "+(step==="data"?"sb-mobile-data":"")}>
  <section className="sb-calendar" aria-label="Elige el horario"><div className="sb-subhead"><CalendarDays size={20}/><div><strong>01. Fecha y hora</strong><span>Hora de Colombia</span></div></div>
  {loading?<p className="sb-loading" role="status">Consultando horarios disponibles…</p>:dates.length===0?<p className="sb-loading">No hay horarios disponibles actualmente. Puedes escribirnos para coordinar una alternativa.</p>:<>
  <div className="sb-days">{dates.map(day=><button key={day} type="button" onClick={()=>chooseDay(day)} aria-pressed={date===day} className={date===day?"active":""}>{shortDate(slots.find(s=>dateKey(s.slot_start)===day)!.slot_start)}</button>)}</div>
  <div className="sb-times">{!date?<p>Selecciona primero un día disponible.</p>:times.map(slot=><button key={slot.slot_start} type="button" aria-pressed={selected===slot.slot_start} className={selected===slot.slot_start?"active":""} onClick={()=>{setSelected(slot.slot_start);setError("")}}>{hour(slot.slot_start)}</button>)}</div>
  </>}
  <div className="sb-selection"><Clock3 size={16}/>{selected?longDate(selected):"El horario elegido aparecerá aquí"}</div>
  <button className="sb-next" type="button" disabled={!selected} onClick={()=>{setStep("data");requestAnimationFrame(()=>document.querySelector(".sb-overlay")?.scrollTo({top:0}))}}>Continuar con mis datos <ArrowRight size={15}/></button>
  </section>
  <form className="sb-fields" onSubmit={submit}><button type="button" className="sb-back" onClick={()=>{setStep("slot");requestAnimationFrame(()=>document.querySelector(".sb-overlay")?.scrollTo({top:0}))}}><ChevronLeft size={15}/> Cambiar horario</button><div className="sb-subhead"><CheckCircle2 size={20}/><div><strong>02. Tus datos</strong><span>Para gestionar tu diagnóstico</span></div></div>
  <div className="sb-input-grid">
   <label>Nombre y apellido <input required name="full_name" autoComplete="name" value={form.full_name} onChange={e=>setField("full_name",e.target.value)} placeholder="Tu nombre"/></label>
   <label>Empresa o marca <input name="brand_name" autoComplete="organization" value={form.brand_name} onChange={e=>setField("brand_name",e.target.value)} placeholder="Tu empresa"/></label>
   <label className="sb-wide">WhatsApp<div className="sb-phone"><select aria-label="Indicativo del país" value={form.country_code} onChange={e=>setField("country_code",e.target.value)}><option value="+57">🇨🇴 +57</option><option value="+1">🇺🇸 +1</option><option value="+52">🇲🇽 +52</option><option value="+51">🇵🇪 +51</option><option value="+34">🇪🇸 +34</option><option value="+56">🇨🇱 +56</option></select><input required name="whatsapp" type="tel" autoComplete="tel-national" value={form.whatsapp} onChange={e=>setField("whatsapp",e.target.value)} placeholder="Número de contacto" minLength={7}/></div></label>
   <label className="sb-wide">Correo electrónico<input required name="email" type="email" autoComplete="email" value={form.email} onChange={e=>setField("email",e.target.value)} placeholder="correo@empresa.com"/></label>
  </div>
  <p className="sb-service-label">Servicio: <strong>{serviceName}</strong></p>
  <label className="sb-consent"><input type="checkbox" required checked={form.consent} onChange={e=>setField("consent",e.target.checked)}/><span>Autorizo el uso de mis datos para gestionar este diagnóstico y sus confirmaciones. <a href="/privacidad" target="_blank" rel="noopener noreferrer">Política de privacidad.</a></span></label>
  {error?<p role="alert" className="sb-error">{error}</p>:null}
  <button className="sb-submit" type="submit" disabled={sending||loading||!selected}>{sending?"Confirmando disponibilidad…":"Agendar diagnóstico"} <ChevronRight size={17}/></button>
  </form>
 </div>
 {error&&step==="slot"?<p className="sb-error" role="alert">{error}</p>:null}
 </>
 return <div className={modal?"sb-overlay":"sb-inline"} role={modal?"presentation":undefined} onMouseDown={e=>{if(modal&&e.target===e.currentTarget)onClose?.()}}><div className="sb-panel" role={modal?"dialog":undefined} aria-modal={modal?true:undefined} aria-labelledby={id+"-heading"}>
 {modal?<div className="sb-modal-top"><span>AGENDA TU DIAGNÓSTICO</span><button type="button" onClick={onClose} aria-label="Cerrar agendamiento"><X size={22}/></button></div>:null}
 <div id={id+"-heading"} className="sb-content">{body}</div>
 </div></div>;
}
