const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navLinks');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }
menuButton.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
window.matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const tabs=[...document.querySelectorAll('[data-code-tab]')];
function selectTab(tab){tabs.forEach(button=>{const selected=button===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;document.getElementById(button.getAttribute('aria-controls')).hidden=!selected;});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next]);tabs[next].focus();}});});
const buildButton=document.querySelector('#runBuild');
const terminal=document.querySelector('#terminalOutput');
buildButton.title='Play a decorative console animation';
buildButton.addEventListener('click',async()=>{
  if(buildButton.disabled)return;
  buildButton.disabled=true;buildButton.textContent='Playing…';
  const stages=[['➜ softpixels  npm run something-great','Demo build: bringing the details together…'],['✓ Design system ready','✓ Responsive layouts composed'],['✓ Every detail, considered.','Demo complete. Let’s build the real thing.']];
  for(let index=0;index<stages.length;index++){
    if(index)await new Promise(resolve=>setTimeout(resolve,850));
    terminal.replaceChildren();stages[index].forEach((line,i)=>{const span=document.createElement('span');span.className=i===0?'syntax-green':'syntax-muted';span.textContent=line;terminal.append(span);if(i===0)terminal.append(document.createElement('br'));});
  }
  buildButton.disabled=false;buildButton.innerHTML='<span aria-hidden="true">▷</span> Run again';
});
const services={
  web:{title:'Web development',description:'Responsive websites and custom web applications that balance clear design with practical, maintainable development.',items:['Responsive websites across mobile, tablet, and desktop','Custom frontend experiences using HTML, CSS, and JavaScript','Web application interfaces and Firebase integration','Android application projects — tell us what you have in mind']},
  design:{title:'UI/UX design',description:'Interfaces designed around real people and what they need to accomplish. Clear journeys, thoughtful layouts, and a consistent visual language.',items:['User journeys and screen structure','Interface design and interactive prototypes','Responsive layouts and reusable design patterns','Iteration through feedback and usability review']},
  backend:{title:'Backend & databases',description:'A practical foundation for your application, with PHP and SQL development for structured data and dependable product workflows.',items:['PHP application logic','SQL database design and integration','Frontend and backend connections','Structured data management for your product']},
  marketing:{title:'Digital presence',description:'Digital strategies that help people discover your business and understand what you offer, with your website at the center.',items:['A clearer online presence','Audience and messaging direction','Digital marketing strategy','Website improvements that support your goals']}
};
const serviceDialog=document.querySelector('#serviceDialog');
serviceDialog.setAttribute('aria-labelledby','dialogTitle');serviceDialog.setAttribute('aria-describedby','dialogDescription');
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
 const service=services[button.dataset.service];document.querySelector('#dialogTitle').textContent=service.title;document.querySelector('#dialogDescription').textContent=service.description;const list=document.querySelector('#dialogList');list.replaceChildren();service.items.forEach(item=>{const li=document.createElement('li');li.textContent=item;list.append(li);});serviceDialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click',()=>serviceDialog.close());
document.querySelector('#dialogCta').addEventListener('click',()=>serviceDialog.close());
serviceDialog.addEventListener('click',event=>{if(event.target===serviceDialog){const rect=serviceDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)serviceDialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();

// Public browser credentials retained from the existing SoftPixels contact form.
const contactConfig = {"url": "https://xmdzabxgehgbduwszgvi.supabase.co", "publicKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZHphYnhnZWhnYmR1d3N6Z3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDU4NzgsImV4cCI6MjEwMTgyMTg3OH0.WrMaWGcscrkOSObHbBjSTm8vUBuMf-cWsJip_bBN9n4"};
const contactForm=document.querySelector('#contactForm');
const formStatus=document.querySelector('#formStatus');
const submitButton=document.querySelector('#submitBtn');
contactForm.addEventListener('submit',async event=>{
 event.preventDefault();if(submitButton.disabled)return;
 const name=contactForm.elements.name.value.trim();const email=contactForm.elements.email.value.trim();const message=contactForm.elements.message.value.trim();
 if(!name||!email||!message){formStatus.textContent='Please add your name, email, and a little about your project.';formStatus.className='form-status error';return;}
 const selected=[...contactForm.querySelectorAll('input[name="service"]:checked')].map(input=>input.value);
 submitButton.disabled=true;submitButton.textContent='Sending…';formStatus.textContent='';formStatus.className='form-status';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{
  const response=await fetch(contactConfig.url+'/rest/v1/submissions',{method:'POST',headers:{'Content-Type':'application/json','apikey':contactConfig.publicKey,'Authorization':'Bearer '+contactConfig.publicKey,'Prefer':'return=minimal'},body:JSON.stringify([{name,email,message:(selected.length?'Interested in: '+selected.join(', ')+'\n\n':'')+message}]),signal:controller.signal});
  if(!response.ok)throw new Error('Submission failed');
  formStatus.textContent='Thank you. Your idea is with the studio — we’ll reply by email within 24 hours.';contactForm.reset();
 }catch(error){formStatus.className='form-status error';formStatus.replaceChildren(document.createTextNode('Your message couldn’t be sent. Please try again, or '));const fallback=document.createElement('a');fallback.href='https://www.instagram.com/irl.sachin/';fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='message us on Instagram';formStatus.append(fallback,document.createTextNode(' or email '));const emailFallback=document.createElement('a');emailFallback.href='mailto:softpixels01@gmail.com';emailFallback.textContent='softpixels01@gmail.com';formStatus.append(emailFallback,document.createTextNode('. Your draft is still here.'));}
 finally{clearTimeout(timeout);submitButton.disabled=false;submitButton.innerHTML='Send your idea <span aria-hidden="true">↗</span>';}
});

// The homepage illustrations use the flow progress from Scroll Craft.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let scrollScene;
function syncScrollMotion() {
  if (motionPreference.matches) {
    scrollScene?.destroy();
    scrollScene = undefined;
  } else if (!scrollScene && window.ScrollCraft) {
    scrollScene = window.ScrollCraft.mount(document.getElementById('main'));
  }
}
syncScrollMotion();
motionPreference.addEventListener('change', syncScrollMotion);
