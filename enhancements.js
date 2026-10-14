/* Wedding invite additions: family greetings, countdown, RSVP and responsive floral page styling. */
(() => {
  const $ = id => document.getElementById(id);
  if (!$('cover') || $('familySection')) return;

  const pageCss = document.createElement('style');
  pageCss.textContent = `
    .extra-section{isolation:isolate;position:relative;display:flex;align-items:flex-start;justify-content:center;min-height:100svh;height:auto;overflow:visible;padding:clamp(22px,5vw,44px) 16px;text-align:center;color:#203f33;background:linear-gradient(#fff9e9ed,#fff3dcf2),url('floral-frame.svg') center/100% 100% no-repeat}
    .extra-section:before{content:"";position:absolute;inset:7px;border:1px solid #c49a54;background:url('floral-frame.svg') center/100% 100% no-repeat;pointer-events:none;z-index:-1}
    .extra-section.dark{color:#fff5df;background:linear-gradient(#174a39f2,#092b23f5),url('floral-frame.svg') center/100% 100% no-repeat}
    .extra-card{position:relative;z-index:1;width:min(100%,720px);padding:clamp(22px,5vw,44px);border:1px solid #c49a54;background:#fff9e9ed;box-shadow:0 8px 26px #39210e14}
    .extra-section.dark .extra-card{background:rgba(9,43,35,.92)}
    .extra-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,6vw,3.4rem);font-weight:800;line-height:1.15;color:#174a39;margin:10px 0 18px}
    .extra-section.dark .extra-title{color:#f0cf80}
    .family-grid,.count-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:22px 0}
    .family-item,.count-item{min-width:0;overflow-wrap:anywhere;border:1px solid #d9c18e;padding:16px;background:#fffaf0;color:#24473a}
    .family-item h3{font-weight:800;font-size:1.25rem;line-height:1.25;margin:0 0 8px;color:#174a39}
    .family-item p,.extra-card p,.extra-card label{font-size:1.08rem;line-height:1.6;font-weight:600}
    .count-item strong{display:block;font-size:clamp(2rem,7vw,3.4rem);font-weight:800;color:#92521f}
    .count-item span{font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
    .rsvp-form{display:grid;gap:12px;text-align:left;margin-top:20px}
    .rsvp-form label{display:grid;gap:5px}
    .rsvp-form input,.rsvp-form select{width:100%;min-height:46px;padding:12px;border:1px solid #d5b77c;background:#fffaf0;font:600 16px Georgia;color:#24473a}
    .rsvp-status{min-height:1.4em}
    .invite-rsvp-link{display:inline-flex;align-items:center;justify-content:center;margin:14px auto;padding:12px 18px;min-height:46px;border:1px solid #c49a54;border-radius:999px;background:#123d31;color:#fff5df;font-weight:800;text-decoration:none;line-height:1.35;max-width:100%;white-space:normal}
    .extra-card .pill,.extra-card button{font-weight:800;line-height:1.35}
    @media(max-width:600px){.extra-section{padding:20px 12px}.extra-card{padding:22px 15px}.family-grid{grid-template-columns:1fr}.count-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.family-item{padding:14px}.extra-card p,.extra-card label,.family-item p{font-size:1.02rem}.invite-rsvp-link{width:100%}}
  `;
  document.head.appendChild(pageCss);
  pageCss.textContent += `
    .floral-garland{font-size:clamp(1.25rem,3.5vw,2rem);letter-spacing:.14em;margin:-4px 0 14px;filter:drop-shadow(0 2px 2px #9b734133)}
    .family-card{background-image:linear-gradient(rgba(255,249,233,.68),rgba(255,243,220,.74)),url('floral-frame.svg')!important;background-position:center!important;background-size:cover!important;border:2px solid #c49a54!important}
    .family-item{position:relative;background:rgba(255,251,241,.92)!important;padding:18px 15px!important;box-shadow:0 3px 16px #7d553215}
    .family-icon{font-size:2.2rem;line-height:1.2;margin-bottom:8px}
    .family-item p{white-space:pre-line}
    .bride-family{border-top:4px solid #d99b9d}
    .groom-family{border-top:4px solid #4c8369}
`;

  const family=document.createElement('section');
  family.id='familySection';family.className='extra-section hidden';
  family.innerHTML=`<div class="extra-card reveal family-card"><div class="floral-garland" aria-hidden="true">🌼 ❀ 🌿 🌸 🌿 ❀ 🌼</div><div class="eyebrow" data-content="familyEyebrow">With blessings from our families</div><h2 class="extra-title" data-content="familyHeading">With love from both families</h2><div class="family-grid"><article class="family-item bride-family"><div class="family-icon" aria-hidden="true">👰🏻‍♀️</div><h3 data-content="brideName">Shreya Arora</h3><p>💐 Daughter of</p><p data-content="brideParents">Mr. Rajesh Arora &amp; Mrs. Meenakshi Arora</p><p><em>🌷 Granddaughter of</em></p><p data-content="brideGrandparents">Late Mr. Rajinder Mohan &amp; Mrs. Darshana Devi</p></article><article class="family-item groom-family"><div class="family-icon" aria-hidden="true">🤵🏻</div><h3 data-content="groomName">Naman Dora</h3><p>💐 Son of</p><p data-content="groomParents">Mr. Praveen Dora &amp; Mrs. Reena Dora</p><p><em>🌷 Grandson of</em></p><p data-content="groomGrandparents">Mr. Sitaram Dora &amp; Mrs. Shakuntala Dora</p></article></div><p data-content="familyClosing">We are delighted to share this special journey with you.</p><button class="pill" id="familyContinue">Continue to the countdown ↓</button></div>`;
  $('cover').insertAdjacentElement('afterend',family);

  const countdown=document.createElement('section');
  countdown.id='countdownSection';countdown.className='extra-section hidden';
  countdown.innerHTML=`<div class="extra-card reveal"><div class="eyebrow">The countdown begins</div><h2 class="extra-title" data-content="countdownHeading">Until we say “I do”</h2><div class="count-grid"><div class="count-item"><strong id="cdDays">—</strong><span>Days</span></div><div class="count-item"><strong id="cdHours">—</strong><span>Hours</span></div><div class="count-item"><strong id="cdMinutes">—</strong><span>Minutes</span></div><div class="count-item"><strong id="cdSeconds">—</strong><span>Seconds</span></div></div><p>Monday, 14 December 2026 · Namaste Corbett Resort &amp; Spa</p><button class="pill" id="countdownContinue">See the wedding details ↓</button></div>`;
  family.insertAdjacentElement('afterend',countdown);

  const rsvp=document.createElement('section');
  rsvp.id='rsvpSection';rsvp.className='extra-section dark hidden';
  rsvp.innerHTML=`<div class="extra-card reveal"><div class="eyebrow">Kindly RSVP</div><h2 class="extra-title" data-content="rsvpHeading">Will you celebrate with us?</h2><p data-content="rsvpIntro">Please let us know if you can join the celebrations.</p><form class="rsvp-form" id="rsvpForm">
  <div class="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <label>Full name *<input name="name" required maxlength="120" autocomplete="name" placeholder="Enter your name"></label>
  <label>Email address<input name="email" type="email" maxlength="254" autocomplete="email" placeholder="Enter your email (optional)"></label>
  <label>Mobile number<input name="phone" type="tel" maxlength="40" autocomplete="tel" placeholder="Enter your phone number (optional)"></label>
  <label>Will you be attending? *<select name="attendance" required><option value="">Please choose</option><option value="yes">Yes, joyfully accepts</option><option value="no">Sorry, unable to attend</option><option value="maybe">Not sure yet</option></select></label>
  <label>Number of guests, including you<select name="guests" required><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option></select></label>
  <button class="pill" type="submit">💌 Send RSVP</button>
</form>
<p class="rsvp-status" id="rsvpStatus" aria-live="polite"></p>
<p class="tiny">Please submit one RSVP per household, counting everyone attending including you. If saving fails, you can send your response by WhatsApp instead.</p></div>`;
  const lookbook=$('lookbookSection');
  if(lookbook)lookbook.insertAdjacentElement('afterend',rsvp);else document.body.appendChild(rsvp);

  let target=new Date('2026-12-14T16:00:00+05:30').getTime();
  function tick(){
    let d=Math.max(0,target-Date.now());
    const days=Math.floor(d/86400000);d%=86400000;
    const hours=Math.floor(d/3600000);d%=3600000;
    const mins=Math.floor(d/60000);const secs=Math.floor((d%60000)/1000);
    if($('cdDays'))$('cdDays').textContent=days;
    if($('cdHours'))$('cdHours').textContent=String(hours).padStart(2,'0');
    if($('cdMinutes'))$('cdMinutes').textContent=String(mins).padStart(2,'0');
    if($('cdSeconds'))$('cdSeconds').textContent=String(secs).padStart(2,'0');
  }
  tick();setInterval(tick,1000);
  // Use the editable ceremony start time if the admin has configured one.
  window.addEventListener('load',async()=>{
    try{
      const cfg=window.inviteConfigPromise?await window.inviteConfigPromise:(window.INVITE_CONFIG||{});
      const configured=Date.parse(cfg.weddingStartDateTime||'');
      if(Number.isFinite(configured)){target=configured;tick();}
    }catch(_){}
  },{once:true});

  function reveal(id){const el=$(id);if(el){el.classList.remove('hidden');el.scrollIntoView({behavior:'smooth',block:'start'});}}
  $('familyContinue')?.addEventListener('click',()=>reveal('countdownSection'));
  $('countdownContinue')?.addEventListener('click',()=>reveal('dateSection'));

  function addRsvpLink(parent,label){
    if(!parent||parent.querySelector('[data-rsvp-shortcut]'))return;
    const a=document.createElement('a');a.href='#rsvpSection';a.className='invite-rsvp-link';a.dataset.rsvpShortcut='true';a.textContent=label;parent.appendChild(a);
  }
  addRsvpLink($('scrollPaper'),'Kindly RSVP · Reply to the invitation');
  addRsvpLink($('photoSection')?.querySelector('.frame'),'Kindly RSVP for the celebrations');
  addRsvpLink($('lookbookSection')?.querySelector('.frame'),'Kindly RSVP · Respond here');
  document.addEventListener('click',ev=>{
    const link=ev.target.closest('a[href="#rsvpSection"]');if(!link)return;
    ev.preventDefault();reveal('rsvpSection');
  });

  async function insertPrivateRecord(table, payload){
    const cfg=window.inviteConfigPromise?await window.inviteConfigPromise:(window.INVITE_CONFIG||{});
    const base=String(cfg.supabaseUrl||'').replace(/\/+$/,'');
    const key=String(cfg.supabaseAnonKey||'');
    if(!base||!key)throw new Error('Guest database is not configured yet.');
    const response=await fetch(base+'/rest/v1/'+table,{
      method:'POST',
      headers:{'apikey':key,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(payload)
    });
    if(!response.ok){
      let detail='Database request failed.';
      try{const body=await response.json();if(body.message)detail=body.message;}catch(_){}
      throw new Error(detail);
    }
}
function offerWhatsAppFallback(target, lines, message){
    const cfg=window.INVITE_CONFIG||{};
    const number=String(cfg.rsvpWhatsappNumber||'').replace(/\D/g,'');
    target.replaceChildren(document.createTextNode(message+' '));
    const link=document.createElement('a');
    link.className='pill';
    link.href='https://wa.me/'+(number||'')+'?text='+encodeURIComponent(lines.join('\n'));
    link.target='_blank';link.rel='noopener noreferrer';link.textContent='Send by WhatsApp instead';
    target.appendChild(link);
}
$('rsvpForm')?.addEventListener('submit',async ev=>{
    ev.preventDefault();
    const form=ev.currentTarget,data=new FormData(form),status=$('rsvpStatus'),button=form.querySelector('button[type="submit"]');
    if(String(data.get('website')||'').trim())return;
    const name=String(data.get('name')||'').trim();
    if(name.length<1||name.length>120){status.textContent='Please enter your name (up to 120 characters).';return;}
    const attendance=String(data.get('attendance')||'');
    if(!['yes','no','maybe'].includes(attendance)){status.textContent='Please select an attendance response.';return;}
    const guestCount=Math.max(1,Math.min(20,Number.parseInt(String(data.get('guests')||'1'),10)||1));
    const payload={full_name:name,email:String(data.get('email')||'').trim()||null,phone:String(data.get('phone')||'').trim()||null,attendance,guest_count:guestCount};
    const labels={yes:'Joyfully accepts',no:'Regretfully declines',maybe:'Not sure yet'};
    const whatsappLines=['Wedding RSVP — Shreya & Naman','Name: '+name,'Attendance: '+labels[attendance],'Guests: '+guestCount,'Email: '+(payload.email||'Not provided'),'Phone: '+(payload.phone||'Not provided')];
    button.disabled=true;button.textContent='Sending RSVP…';status.textContent='Sending your RSVP…';
    try{
      await insertPrivateRecord('wedding_rsvps',payload);
      status.textContent='Thank you, '+name+'! Your RSVP has been received.';
      form.reset();
    }catch(error){
      offerWhatsAppFallback(status,whatsappLines,'This RSVP was not saved to the guest list. '+error.message);
    }finally{
      button.disabled=false;button.textContent='💌 Send RSVP';
    }
  });
  $('submitWish')?.addEventListener('click',async()=>{
    const nameField=$('wishName'),wishField=$('wish'),status=$('toast'),button=$('submitWish');
    const name=String(nameField?.value||'').trim(),message=String(wishField?.value||'').trim();
    if(!name){status.textContent='Please enter your name first.';nameField?.focus();return;}
    if(!message){status.textContent='Please write a wish first.';wishField?.focus();return;}
    if(message.length>2000){status.textContent='Please keep your wish under 2,000 characters.';return;}
    button.disabled=true;button.textContent='Sending your wish…';
    try{
      await insertPrivateRecord('wedding_notes',{sender_name:name,message,approved:false});
      status.textContent='Thank you, '+name+'! Your wish has been sent.';
      wishField.value='';
    }catch(error){
      const cfg=window.INVITE_CONFIG||{},number=String(cfg.rsvpWhatsappNumber||'').replace(/\D/g,'');
      status.replaceChildren(document.createTextNode('Your wish could not be sent. '+error.message+' '));
      const link=document.createElement('a');link.className='pill';
      link.href='https://wa.me/'+(number||'')+'?text='+encodeURIComponent('A wish for Shreya & Naman from '+name+':\n'+message);
      link.target='_blank';link.rel='noopener noreferrer';link.textContent='Send this wish on WhatsApp';status.appendChild(link);
    }finally{button.disabled=false;button.textContent='💌 Send your wishes to the couple';}
  });
})();
