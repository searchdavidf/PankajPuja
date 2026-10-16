'use strict';
const $=id=>document.getElementById(id);
const storage={get(key,fallback){try{return localStorage.getItem(key)??fallback}catch{return fallback}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
let songs=[],language=storage.get('bhajan-language','hi'),fontSize=Number(storage.get('bhajan-size','24')),current=null,inviteTimer,returnFocus;
if(!['hi','roman'].includes(language))language='hi';
fontSize=Math.max(18,Math.min(36,fontSize||24));
document.documentElement.style.setProperty('--text-size',fontSize+'px');
const cleanTitle=s=>s.replace(/[।॥]/g,'').trim();
function updateLanguage(){
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
 $('index-label').textContent=language==='hi'?'सभी भजन':'All bhajans';
 $('previous-label').textContent=language==='hi'?'पिछला भजन':'Previous';
 $('next-label').textContent=language==='hi'?'अगला भजन':'Next';
 renderList();if(current!==null)renderSong(false);
}
function renderList(){
 const q=$('search').value.trim().toLowerCase();
 const filtered=songs.filter(s=>[s.titleHi,s.titleRoman,s.hi,s.roman,String(s.id),String(s.id).padStart(2,'0')].some(v=>v.toLowerCase().includes(q)));
 $('song-list').replaceChildren(...filtered.map(s=>{
  const a=document.createElement('a');a.href='#song/'+s.id;a.className='song-card';
  const n=document.createElement('span');n.className='number';n.textContent=String(s.id).padStart(2,'0');
  const body=document.createElement('div'),h=document.createElement('h3'),small=document.createElement('small'),arrow=document.createElement('span');
  h.textContent=cleanTitle(language==='hi'?s.titleHi:s.titleRoman);h.lang=language==='hi'?'hi':'en';
  small.textContent=language==='hi'?cleanTitle(s.titleRoman):cleanTitle(s.titleHi);small.lang=language==='hi'?'en':'hi';
  body.append(h,small);arrow.className='arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');a.append(n,body,arrow);return a;
 }));$('empty').hidden=filtered.length!==0;
}
function renderSong(reset=true){
 const s=songs[current];if(!s)return;
 $('song-title').textContent=language==='hi'?s.titleHi:s.titleRoman;
 $('song-title').lang=language==='hi'?'hi':'en';
 $('song-number').textContent='BHAJAN '+String(s.id).padStart(2,'0')+' / 08';
 $('instagram').href=s.instagram;
 const lyrics=$('lyrics');lyrics.lang=language==='hi'?'hi':'en';
 // Split only on blank lines: punctuation and all within-stanza whitespace remain intact.
 lyrics.replaceChildren(...s[language].split('\n\n').map(stanza=>{const p=document.createElement('p');p.textContent=stanza;return p}));
 $('position').textContent=String(s.id).padStart(2,'0')+' / 08';
 $('previous').disabled=current===0;$('next').disabled=current===songs.length-1;
 document.title=cleanTitle(language==='hi'?s.titleHi:s.titleRoman)+' · जय माता दी';
 if(reset){window.scrollTo(0,0);$('song-title').tabIndex=-1;$('song-title').focus({preventScroll:true})}
}
function route(){
 const match=location.hash.match(/^#song\/(\d+)$/),id=match?Number(match[1]):null;
 current=id?songs.findIndex(s=>s.id===id):null;
 if(current===-1){current=null;history.replaceState(null,'',location.pathname+location.search);$('status').textContent='Song not found. Please choose a bhajan.'}
 $('index-view').hidden=current!==null;$('reader-view').hidden=current===null;
 if(current!==null)renderSong();else{document.title='जय माता दी · Bhajan Sangrah';renderList();window.scrollTo(0,0)}
}
function navigate(delta){if(current===null)return;const s=songs[current+delta];if(s)location.hash='song/'+s.id}
function closeInvitation(){clearTimeout(inviteTimer);$('invitation').hidden=true;document.body.classList.remove('modal-open');$('app').inert=false;if(returnFocus?.isConnected)returnFocus.focus();}
function showInvitation(auto){
 returnFocus=document.activeElement;$('invitation').hidden=false;document.body.classList.add('modal-open');$('app').inert=true;
 $('pause-invite').textContent=auto?'Keep reading':'Invitation';$('pause-invite').hidden=!auto;
 const bar=$('timer-bar');bar.classList.remove('running');bar.parentElement.hidden=!auto;
 $('enter').focus();
 if(auto){const start=()=>{if($('invitation').hidden)return;bar.classList.add('running');inviteTimer=setTimeout(closeInvitation,4000)};
 const img=$('invite-image');if(img.complete)start();else img.addEventListener('load',start,{once:true});}
}
$('pause-invite').addEventListener('click',()=>{clearTimeout(inviteTimer);$('timer-bar').style.animationPlayState='paused';$('pause-invite').textContent='Take your time';});
$('enter').addEventListener('click',closeInvitation);
$('show-invitation').addEventListener('click',()=>showInvitation(false));
$('invitation').addEventListener('keydown',e=>{if(e.key==='Escape')closeInvitation();if(e.key==='Tab'){const buttons=[...$('invitation').querySelectorAll('button')].filter(b=>!b.hidden);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{language=b.dataset.language;storage.set('bhajan-language',language);updateLanguage()}));
$('search').addEventListener('input',renderList);
$('previous').addEventListener('click',()=>navigate(-1));$('next').addEventListener('click',()=>navigate(1));
for(const [id,delta]of [['smaller',-2],['larger',2]])$(id).addEventListener('click',()=>{fontSize=Math.max(18,Math.min(36,fontSize+delta));document.documentElement.style.setProperty('--text-size',fontSize+'px');storage.set('bhajan-size',String(fontSize));$('smaller').disabled=fontSize===18;$('larger').disabled=fontSize===36;});
let touch=null;
$('lyrics').addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null},{passive:true});
$('lyrics').addEventListener('touchcancel',()=>touch=null,{passive:true});
$('lyrics').addEventListener('touchend',e=>{if(!touch||e.touches.length||!e.changedTouches.length){touch=null;return}const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.8&&!window.getSelection()?.toString())navigate(dx>0?1:-1)},{passive:true});
window.addEventListener('hashchange',route);
document.addEventListener('keydown',e=>{if(current===null||!$('invitation').hidden||/INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();navigate(1)}if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1)}});
async function init(){try{const res=await fetch('songs.json');if(!res.ok)throw Error('content');songs=await res.json();updateLanguage();route();let seen=false;try{seen=sessionStorage.getItem('invitation-seen')==='yes';sessionStorage.setItem('invitation-seen','yes')}catch{}if(!seen&&!location.hash)showInvitation(true);if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch{$('status').textContent='The bhajans could not load. Please check your connection and refresh.';}}
init();
