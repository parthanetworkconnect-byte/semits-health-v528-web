'use strict';
/* SEMITS V527 experimental intelligence layer.
 * No third-party scripts, remote model APIs, telemetry, or photo uploads.
 * It works on top of V525 encrypted-vault code without altering its data format.
 */
(function(){
const parentRender=render;
const fmt=n=>Number.isFinite(n)?Math.round(n).toLocaleString():'—';
const h=x=>escapeHTML(x);
const ensureMetrics=()=>vault?.profile?.metabolic||{};
function calc(){
  const m=ensureMetrics(),w=Number(m.weight),cm=Number(m.height),age=Number(m.age),activity=Number(m.activity);
  if(!m.sex||!(w>=25&&w<=350)||!(cm>=100&&cm<=240)||!(age>=18&&age<=100)||!([1.2,1.375,1.55,1.725,1.9].includes(activity)))return null;
  const bmr=10*w+6.25*cm-5*age+(m.sex==='male'?5:-161);
  const maintenance=bmr*activity, goal=vault.profile.goal||'maintenance';
  const delta=goal==='fat loss'?-300:goal==='weight gain'?300:goal==='muscle gain'?200:0;
  return {bmr,maintenance,illustrative:maintenance+delta,goal,w,age,cm};
}
function section(t){return '<section class="card section-space"><h2>'+t+'</h2>'}
function metabolism(){
 const m=ensureMetrics(),c=calc();
 const options=(arr,selected)=>arr.map(([v,n])=>'<option value="'+h(v)+'" '+(String(v)===String(selected)?'selected':'')+'>'+h(n)+'</option>').join('');
 const form=section('Personalised metabolism — formula-based estimate')+
 '<p class="tiny">For adults only. Uses the Mifflin–St Jeor predictive equation and an activity multiplier; estimates are not a measurement of your individual metabolism or a clinical prescription. Values are stored encrypted in your V525 local vault.</p>'+
 '<form id="metabolic-form" class="stack"><div class="form-grid">'+
 '<div class="field"><label for="meta-age">Age (years)</label><input id="meta-age" type="number" min="18" max="100" required value="'+h(m.age||'')+'"></div>'+
 '<div class="field"><label for="meta-sex">Sex used for equation</label><select id="meta-sex">'+options([['','Choose'],['female','Female equation'],['male','Male equation']],m.sex)+'</select></div>'+
 '<div class="field"><label for="meta-weight">Weight (kg)</label><input id="meta-weight" type="number" step=".1" min="25" max="350" required value="'+h(m.weight||'')+'"></div>'+
 '<div class="field"><label for="meta-height">Height (cm)</label><input id="meta-height" type="number" step=".1" min="100" max="240" required value="'+h(m.height||'')+'"></div>'+
 '<div class="field span2"><label for="meta-activity">Usual activity level (do not double-count workouts)</label><select id="meta-activity">'+options([['1.2','Mostly sedentary (1.2)'],['1.375','Light activity (1.375)'],['1.55','Moderate activity (1.55)'],['1.725','Very active (1.725)'],['1.9','Extremely active (1.9)']],m.activity||1.375)+'</select></div></div>'+
 '<button class="btn" type="submit">Calculate and save encrypted profile</button></form></section>';
 const result=c?section('Your estimated daily energy')+
 '<div class="grid cols3"><div><p class="tiny">Resting energy (BMR)</p><div class="metric">'+fmt(c.bmr)+' <small>kcal/day</small></div></div><div><p class="tiny">Estimated maintenance</p><div class="metric">'+fmt(c.maintenance)+' <small>kcal/day</small></div></div><div><p class="tiny">Illustrative '+h(c.goal)+' goal</p><div class="metric">'+fmt(c.illustrative)+' <small>kcal/day</small></div></div></div>'+
 '<p class="tiny">This is a starting estimate, not an exact metabolism, measured expenditure, or personalised treatment plan. Energy needs vary with medical history, body composition and actual weight trends. Pregnancy, breastfeeding, growth, illness and eating-disorder history require individual professional guidance.</p></section>':'';
 return form+result;
}
function foodAssist(){
 return section('On-device AI photo recognition — experimental')+
 '<p class="tiny">Choose a photo above, then try image recognition. Recognition runs only when a compatible built-in on-device browser model is available. No photo is sent to a server. Model output can be wrong and cannot reliably determine portions, ingredients, allergens or calories.</p>'+
 '<button class="btn secondary" type="button" id="recognise-local-food">Try local AI recognition</button>'+
 '<div id="food-recognition-result" class="tiny" role="status" aria-live="polite">Not analysed. If your browser does not support local image AI, continue using the manual food form.</div></section>';
}
function dailyInsight(){
 const c=calc(),foods=todays('foods'),activities=todays('activities');
 const kcal=sum(foods,'calories'),protein=sum(foods,'protein'),min=sum(activities,'minutes');
 const incomplete=!foods.length;
 return section('Personal progress from your recorded data')+
 '<div class="grid cols3"><div><p class="tiny">Logged energy today</p><div class="metric">'+fmt(kcal)+' <small>kcal</small></div></div><div><p class="tiny">Logged protein</p><div class="metric">'+fmt(protein)+' <small>g</small></div></div><div><p class="tiny">Logged activity</p><div class="metric">'+fmt(min)+' <small>min</small></div></div></div>'+
 '<p class="tiny">'+(incomplete?'No meals recorded today. Missing entries are not evidence of low food intake.':c?'Compared with your illustrative maintenance estimate of '+fmt(c.maintenance)+' kcal/day, the journal contains '+fmt(kcal)+' kcal so far. This is not an estimated calorie deficit: meals may be incomplete and exercise should not be subtracted again.':'Enter your age, height, weight and equation parameters in Settings for an illustrative maintenance estimate.')+'</p></section>';
}
function videoPanel(){
 return section('30-second motivational wellness animation')+
 '<p class="tiny">Generates a local animated summary from today’s entries, with positive reminders. It is not a synthetic video of your face, not a prediction of future body appearance, and not an AI-generated personal trainer. No external service is contacted.</p>'+
 '<canvas id="motivation-canvas" width="720" height="405" aria-label="Personal wellness progress animation" style="display:block;width:100%;max-width:720px;aspect-ratio:16/9;border-radius:14px;background:#1f382e"></canvas>'+
 '<div class="row section-space"><button id="play-motivation" type="button" class="btn">Play 30-second animation</button><button id="save-motivation" type="button" class="btn secondary">Save WebM (if supported)</button></div>'+
 '<p class="tiny" id="video-status" role="status">Ready. Video export works only in browsers with MediaRecorder and canvas capture support. Safari may not support WebM export.</p></section>';
}
function enhance(){
 if(!vault)return;
 const main=$('#screen');if(!main)return;
 if(current==='settings')main.insertAdjacentHTML('beforeend',metabolism());
 if(current==='food')main.insertAdjacentHTML('beforeend',foodAssist());
 if(current==='reports') {main.insertAdjacentHTML('beforeend',dailyInsight()+videoPanel());drawFrame(0)}
}
render=function(){parentRender();enhance()};
document.addEventListener('submit',async function(e){
 if(e.target.id!=='metabolic-form')return;
 e.preventDefault();e.stopImmediatePropagation();
 try{
 const m={age:Number($('#meta-age').value),sex:$('#meta-sex').value,weight:Number($('#meta-weight').value),height:Number($('#meta-height').value),activity:Number($('#meta-activity').value)};
 if(!['male','female'].includes(m.sex)||m.age<18||m.age>100||m.weight<25||m.weight>350||m.height<100||m.height>240||![1.2,1.375,1.55,1.725,1.9].includes(m.activity))throw Error('Enter valid adult measurements and equation settings.');
 vault.profile.metabolic=m;await save();render();toast('Estimate saved in your encrypted vault');
 }catch(err){toast(err.message||'Could not save metabolism estimate')}
},true);
async function recognise(){
 const out=$('#food-recognition-result'),img=$('#food-photo-preview img');
 if(!out)return;
 if(!img||!foodPhotoUrl){out.textContent='Choose a food image first.';return}
 if(typeof LanguageModel==='undefined'||typeof LanguageModel.create!=='function'){
 out.textContent='On-device image AI is not available in this browser. No prediction was made. Enter the food details manually.';return;
 }
 out.textContent='Attempting local browser image recognition…';
 let session,bitmap;
 try{
 bitmap=await createImageBitmap(img);
 session=await LanguageModel.create({expectedInputs:[{type:'image'}]});
 const result=await session.prompt([{role:'user',content:[{type:'text',text:'Identify visible food items only. Do not guess calories, weight, ingredients, allergens, medical effects or portion size. Return a short uncertain descriptive list.'},{type:'image',value:bitmap}]}]);
 out.textContent='Experimental model suggestion (verify manually): '+String(result).slice(0,450);
 }catch(err){out.textContent='Local image model unavailable or not compatible. No identification was made. Enter food manually.'}
 finally{bitmap?.close?.();session?.destroy?.()}
}
let animation=null,recorder=null;
function drawFrame(seconds){
 const canvas=$('#motivation-canvas');if(!canvas||!vault)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=canvas.width,h=canvas.height,c=calc(),food=todays('foods'),act=todays('activities');
 const activity=sum(act,'minutes'),cal=sum(food,'calories'),phase=Math.min(2,Math.floor(seconds/10));
 const cards=[
 {head:'YOUR DAY, YOUR PROGRESS',big:food.length+' meals logged',sub:'Consistency matters more than perfection'},
 {head:'KEEP MOVING',big:activity+' active minutes',sub:'Celebrate the effort you recorded today'},
 {head:'FUEL AND RECOVER',big:cal+' kcal recorded',sub:'Keep building sustainable habits'}
 ];
 const x=cards[phase],t=seconds%10;
 const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#18382d');g.addColorStop(1,'#466e56');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(100+i*100,70+Math.sin(seconds/3+i)*32,30+i*3,0,Math.PI*2);ctx.fill()}
 ctx.textAlign='center';ctx.fillStyle='#cfdfd0';ctx.font='bold 22px system-ui';ctx.fillText('SEMITS  ·  HEALTH',w/2,66);
 ctx.fillStyle='#e7f3e8';ctx.font='bold 28px system-ui';ctx.fillText(x.head,w/2,155);
 ctx.font='bold 47px system-ui';ctx.fillText(x.big,w/2,224);
 ctx.font='20px system-ui';ctx.fillText(x.sub,w/2,276);
 ctx.fillStyle='#b7cbb8';ctx.font='16px system-ui';ctx.fillText(c?'Goal: '+c.goal+'  ·  logged values only':'Based on today’s recorded entries',w/2,316);
 ctx.fillStyle='#a7c0ab';ctx.fillRect(95,356,530,6);ctx.fillStyle='#fff';ctx.fillRect(95,356,530*Math.min(seconds/30,1),6);
 ctx.font='13px system-ui';ctx.fillText('Personal summary · Not medical guidance',w/2,390);
}
function play(record=false){
 const canvas=$('#motivation-canvas'),status=$('#video-status');if(!canvas||!vault)return;
 if(animation){cancelAnimationFrame(animation);animation=null}if(recorder&&recorder.state!=='inactive'){recorder.stop();recorder=null}
 if(record&&(!canvas.captureStream||!window.MediaRecorder)){status.textContent='Video export is not supported in this browser. You can still play the animation.';return}
 let chunks=[],started=performance.now();
 if(record){
 try{const stream=canvas.captureStream(15);recorder=new MediaRecorder(stream,{mimeType:MediaRecorder.isTypeSupported('video/webm')?'video/webm':undefined});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(chunks.length)download('SEMITS_Health_Motivation.webm',new Blob(chunks,{type:recorder.mimeType||'video/webm'}),'video/webm')};recorder.start()}catch(err){status.textContent='Video export is unsupported; no file created.';return}
 }
 status.textContent='Playing local 30-second animation'+(record?' and recording…':'…');
 function tick(now){const sec=Math.min(30,(now-started)/1000);drawFrame(sec);if(sec<30&&vault&&current==='reports'){animation=requestAnimationFrame(tick)}else{animation=null;if(recorder?.state==='recording')recorder.stop();status.textContent='Animation complete.'}}
 animation=requestAnimationFrame(tick);
}
document.addEventListener('click',e=>{
 if(e.target.closest('#recognise-local-food')){recognise();return}
 if(e.target.closest('#play-motivation')){play(false);return}
 if(e.target.closest('#save-motivation')){play(true)}
});
window.addEventListener('pagehide',()=>{if(animation)cancelAnimationFrame(animation)});
window.addEventListener('DOMContentLoaded',enhance,{once:true});
})();