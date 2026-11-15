'use strict';
/* V528 universal wellness layer: local-only, compatible with V525 encrypted vault.
   Non-clinical planning, descriptive logs, no third-party calls. */
(function(){
const priorRender=render;
const esc=escapeHTML;
const sections={
  'fat loss':{focus:'Sustainable meal structure and moderate activity',food:'Build balanced meals with vegetables, protein, whole grains and regular eating.',activity:'Combine progressive strength training and enjoyable aerobic activity.'},
  'weight gain':{focus:'Consistent meals and strength training',food:'Consider regular meals and snacks with nutrient-dense foods.',activity:'Build strength gradually and allow recovery.'},
  'muscle gain':{focus:'Gradual strength progression and adequate nourishment',food:'Include protein-rich foods across meals alongside sufficient energy.',activity:'Log exercises, sets, reps and progressive overload.'},
  'maintenance':{focus:'Maintain sustainable habits',food:'Choose varied foods and regular portions that suit your appetite and schedule.',activity:'Keep a comfortable mix of aerobic, strength and recovery days.'},
  'fitness':{focus:'Improve movement consistency and recovery',food:'Support activity with varied meals and adequate hydration.',activity:'Mix aerobic, mobility and resistance training with rest days.'}
};
const section=(title,body)=>'<section class="card section-space"><h2>'+title+'</h2>'+body+'</section>';
function universalProfile(){
const p=vault.profile, u=p.universal||{}, focus=sections[p.goal]||sections.maintenance;
return section('Universal Healthy Living Profile',
 '<p class="tiny">Your personal preferences are kept inside the existing encrypted local vault. This is a wellness journal, not a medical assessment. Use sample data until the application is audited.</p>'+
 '<form id="universal-form" class="stack"><div class="form-grid">'+
 '<div class="field"><label for="universal-routine">Preferred activity schedule</label><select id="universal-routine">'+
 ['Flexible','Morning','Afternoon','Evening'].map(x=>'<option '+(u.routine===x?'selected':'')+'>'+x+'</option>').join('')+
 '</select></div><div class="field"><label for="universal-diet">Eating preference</label><select id="universal-diet">'+
 ['Mixed','Vegetarian','Vegan','Pescatarian'].map(x=>'<option '+(u.diet===x?'selected':'')+'>'+x+'</option>').join('')+
 '</select></div><div class="field"><label for="universal-days">Planned activity days/week (0–7)</label><input id="universal-days" type="number" min="0" max="7" value="'+esc(u.days??3)+'"></div>'+
 '<div class="field"><label for="universal-session">Preferred session duration (minutes)</label><input id="universal-session" type="number" min="10" max="180" value="'+esc(u.duration??30)+'"></div></div>'+
 '<div class="field"><label for="universal-note">Personal priorities (optional)</label><textarea id="universal-note" maxlength="250" placeholder="E.g. walking after work, stretching, cooking at home">'+esc(u.note||'')+'</textarea></div>'+
 '<button type="submit" class="btn">Save universal profile securely</button></form>'+
 '<hr class="divider"><h3>Goal focus: '+esc(p.goal)+'</h3><p>'+esc(focus.focus)+'</p>');
}
function foodPlan(){
const p=vault.profile, u=p.universal||{}, goal=sections[p.goal]||sections.maintenance;
const foods=todays('foods'), protein=sum(foods,'protein'), kcal=sum(foods,'calories');
return section('Daily Food Planning & Nutrition Review',
 '<p class="tiny">Suggestions are general, not a personalised meal prescription. Images are not used to calculate verified nutrient amounts.</p>'+
 '<div class="grid cols3"><div><p class="tiny">Meals recorded</p><div class="metric">'+foods.length+'</div></div><div><p class="tiny">Energy recorded</p><div class="metric">'+Math.round(kcal)+' <small>kcal</small></div></div><div><p class="tiny">Protein recorded</p><div class="metric">'+Math.round(protein)+' <small>g</small></div></div></div>'+
 '<p><strong>Goal:</strong> '+esc(p.goal)+' · <strong>Eating preference:</strong> '+esc(u.diet||'Mixed')+'</p><p>'+esc(goal.food)+'</p>'+
 '<p class="tiny">Unlogged meals are unknown, not zero intake. Check food labels or reliable nutritional databases for quantities.</p>');
}
function gymPlan(){
const p=vault.profile,u=p.universal||{},goal=sections[p.goal]||sections.maintenance;
const a=todays('activities'),todayMins=sum(a,'minutes');
const d=Number.isFinite(+u.days)?Number(u.days):3;
const minutes=Number.isFinite(+u.duration)?Number(u.duration):30;
return section('Personal Gym & Activity Planner',
 '<p class="tiny">Your planned days and sessions are preferences, not a medical exercise prescription. Adapt to experience, fatigue, symptoms and professional advice.</p>'+
 '<div class="grid cols3"><div><p class="tiny">Today’s logged activity</p><div class="metric">'+Math.round(todayMins)+' <small>min</small></div></div><div><p class="tiny">Preferred days/week</p><div class="metric">'+esc(d)+'</div></div><div><p class="tiny">Preferred session length</p><div class="metric">'+esc(minutes)+' <small>min</small></div></div></div>'+
 '<p><strong>Planning focus:</strong> '+esc(goal.activity)+'</p>'+
 '<p><strong>Scheduling preference:</strong> '+esc(u.routine||'Flexible')+'</p>'+
 '<p class="tiny">Record actual time and exercises in the activity journal above. A planned session is not counted as completed exercise.</p>');
}
function unifiedReport(){
const p=vault.profile,u=p.universal||{},f=todays('foods'),a=todays('activities'),water=todays('water'),mood=todays('checkins');
const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')});
const sessions=new Set(vault.activities.filter(x=>days.includes(x.day)).map(x=>x.day)).size;
const entries=[f.length?'You logged '+f.length+' food entr'+(f.length===1?'y':'ies')+'.':'No food entries were recorded today.',
 a.length?'You logged '+a.length+' activity entr'+(a.length===1?'y':'ies')+' totalling '+Math.round(sum(a,'minutes'))+' minutes.':'No exercise entries were recorded today.',
 'Water recorded today: '+Math.round(sum(water,'ml'))+' mL.',
 'Activity recorded on '+sessions+' of the last seven days'+(u.days!==undefined?' (preferred '+u.days+' days/week).':'.'),
 mood.length?'Most recent reflection: '+String(mood[mood.length-1].mood||'recorded')+'.':'No daily reflection recorded today.'];
return section('Universal Daily Wellness Summary',
 '<p class="tiny">Built only from records you entered. No medical interpretation, predicted metabolism, or claims about unlogged behaviour.</p>'+
 '<p><strong>Current focus:</strong> '+esc(p.goal||'maintenance')+'</p>'+
 '<ul>'+entries.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>'+
 '<p><strong>Suggested next step:</strong> '+esc((sections[p.goal]||sections.maintenance).focus)+'.</p>'+
 '<p class="tiny">This report is descriptive, not an AI-generated diagnosis. No reminder is automatically sent by email, SMS or WhatsApp.</p>');
}
function enhance(){
if(!vault)return;
const main=document.querySelector('#screen');if(!main)return;
if(current==='settings')main.insertAdjacentHTML('beforeend',universalProfile());
if(current==='food')main.insertAdjacentHTML('beforeend',foodPlan());
if(current==='activity')main.insertAdjacentHTML('beforeend',gymPlan());
if(current==='reports')main.insertAdjacentHTML('beforeend',unifiedReport());
}
render=function(){priorRender();enhance()};
document.addEventListener('submit',async function(e){
if(e.target.id!=='universal-form')return;
e.preventDefault();e.stopImmediatePropagation();
try{
 const days=Number(document.querySelector('#universal-days').value), duration=Number(document.querySelector('#universal-session').value);
 if(!Number.isInteger(days)||days<0||days>7||!Number.isInteger(duration)||duration<10||duration>180)throw Error('Enter valid activity days and session duration.');
 const form=e.target,universal={routine:form.querySelector('#universal-routine').value,diet:form.querySelector('#universal-diet').value,days,duration,note:form.querySelector('#universal-note').value.trim()};
 vault.profile={...vault.profile,universal};await save();render();toast('Universal profile encrypted and saved.');
}catch(err){toast(err.message||'Profile could not be saved.')}
},true);
window.addEventListener('DOMContentLoaded',enhance,{once:true});
})();