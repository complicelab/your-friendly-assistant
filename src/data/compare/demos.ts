import clinicPhoto from '@/assets/compare-dental-clinic.jpg';
import demosCss from './demos.css?raw';

export const compareStyles = `<style id="compare-dental-scenes">${demosCss}</style>`;
const browser = (path: string) => `<div class="cd-browser"><i></i><i></i><i></i><span>⌑ complicedental.com${path}</span></div>`;
const header = `<header class="cd-header"><div class="cd-brand"><span class="cd-mark">✳</span><div>Cómplice<small>DENTAL · ODONTOLOGÍA</small></div></div><nav class="cd-links"><span>Tratamientos</span><span>Clínica</span><span>Opiniones</span></nav><button type="button" class="p-btn2 cd-btn" data-cd-book>Agendar cita ↗</button></header>`;
const webScene = `<div class="cd-demo" data-cd-scene="web">${browser('')}${header}
<section class="cd-hero"><img src="${clinicPhoto}" alt="Clínica dental moderna" width="1024" height="768" loading="lazy"><div class="cd-hero-copy p-rv" data-at="100" data-add="on"><span class="cd-eyebrow">ODONTOLOGÍA CON CALMA Y PRECISIÓN</span><h4>Tu sonrisa merece<br>un cuidado especial.</h4><p>Tecnología, atención cercana y un equipo que te escucha.</p><button type="button" class="p-btn2 cd-btn" data-cd-book>Reserva tu valoración ↗</button></div></section>
<div class="cd-trust"><span>✓ Atención personalizada</span><span>✓ Tecnología digital</span><span>✓ Agenda en línea</span></div>
<section class="cd-treatments p-rv" data-at="550" data-add="on"><div class="cd-heading"><h5>Una sonrisa, muchas posibilidades</h5><span>Tratamientos ↗</span></div><div class="cd-services"><article class="cd-service"><i>✧</i><b>Estética dental</b><small>Una sonrisa más natural.</small></article><article class="cd-service"><i>⌁</i><b>Ortodoncia</b><small>Armonía y precisión.</small></article><article class="cd-service"><i>⊕</i><b>Implantes</b><small>Vuelve a sonreír con confianza.</small></article></div></section>
<section class="cd-reviews p-rv" data-at="1050" data-add="on"><div class="cd-rating"><b>4,9</b> <span class="cd-stars">★★★★★</span><br>120 reseñas verificadas</div><blockquote class="cd-quote">“Excelente atención y muy puntuales. Me sentí en buenas manos.”<cite>Paciente · valoración dental</cite></blockquote></section>
<footer class="cd-final p-rv" data-at="1500" data-add="on"><span>Tu próxima sonrisa empieza aquí.</span><button type="button" class="p-btn2 cd-btn" data-cd-book>Agendar ahora ↗</button></footer></div>`;
const agendaScene = `<div class="cd-demo" data-cd-scene="agenda">${browser('/agendar')}${header}
<div class="cd-agenda-title"><small>INICIO / AGENDAR CITA</small><h4>Un espacio para tu sonrisa.</h4><p>Reserva tu valoración dental, sin llamadas ni esperas.</p></div>
<form class="cd-booking" data-cd-form><div class="cd-booking-top">Valoración dental <span>◷ 30 min · En la clínica</span></div><div class="cd-selectors"><div><span class="cd-label">1. Elige tu fecha</span><div class="cd-month"><span>Noviembre</span><span>‹ &nbsp; ›</span></div><div class="cd-days"><button type="button" class="cd-choice" data-cd-day="Lunes 9"><small>LUN</small>9</button><button type="button" class="cd-choice" data-cd-day="Martes 10"><small>MAR</small>10</button><button type="button" class="cd-choice" data-cd-day="Miércoles 11" data-at="700" data-add="s" aria-pressed="true"><small>MIÉ</small>11</button><button type="button" class="cd-choice" data-cd-day="Jueves 12"><small>JUE</small>12</button></div></div><div><span class="cd-label">2. Elige tu horario</span><div class="cd-times"><button type="button" class="cd-choice" data-cd-time="9:00 a. m.">9:00 a. m.</button><button type="button" class="cd-choice" data-cd-time="10:00 a. m." data-at="1300" data-add="s" aria-pressed="true">10:00 a. m.</button><button type="button" class="cd-choice" data-cd-time="11:00 a. m.">11:00 a. m.</button></div></div></div>
<div class="cd-fields"><label data-at="1700" data-add="f"><span class="cd-label">Nombre</span><input name="name" aria-label="Nombre" value="Marta Gómez" required autocomplete="off"></label><label data-at="2800" data-add="f"><span class="cd-label">WhatsApp</span><input name="whatsapp" aria-label="WhatsApp" type="tel" value="+57 300 000 0000" required autocomplete="off"></label></div>
<button type="submit" class="p-btn2 cd-btn cd-confirm" data-at="4200" data-add="press">Confirmar cita &nbsp; →</button><div class="cd-success p-rv" role="status" data-at="4600" data-add="on"><i>✓</i><div><strong>Cita agendada</strong><span data-cd-summary>Miércoles 11 · 10:00 a. m.</span></div></div><p class="cd-booking-note">✓ Confirmación por WhatsApp · Agenda disponible 24 h</p></form></div>`;

