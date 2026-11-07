import flowCss from './scenes.css?raw';
import { flowScenes } from './scenes';

export const flowStyles = `<style id="system-flow-premium-scenes">${flowCss}</style>`;

// Replace only four h() producers in ST; preserve the original mounting, pool and go().
export function replaceFlowScenes(html: string): string {
  const start = html.indexOf('/* ===== 1. SISTEMAS CON IA: 8 estaciones en bucle ===== */');
  const end = html.indexOf('ST.forEach', start);
  if (start < 0 || end < 0) throw new Error('Missing v10 system flow definitions');
  let section = html.slice(start, end);
  for (const [label, scene] of Object.entries(flowScenes)) {
    const step = section.indexOf(`{l:'${label}'`);
    const producer = section.indexOf('h:function(){', step);
    const next = section.indexOf("\n      {l:", producer);
    const boundary = next < 0 ? section.indexOf('\n    ];', producer) : next;
    if (step < 0 || producer < 0 || boundary < 0) throw new Error(`Missing system flow scene: ${label}`);
    section = section.slice(0, producer) + `h:function(){return ${JSON.stringify(scene)};}}${next < 0 ? '' : ','}` + section.slice(boundary);
  }
  return html.slice(0, start) + section + html.slice(end);
}

// Delegated interaction only. Original v10 run() owns all timed demo animation.
export const flowInteractions = `<script id="system-flow-premium-interactions">
(function(){
 var panel=document.getElementById('sv-screen');if(!panel)return;
 var manualTimer=null;
 function manual(form){
   form.dataset.manual='true';clearTimeout(manualTimer);
   form.querySelectorAll('[data-at]').forEach(function(el){delete el.dataset.add;delete el.dataset.type;delete el.dataset.text;});
   form.querySelectorAll('[data-fd-day],[data-fd-time]').forEach(function(el){el.setAttribute('aria-pressed',el.classList.contains('s')?'true':'false');});
   var success=form.querySelector('.fd-success'),action=form.querySelector('.fd-action');
   if(success)success.classList.remove('on');if(action)action.classList.remove('submitted');
   var error=form.querySelector('.fd-error');if(error)error.hidden=true;
 }
 panel.addEventListener('click',function(e){
   var book=e.target.closest('[data-fd-book]');if(book){var tabs=document.querySelectorAll('#sv-rail .sv-stn');if(tabs[2])tabs[2].click();return;}
   var choice=e.target.closest('[data-fd-day],[data-fd-time]');if(!choice)return;
   var form=choice.closest('[data-fd-form]');if(!form)return;manual(form);
   var attr=choice.hasAttribute('data-fd-day')?'data-fd-day':'data-fd-time';
   form.querySelectorAll('['+attr+']').forEach(function(el){el.classList.toggle('s',el===choice);el.setAttribute('aria-pressed',el===choice?'true':'false');});
 });
 panel.addEventListener('focusin',function(e){
   if(!e.target.matches('.fd-input input'))return;var form=e.target.closest('[data-fd-form]');if(!form)return;manual(form);
   var wrap=e.target.parentElement,typed=wrap.querySelector('span');
   if(!wrap.classList.contains('edited')){e.target.value=typed?typed.textContent:'';wrap.classList.add('edited');}
 });
 panel.addEventListener('submit',function(e){
   if(!e.target.matches('[data-fd-form]'))return;e.preventDefault();var form=e.target;manual(form);
   var day=form.querySelector('[data-fd-day].s'),time=form.querySelector('[data-fd-time].s');
   var inputs=Array.from(form.querySelectorAll('.fd-input input'));var values=inputs.map(function(input){var wrap=input.parentElement;var typed=wrap.querySelector('span');return (wrap.classList.contains('edited')?input.value:(typed?typed.textContent:'')).trim();});
   var error=form.querySelector('.fd-error');
   if(!day||!time||!values[0]||!values[1]||values[1].replace(/[^0-9]/g,'').length<7){if(error){error.hidden=false;error.textContent='Selecciona día y hora, y completa tu nombre y WhatsApp.';}return;}
   var summary=form.querySelector('[data-fd-summary]');if(summary)summary.textContent=day.getAttribute('data-fd-day')+' · '+time.getAttribute('data-fd-time');
   var action=form.querySelector('.fd-action');if(action)action.classList.add('submitted');
   manualTimer=setTimeout(function(){if(!form.isConnected)return;var success=form.querySelector('.fd-success');if(success)success.classList.add('on');},800);
 });
})();
</script>`;