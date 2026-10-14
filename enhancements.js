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

  const family=document.createElement('section');
  family.id='familySection';family.className='extra-section hidden';
  family.innerHTML=`<div class="extra-card reveal"><div class="eyebrow">With blessings from our families</div><h2 class="extra-title">With love from both families</h2><div class="family-grid"><article class="family-item"><h3>Shreya Arora</h3><p>Daughter of</p><p>Mr. Rajesh Arora &amp;<br>Mrs. Meenakshi Arora</p><p><em>Granddaughter of</em></p><p>Late Mr. Rajinder Mohan &amp;<br>Mrs. Darshana Devi</p></article><article class="family-item"><h3>Naman Dora</h3><p>Son of</p><p>Mr. Praveen Dora &amp;<br>Mrs. Reena Dora</p><p><em>Grandson of</em></p><p>Mr. Sitaram Dora &amp;<br>Mrs. Shakuntala Dora</p></article></div><p>We are delighted to share this special journey with you.</p><button class="pill" id="familyContinue">Continue ↓</button></div>`;
  $('cover').insertAdjacentElement('afterend',family);

  const countdown=document.createElement('section');
  countdown.id='countdownSection';countdown.className='extra-section hidden';
  countdown.innerHTML=`<div class="extra-card reveal"><div class="eyebrow">The countdown begins</div><h2 class="extra-title">Until we say “I do”</h2><div class="count-grid"><div class="count-item"><strong id="cdDays">—</strong><span>Days</span></div><div class="count-item"><strong id="cdHours">—</strong><span>Hours</span></div><div class="count-item"><strong id="cdMinutes">—</strong><span>Minutes</span></div><div class="count-item"><strong id="cdSeconds">—</strong><span>Seconds</span></div></div><p>Monday, 14 December 2026 · Namaste Corbett Resort &amp; Spa</p><button class="pill" id="countdownContinue">See the wedding details ↓</button></div>`;
  family.insertAdjacentElement('afterend',countdown);

  const rsvp=document.createElement('section');
  rsvp.id='rsvpSection';rsvp.className='extra-section dark hidden';
  rsvp.innerHTML=`<div class="extra-card reveal"><div class="eyebrow">Kindly RSVP</div><h2 class="extra-title">Will you celebrate with us?</h2><p>Please let us know if you can join the celebrations.</p><form class="rsvp-form" id="rsvpForm"><label>Full name *<input name="name" required autocomplete="name" placeholder="Enter your name"></label><label>Email address<input name="email" type="email" autocomplete="email" placeholder="Enter your email"></label><label>Mobile number<input name="phone" type="tel" autocomplete="tel" placeholder="Enter your phone number"></label><label>Will you be attending? *<select name="attendance" required><option value="">Please choose</option><option>Yes, joyfully accepts</option><option>Sorry, unable to attend</option><option>Not sure yet</option></select></label><label>Number of guests, including you<select name="guests"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label><button class="pill" type="submit">Prepare RSVP in WhatsApp</button></form><p class="rsvp-status" id="rsvpStatus" aria-live="polite"></p><p class="tiny">Your details are not saved by this website. You will review and send the message yourself.</p></div>`;
  const lookbook=$('lookbookSection');
  if(lookbook)lookbook.insertAdjacentElement('afterend',rsvp);else document.body.appendChild(rsvp);

  const target=new Date('2026-12-14T16:00:00+05:30').getTime();
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

  $('rsvpForm')?.addEventListener('submit',ev=>{
    ev.preventDefault();const data=new FormData(ev.currentTarget);
    const lines=[
      'Wedding RSVP — Shreya & Naman',
      'Name: '+data.get('name'),
      'Attendance: '+data.get('attendance'),
      'Guests: '+data.get('guests'),
      'Email: '+(data.get('email')||'Not provided'),
      'Phone: '+(data.get('phone')||'Not provided')
    ];
    const url='https://wa.me/?text='+encodeURIComponent(lines.join('\n'));
    const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.className='pill';link.textContent='Open WhatsApp to send RSVP';
    $('rsvpStatus').replaceChildren(link);
  });
})();
