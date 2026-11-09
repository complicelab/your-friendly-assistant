export const bookingStyles = `
<style id="complice-real-booking">
  .booking-loading{padding:.8rem 0;color:var(--gris);font-size:.88rem}
  .booking-empty{padding:1rem;border:1px solid var(--linea);border-radius:14px;background:var(--hielo);color:var(--gris);font-size:.88rem;line-height:1.5}
  .booking-success-note{margin-top:1rem;color:var(--gris);font-size:.82rem;line-height:1.55}
  .day:disabled,.slot:disabled{opacity:.55;cursor:not-allowed}
  .ag,.ag-pick,.ag-form{min-width:0;box-sizing:border-box}
  .ag{max-width:100%}
  .days,.slots{max-width:100%;box-sizing:border-box}
  @media(max-width:700px){
    .ag{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:16px!important;width:100%!important;max-width:100%!important}
    .ag-pick,.ag-form{width:100%!important;max-width:100%!important;min-width:0!important}
    .days,.slots{overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}
    .days::-webkit-scrollbar,.slots::-webkit-scrollbar{display:none!important}
    .day,.slot{max-width:100%;box-sizing:border-box}
  }
</style>
`;

type BookingPublicConfig = { url: string; key: string };

/**
 * Replaces only the agenda branch of the existing v10 modal. The original
 * modal, lead form, WhatsApp flow, navigation and every other section stay intact.
 */