// Replace the scene producers before v10 boots. Its existing go()/run() own mounting and animation.
export function replaceCompareScenes(html: string): string {
  const marker = '/* ---------- los 7 pasos ---------- */';
  const start = html.indexOf(marker);
  const end = html.indexOf('/* ---------- navegación ---------- */', start);
  if (start < 0 || end < 0) throw new Error('Missing v10 comparison scene definitions');
  let section = html.slice(start, end);
  for (const [label, scene] of [['Tu página', webScene], ['Agenda web', agendaScene]]) {
    const step = section.indexOf(`{l:'${label}'`);
    const producer = section.indexOf('con:function(){', step);
    const result = section.indexOf('\n   sr:', producer);
    if (step < 0 || producer < 0 || result < 0) throw new Error(`Missing comparison scene: ${label}`);
    section = section.slice(0, producer) + `con:function(){return ${JSON.stringify(scene)};},` + section.slice(result);
  }
  return html.slice(0, start) + section + html.slice(end);
}

// Interaction only: no DOM replacement, text discovery, observer, or second mounting implementation.
export const compareInteractions = `<script id="compare-dental-interactions">
(function(){
 var panel=document.getElementById('pb-con');
 if(!panel)return;
 panel.addEventListener('click',function(e){
  var book=e.target.closest('[data-cd-book]');
  if(book){var tabs=document.querySelectorAll('#pb-steps .p-st');if(tabs[2])tabs[2].click();return;}
  var choice=e.target.closest('[data-cd-day],[data-cd-time]');if(!choice)return;
  var attr=choice.hasAttribute('data-cd-day')?'data-cd-day':'data-cd-time';
  panel.querySelectorAll('['+attr+']').forEach(function(el){el.classList.toggle('s',el===choice);el.setAttribute('aria-pressed',el===choice?'true':'false');el.removeAttribute('data-add');});
  var success=panel.querySelector('.cd-success');if(success)success.classList.remove('on');
 });
 panel.addEventListener('submit',function(e){
  if(!e.target.matches('[data-cd-form]'))return;e.preventDefault();
  var day=panel.querySelector('[data-cd-day].s'),time=panel.querySelector('[data-cd-time].s');
  var summary=panel.querySelector('[data-cd-summary]'),success=panel.querySelector('.cd-success');
  if(summary)summary.textContent=(day?day.getAttribute('data-cd-day'):'Miércoles 11')+' · '+(time?time.getAttribute('data-cd-time'):'10:00 a. m.');
  if(success)success.classList.add('on');
 });
})();
</script>`;
