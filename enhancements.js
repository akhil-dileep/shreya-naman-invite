/* Wedding invitation enhancements: family details, live countdown, RSVP and gentle original synthesized music. */
(() => {
  const $ = id => document.getElementById(id);
  const style = document.createElement('style');
  style.textContent = `
    .extra-section{min-height:100svh;display:flex;align-items:center;justify-content:center;padding:28px 16px;position:relative;background:#fff5df;color:#24473a;text-align:center}
    .extra-section.dark{background:radial-gradient(ellipse at top,#1e5a43,#092b23 78%);color:#fff5df}
    .extra-card{width:min(100%,650px);padding:clamp(24px,6vw,48px);border:1px solid #c49a54;background:#fff8e9ed;box-shadow:0 10px 35px #39210e12}
    .dark .extra-card{background:#092b23a8;color:#fff5df}
    .extra-title{font-family:'Great Vibes',cursive;font-size:clamp(2.6rem,8vw,4.4rem);font-weight:400;color:#1b4b3a;margin:8px 0 18px}
    .dark .extra-title{color:#e4c47e}
    .family-grid,.count-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:22px 0}
    .family-item,.count-item{border:1px solid #d9c18e;padding:16px;background:#fffaf0}
    .family-item h3{font-weight:500;color:#174a39;margin:0 0 8px;font-size:1.35rem}
    .family-item p{margin:5px 0}
    .count-item strong{display:block;font-size:clamp(2rem,7vw,3.4rem);font-weight:500;color:#a87537}
    .count-item span{font-size:.82rem;text-transform:uppercase;letter-spacing:.12em}
    .rsvp-form{display:grid;gap:12px;text-align:left;margin-top:20px}
    .rsvp-form label{display:grid;gap:5px}
    .rsvp-form input,.rsvp-form select{width:100%;padding:12px;border:1px solid #d5b77c;background:#fffaf0;font:1rem Georgia;color:#24473a}
    .rsvp-status{min-height:1.4em}
    @media(max-width:480px){.family-grid,.count-grid{grid-template-columns:1fr 1fr}.family-item{padding:12px}}
  `;
  document.head.appendChild(style);

  /* Responsive fixes: prevent the long scroll from clipping and make every section flow naturally. */
  const responsiveStyle = document.createElement('style');
  responsiveStyle.textContent = `
    html { scroll-behavior: smooth; scroll-padding-top: 16px; }
    body { overflow-x: hidden; }
    .screen, .extra-section { min-height: 100svh; height: auto; overflow: visible; }
    .screen { padding-top: clamp(20px, 4vh, 42px); padding-bottom: clamp(20px, 4vh, 42px); }
    .scroll-paper { max-height: 0; overflow: hidden; transition: max-height 1.1s ease, padding 1.1s ease; }
    .scroll-paper.open { max-height: 20000px; overflow: visible; padding: clamp(18px, 4vw, 32px) clamp(14px, 4vw, 24px); }
    .scroll-wrap { width: min(100%, 760px); margin: auto; }
    .paper .frame, .photo-section .frame, .note .frame { width: min(100%, 760px); }
    .events { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .event { min-width: 0; overflow-wrap: anywhere; }
    .event p { line-height: 1.45; }
    .pill, .pull, button { min-height: 44px; touch-action: manipulation; }
    .pill { white-space: normal; max-width: 100%; }
    .scratchbox { max-width: min(100%, 440px); }
    .scratchbox canvas { touch-action: none; }
    .extra-section { scroll-margin-top: 12px; }
    .extra-card { min-width: 0; overflow-wrap: anywhere; }
    .extra-title { line-height: 1.12; }
    .family-item, .count-item { min-width: 0; overflow-wrap: anywhere; }
    .rsvp-form input, .rsvp-form select, .note textarea { font-size: 16px; max-width: 100%; }
    .music { bottom: max(14px, env(safe-area-inset-bottom)); }
    @media (max-width: 600px) {
      .screen { padding: 18px 12px; }
      .frame { width: 100%; padding: 22px 16px; }
      .events { grid-template-columns: 1fr; }
      .scroll-paper.open { max-height: 20000px; padding: 20px 14px; }
      .scroll-paper, .scroll-paper * { overflow-wrap: anywhere; }
      .family-grid { grid-template-columns: 1fr; }
      .count-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .family-item { padding: 14px; }
      .extra-section { padding: 22px 12px; }
      .extra-card { padding: 22px 16px; }
      .scratchbox { width: 100%; }
      .music { right: 10px; bottom: max(10px, env(safe-area-inset-bottom)); }
    }
    @media (min-width: 900px) {
      .screen { padding-left: 28px; padding-right: 28px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
  document.head.appendChild(responsiveStyle);


  const cover = $('cover');
  if (!cover || $('familySection')) return;
  const family = document.createElement('section');
  family.id = 'familySection'; family.className = 'extra-section hidden';
  family.innerHTML = `<div class="extra-card reveal"><div class="eyebrow">With blessings from our families</div><h2 class="extra-title">Two families, one beautiful beginning</h2><div class="family-grid"><article class="family-item"><h3>Shreya Arora</h3><p>Daughter of</p><p>Mr. Rajesh Arora &amp;<br>Mrs. Meenakshi Arora</p><p><em>Granddaughter of</em></p><p>Late Mr. Rajinder Mohan &amp;<br>Mrs. Darshana Devi</p></article><article class="family-item"><h3>Naman Dora</h3><p>Son of</p><p>Mr. Praveen Dora &amp;<br>Mrs. Reena Dora</p><p><em>Grandson of</em></p><p>Mr. Sitaram Dora &amp;<br>Mrs. Shakuntala Dora</p></article></div><p>We are delighted to share this special journey with you.</p><button class="pill" id="familyContinue">Continue to the wedding scroll ↓</button></div>`;
  cover.insertAdjacentElement('afterend', family);

  const countdown = document.createElement('section');
  countdown.id = 'countdownSection'; countdown.className = 'extra-section hidden';
  countdown.innerHTML = `<div class="extra-card reveal"><div class="eyebrow">The countdown begins</div><h2 class="extra-title">Until we say “I do”</h2><div class="count-grid"><div class="count-item"><strong id="cdDays">—</strong><span>Days</span></div><div class="count-item"><strong id="cdHours">—</strong><span>Hours</span></div><div class="count-item"><strong id="cdMinutes">—</strong><span>Minutes</span></div><div class="count-item"><strong id="cdSeconds">—</strong><span>Seconds</span></div></div><p>Monday, 14 December 2026 · Namaste Corbett Resort &amp; Spa</p><button class="pill" id="countdownContinue">Explore the celebrations ↓</button></div>`;
  family.insertAdjacentElement('afterend', countdown);

  const rsvp = document.createElement('section');
  rsvp.id = 'rsvpSection'; rsvp.className = 'extra-section dark hidden';
  rsvp.innerHTML = `<div class="extra-card reveal"><div class="eyebrow">Kindly RSVP</div><h2 class="extra-title">We'd be delighted to have you with us</h2><p>Let us know if you can join us for the celebrations.</p><form class="rsvp-form" id="rsvpForm"><label>Full name *<input name="name" required autocomplete="name" placeholder="Your name"></label><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label><label>Mobile number<input name="phone" type="tel" autocomplete="tel" placeholder="Your phone number"></label><label>Will you be joining us? *<select name="attendance" required><option value="">Please choose</option><option>Joyfully accepts</option><option>Regretfully declines</option><option>Not sure yet</option></select></label><label>Number of guests (including you)<select name="guests"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label><button class="pill" type="submit">Prepare RSVP message</button></form><p class="rsvp-status" id="rsvpStatus" aria-live="polite"></p><p class="tiny">This prepares a message for you to send; it does not submit data to a database.</p></div>`;
  const lookbook = $('lookbookSection');
  if (lookbook) lookbook.insertAdjacentElement('afterend', rsvp);
  else document.body.appendChild(rsvp);

  function revealExtra(id) { const el = $(id); if(el){el.classList.remove('hidden'); el.scrollIntoView({behavior:'smooth'});} }
  const seal = $('openSeal');
  if (seal) {
    const replacement = seal.cloneNode(true);
    seal.replaceWith(replacement);
    replacement.addEventListener('click', () => {
      replacement.textContent = '✦'; replacement.disabled = true;
      revealExtra('familySection');
      $('dateSection')?.classList.remove('hidden');
      $('countdownSection')?.classList.remove('hidden');
    });
  }
  $('familyContinue')?.addEventListener('click', () => { revealExtra('countdownSection'); });
  $('countdownContinue')?.addEventListener('click', () => { revealExtra('dateSection'); });
  const target = new Date('2026-12-14T16:00:00+05:30').getTime();
  function tick() {
    let delta = Math.max(0, target - Date.now());
    const days = Math.floor(delta / 86400000); delta %= 86400000;
    const hours = Math.floor(delta / 3600000); delta %= 3600000;
    const minutes = Math.floor(delta / 60000); const seconds = Math.floor((delta % 60000) / 1000);
    if($('cdDays')) $('cdDays').textContent = days;
    if($('cdHours')) $('cdHours').textContent = String(hours).padStart(2,'0');
    if($('cdMinutes')) $('cdMinutes').textContent = String(minutes).padStart(2,'0');
    if($('cdSeconds')) $('cdSeconds').textContent = String(seconds).padStart(2,'0');
  }
  tick(); setInterval(tick,1000);

  /* A soft, original ambient melody generated in-browser; starts only after a visitor taps. */
  const oldMusic = $('musicBtn');
  if (oldMusic) {
    const btn = oldMusic.cloneNode(true); oldMusic.replaceWith(btn);
    let ctx=null, master=null, timer=null, playing=false, step=0;
    const melody=[261.63,329.63,392.00,329.63,293.66,349.23,440.00,349.23,261.63,329.63,392.00,493.88,440.00,392.00,349.23,293.66];
    function note(freq, when, duration, volume, type='sine') {
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type=type; osc.frequency.value=freq; gain.gain.setValueAtTime(0.0001,when);
      gain.gain.exponentialRampToValueAtTime(volume,when+0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001,when+duration);
      osc.connect(gain); gain.connect(master); osc.start(when); osc.stop(when+duration+0.03);
    }
    function schedule() {
      if(!playing || !ctx) return;
      const t=ctx.currentTime;
      const f=melody[step%melody.length];
      note(f,t,0.72,0.075,'sine');
      if(step%4===0) note(f/2,t,1.45,0.025,'triangle');
      if(step%2===0) note(melody[(step+4)%melody.length]*2,t+0.12,0.38,0.018,'sine');
      step++; timer=setTimeout(schedule,620);
    }
    btn.addEventListener('click', async()=>{
      if(!playing){
        try{
          ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
          await ctx.resume(); master=ctx.createGain(); master.gain.value=0.7; master.connect(ctx.destination);
          playing=true; btn.textContent='♫ Music: on'; schedule();
        }catch(e){btn.textContent='♫ Tap to retry music';}
      }else{
        playing=false; clearTimeout(timer); if(master) master.gain.setTargetAtTime(0.0001,ctx.currentTime,0.08);
        btn.textContent='♫ Music: off';
      }
    });
  }

  $('rsvpForm')?.addEventListener('submit', e => {
    e.preventDefault(); const d=new FormData(e.currentTarget);
    const message = `Wedding RSVP — Shreya & Naman%0AName: ${encodeURIComponent(d.get('name'))}%0AAttendance: ${encodeURIComponent(d.get('attendance'))}%0AGuests: ${encodeURIComponent(d.get('guests'))}%0AEmail: ${encodeURIComponent(d.get('email')||'Not provided')}%0APhone: ${encodeURIComponent(d.get('phone')||'Not provided')}`;
    $('rsvpStatus').textContent='Your RSVP is ready to share in WhatsApp. No details have been stored.';
    const url='https://wa.me/?text='+message;
    const link=document.createElement('a'); link.href=url; link.target='_blank'; link.rel='noopener'; link.className='pill'; link.textContent='Open WhatsApp to send RSVP'; link.style.display='inline-block';
    $('rsvpStatus').replaceChildren(link);
  });
})();