export function replaceBookingRuntime(html: string, config: BookingPublicConfig) {
  const legacyStart = html.indexOf("function nextDays(n){");
  const legacyEnd = html.indexOf("\n\nfunction openModal(mode,preset){", legacyStart);
  if (legacyStart < 0 || legacyEnd < 0) throw new Error("No se encontró la disponibilidad ficticia anterior.");
  html = html.slice(0, legacyStart) + html.slice(legacyEnd + 2);
  html = html.replace("function openModal(mode,preset){", "window.openModal=function openModal(mode,preset){");

  const startMarker = `  }else{\n    mbox.classList.add('wide');`;
  const endMarker = `    if(preset)f2.setPreset(preset);\n  }`;
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0 || html.indexOf(startMarker, start + 1) >= 0) {
    throw new Error("No se encontró un único bloque de agenda pública para reemplazar.");
  }

  const replacement = `  }else{
    mbox.classList.add('wide');
    var bookingConfig=${JSON.stringify(config)};
    var bookingDays=[],bookingSelection={day:'',slot:''},bookingBusy=false;
    var bookingLong=new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'long',timeZone:'America/Bogota'});
    var bookingDayName=new Intl.DateTimeFormat('es-CO',{weekday:'short',timeZone:'America/Bogota'});
    var bookingDayDate=new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',timeZone:'America/Bogota'});
    var bookingTime=new Intl.DateTimeFormat('es-CO',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'America/Bogota'});
    function bookingDateKey(value){
      var parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'America/Bogota'}).formatToParts(value);
      var map={};parts.forEach(function(p){map[p.type]=p.value;});
      return map.year+'-'+map.month+'-'+map.day;
    }
    function bookingRpc(name,body){
      if(name==='crm_public_available_slots'){
        var params=new URLSearchParams({
          start:String(body.p_start_date||''),
          days:String(body.p_days||14)
        });
        return fetch('/api/booking?'+params.toString(),{
          method:'GET',
          headers:{'Accept':'application/json'}
        }).then(function(response){
          return response.json().then(function(data){
            if(!response.ok||!data.ok)throw new Error(data.error||'No fue posible consultar la disponibilidad.');
            return data.slots||[];
          });
        });
      }
      if(name==='crm_public_book_meeting'){
        return fetch('/api/booking',{
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify({
            full_name:body.p_full_name,
            brand_name:body.p_brand_name,
            country:body.p_country,
            country_code:body.p_country_code,
            whatsapp:body.p_whatsapp,
            email:body.p_email,
            solution_interest:body.p_solution_interest,
            starts_at:body.p_starts_at
          })
        }).then(function(response){
          return response.json().then(function(data){
            if(!response.ok||!data.ok)throw new Error(data.error||'No fue posible guardar la videollamada.');
            return data.meeting_id;
          });
        });
      }
      return Promise.reject(new Error('Operación de agenda no soportada.'));
    }
    function bookingSummary(){
      var el=$('#summary');
      el.textContent=bookingSelection.slot?cap1(bookingLong.format(new Date(bookingSelection.slot)))+' · '+bookingTime.format(new Date(bookingSelection.slot))+' · Hora de Colombia':'';
    }
    function renderBookingSlots(){
      var host=$('.slots',mcontent);
      var day=bookingDays.find(function(d){return d.key===bookingSelection.day;});
      if(!day){host.innerHTML='<p class="booking-empty">Selecciona un día para ver sus horarios.</p>';return;}
      host.innerHTML=day.slots.map(function(slot){return '<button type="button" class="slot" role="radio" aria-checked="'+(slot.slot_start===bookingSelection.slot?'true':'false')+'" data-slot="'+slot.slot_start+'">'+bookingTime.format(new Date(slot.slot_start))+'</button>';}).join('');
      $$('.slot',host).forEach(function(button){button.addEventListener('click',function(){
        bookingSelection.slot=button.getAttribute('data-slot')||'';
        $$('.slot',host).forEach(function(x){x.setAttribute('aria-checked',x===button?'true':'false');});
        $('#slot-err').textContent='';bookingSummary();
      });});
    }
    function renderBookingDays(){
      var host=$('.days',mcontent);
      if(!bookingDays.length){host.innerHTML='<p class="booking-empty">No hay horarios disponibles en los próximos 14 días. Intenta de nuevo más tarde.</p>';$('.slots',mcontent).innerHTML='';return;}
      host.innerHTML=bookingDays.map(function(day){return '<button type="button" class="day" role="radio" aria-checked="'+(day.key===bookingSelection.day?'true':'false')+'" data-day="'+day.key+'">'+cap1(bookingDayName.format(new Date(day.slots[0].slot_start)).replace('.',''))+'<small>'+bookingDayDate.format(new Date(day.slots[0].slot_start)).replace('.','')+'</small></button>';}).join('');
      $$('.day',host).forEach(function(button){button.addEventListener('click',function(){
        bookingSelection.day=button.getAttribute('data-day')||'';bookingSelection.slot='';
        $$('.day',host).forEach(function(x){x.setAttribute('aria-checked',x===button?'true':'false');});
        renderBookingSlots();bookingSummary();$('#slot-err').textContent='';
      });});
    }
    function loadBookingAvailability(){
      bookingSelection={day:'',slot:''};bookingSummary();
      $('.days',mcontent).innerHTML='<p class="booking-loading">Consultando disponibilidad real…</p>';
      $('.slots',mcontent).innerHTML='';
      return bookingRpc('crm_public_available_slots',{p_start_date:bookingDateKey(new Date()),p_days:14}).then(function(rows){
        var grouped={};
        (Array.isArray(rows)?rows:[]).forEach(function(slot){var key=bookingDateKey(new Date(slot.slot_start));if(!grouped[key])grouped[key]={key:key,slots:[]};grouped[key].slots.push(slot);});
        bookingDays=Object.keys(grouped).sort().map(function(key){return grouped[key];});
        renderBookingDays();renderBookingSlots();
        if(bookingDays.length){bookingSelection.day=bookingDays[0].key;renderBookingDays();renderBookingSlots();}
      }).catch(function(){
        bookingDays=[];$('.days',mcontent).innerHTML='<p class="booking-empty">No pudimos consultar la disponibilidad. Revisa tu conexión e intenta nuevamente.</p>';
        $('.slots',mcontent).innerHTML='<button type="button" class="slot" id="booking-retry">Reintentar</button>';
        $('#booking-retry').addEventListener('click',loadBookingAvailability);
      });
    }
    mcontent.innerHTML='<div id="m-host"><div class="ag"><div class="ag-pick"><h2 class="m-title" id="m-title">Agenda tu diagnóstico</h2><p class="m-sub">Elige un día y una hora. Todos los horarios se muestran en America/Bogota: <b>Hora de Colombia</b>.</p>'+
      '<h3 id="d-l">Día</h3><div class="days" role="radiogroup" aria-labelledby="d-l"><p class="booking-loading">Consultando disponibilidad real…</p></div>'+
      '<h3 id="s-l">Hora</h3><div class="slots" role="radiogroup" aria-labelledby="s-l"></div>'+
      '<p class="err" id="slot-err" role="alert"></p><p class="summary" id="summary" aria-live="polite"></p>'+
      '<p class="m-note">El diagnóstico es una sesión gratuita. Al confirmar, la cita queda registrada en nuestro CRM para que lleguemos preparados a la conversación.</p></div>'+
      '<div class="ag-form">'+leadForm('m','Agendar diagnóstico')+'</div></div></div>';
    var f2=$('#m-form');
    bindLead(f2,{
      extraCheck:function(){if(!bookingSelection.day||!bookingSelection.slot){$('#slot-err').textContent='Elige un día y una hora disponibles.';return $('.day',mcontent)||$('.days',mcontent);}return null;},
      submit:function(lead,done){
        if(bookingBusy){done();return;}
        bookingBusy=true;$('#slot-err').textContent='';
        var selectedDate=new Date(bookingSelection.slot);
        var appointment=cap1(bookingLong.format(selectedDate))+' · '+bookingTime.format(selectedDate)+' (Hora de Colombia)';
        bookingRpc('crm_public_book_meeting',{
          p_full_name:lead.nombre,
          p_brand_name:lead.marca,
          p_country:lead.pais,
          p_country_code:lead.codigo,
          p_whatsapp:lead.codigo+lead.whatsapp,
          p_email:lead.email,
          p_solution_interest:lead.servicioLabel,
          p_starts_at:bookingSelection.slot,
          p_consent_text:'Autorizo a Cómplice Lab a usar mis datos para gestionar esta videollamada y responder a mi solicitud.'
        }).then(function(){
          $('#m-host').innerHTML=successView('Diagnóstico agendado, '+lead.nombre.split(' ')[0]+'.','Tu diagnóstico quedó agendado para '+appointment+'. La reserva ya está registrada en nuestro CRM.','','');
          var demoNote=$('.demo-note',$('#m-host'));if(demoNote)demoNote.remove();
          var ok=$('.ok',mcontent);if(ok)ok.focus();
          bookingBusy=false;done();
        }).catch(function(error){
          bookingBusy=false;
          if(String(error&&error.message||'').indexOf('Horario no disponible')>=0){
            $('#slot-err').textContent='Ese horario acaba de ocuparse. Actualizamos la disponibilidad para que elijas otro.';
            loadBookingAvailability();
          }else{
            $('#slot-err').textContent='No pudimos guardar la cita. No se realizó ninguna reserva; intenta nuevamente.';
          }
          done();
        });
      }
    });
    if(preset)f2.setPreset(preset);
    loadBookingAvailability();
  }`;

  return html.slice(0, start) + replacement + html.slice(end + endMarker.length);
}