/* Final mobile overflow, discoverable RSVP, and unobtrusive continuous-music behavior. */
(() => {
  const $ = id => document.getElementById(id);
  const fix = document.createElement('style');
  fix.textContent = `
    /* The expanded invitation is content-driven: never crop long text on phones. */
    #dateSection.screen, #dateSection.paper { height:auto !important; min-height:100svh !important; max-height:none !important; overflow:visible !important; display:flex; align-items:flex-start !important; }
    #dateSection .scroll-wrap { height:auto !important; max-height:none !important; overflow:visible !important; }
    #dateSection .scroll-paper.open { height:auto !important; max-height:none !important; min-height:0 !important; overflow:visible !important; }
    #dateSection .scroll-paper.open > * { max-height:none !important; }
    #dateSection .events, #dateSection .event { overflow:visible !important; }
    #dateSection .pull { margin-bottom:28px; }
    #dateSection .scroll-paper.open { padding-bottom:32px !important; }
    #rsvpSection { scroll-margin-top:16px; }
    .invite-rsvp-link { display:inline-flex; align-items:center; justify-content:center; margin:12px auto; padding:12px 22px; min-height:46px; border-radius:40px; border:1px solid #c49a54; background:#123d31; color:#fff5df; text-decoration:none; text-align:center; max-width:100%; white-space:normal; }
    @media(max-width:600px) {
      #dateSection.screen, #dateSection.paper { padding-top:18px !important; padding-bottom:24px !important; }
      #dateSection .scroll-wrap { width:100% !important; }
      #dateSection .scroll-paper.open { padding:20px 14px 30px !important; }
      #dateSection .events { grid-template-columns:minmax(0,1fr) !important; }
      #dateSection .event { padding:18px 14px !important; }
      #dateSection .scroll-paper.open p { line-height:1.55 !important; }
      .invite-rsvp-link { width:100%; }
    }
  `;
  document.head.appendChild(responsiveStyle);

  // The invitation scroll must remain fully readable regardless of viewport or text wrapping.
  const paper = $('scrollPaper');
  const resizeScroll = () => {
    if (paper && paper.classList.contains('open')) {
      paper.style.setProperty('max-height','none','important');
      paper.style.setProperty('height','auto','important');
      paper.style.setProperty('overflow','visible','important');
    } else if (paper) {
      paper.style.removeProperty('max-height');
      paper.style.removeProperty('height');
      paper.style.removeProperty('overflow');
    }
  };
  if (paper) {
    new MutationObserver(resizeScroll).observe(paper,{attributes:true,attributeFilter:['class']});
    window.addEventListener('resize',resizeScroll,{passive:true});
    window.addEventListener('orientationchange',resizeScroll,{passive:true});
    resizeScroll();
  }

  // Make RSVP easy to find from the scroll, couple photo, and lookbook.
  function addRsvpLink(parent, label) {
    if (!parent || parent.querySelector('[data-rsvp-shortcut]')) return;
    const a=document.createElement('a');
    a.href='#rsvpSection'; a.className='invite-rsvp-link'; a.dataset.rsvpShortcut='true';
    a.textContent=label;
    parent.appendChild(a);
  }
  addRsvpLink(paper,'Kindly RSVP · Let us know if you can join us');
  addRsvpLink($('photoSection')?.querySelector('.frame'),'Kindly RSVP for the celebrations');
  addRsvpLink($('lookbookSection')?.querySelector('.frame'),'Kindly RSVP · Respond to the invitation');
  document.addEventListener('click',e=>{
    const link=e.target.closest('a[href="#rsvpSection"]');
    if(!link)return;
    e.preventDefault();
    const rsvp=$('rsvpSection');
    if(rsvp){rsvp.classList.remove('hidden');rsvp.scrollIntoView({behavior:'smooth',block:'start'});}
  });

  // Keep the music control out of the design; index.html starts audio directly
  // from the first genuine user gesture to satisfy mobile browser audio policies.
  const musicButton = $('musicBtn');
  if (musicButton) musicButton.remove();
})();
