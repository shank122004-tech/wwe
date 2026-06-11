/**
 * intro.js — CrackAI v15.0  "IMPACT"
 * A blazing 3D AI orb emerges from deep center,
 * accelerates toward the viewer, SMASHES full-screen
 * in a blinding shockwave before the home screen reveals.
 *
 * Phases:
 *   0. VOID   — Black screen, tiny distant glow
 *   1. EMERGE — Orb materialises from depth
 *   2. CHARGE — Orb pulses, energy builds
 *   3. LAUNCH — Orb rockets at camera (perspective zoom)
 *   4. IMPACT — Full-screen white/orange blast
 *   5. BRAND  — CrackAI name + tagline + stats
 *   6. EXIT   — Dissolve to app
 *
 * Zero external dependencies. Pure Canvas 2D + CSS.
 */
(function () {
  'use strict';

  if (document.getElementById('sscIntroOverlay')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* CSS */
  const ST = document.createElement('style');
  ST.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400;600&display=swap');
    #sscIntroOverlay {
      position:fixed;inset:0;z-index:99999;overflow:hidden;touch-action:none;
      background:#000;will-change:opacity;
    }
    #ni-canvas { position:absolute;inset:0;width:100%;height:100%;display:block; }
    #ni-hud {
      position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;pointer-events:none;z-index:10;
    }
    #ni-brand {
      font-family:'Space Grotesk',sans-serif;
      font-size:clamp(52px,13vw,104px);font-weight:800;
      letter-spacing:-0.03em;line-height:1;opacity:0;color:#fff;
      transform:scale(0.55) translateY(40px);
      transition:opacity 0.55s ease,transform 0.65s cubic-bezier(0.22,1,0.36,1);
      filter:drop-shadow(0 0 40px rgba(249,115,22,0.9));
    }
    #ni-brand.show { opacity:1;transform:scale(1) translateY(0); }
    #ni-brand .crack { color:#fff; }
    #ni-brand .ai-txt {
      background:linear-gradient(135deg,#f97316 0%,#ec4899 45%,#8b5cf6 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    #ni-tagline {
      font-family:'JetBrains Mono',monospace;font-size:clamp(10px,2.2vw,13px);
      font-weight:300;letter-spacing:0.22em;text-transform:uppercase;
      color:rgba(249,115,22,0.75);margin-top:12px;opacity:0;
      transition:opacity 0.6s ease 0.3s;
    }
    #ni-tagline.show { opacity:1; }
    #ni-cursor {
      display:inline-block;width:2px;height:1em;background:#f97316;
      margin-left:3px;vertical-align:text-bottom;
      animation:niCurBlink 0.6s step-end infinite;
    }
    @keyframes niCurBlink { 0%,100%{opacity:1} 50%{opacity:0} }
    #ni-stats {
      display:flex;gap:clamp(10px,2.5vw,24px);
      margin-top:clamp(22px,4vw,36px);opacity:0;transition:opacity 0.7s ease;
    }
    .ni-stat {
      display:flex;flex-direction:column;align-items:center;
      padding:clamp(8px,1.5vw,12px) clamp(14px,2.5vw,22px);
      border:1px solid rgba(249,115,22,0.25);border-radius:12px;
      background:rgba(249,115,22,0.05);backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);position:relative;overflow:hidden;
    }
    .ni-stat::before {
      content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(249,115,22,0.1),transparent);
      animation:niShimmer 2.5s ease infinite;
    }
    @keyframes niShimmer { to{left:200%;} }
    .ni-stat-val {
      font-family:'Space Grotesk',sans-serif;font-size:clamp(16px,3.5vw,24px);font-weight:700;
      background:linear-gradient(135deg,#f97316,#ec4899);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    }
    .ni-stat-lbl {
      font-family:'JetBrains Mono',monospace;font-size:clamp(7px,1.3vw,9px);
      letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-top:3px;
    }
    .ni-corner { position:absolute;width:clamp(18px,3vw,28px);height:clamp(18px,3vw,28px);opacity:0;transition:opacity 0.6s ease; }
    .ni-corner.show { opacity:1; }
    .ni-tl{top:clamp(16px,3vw,32px);left:clamp(16px,3vw,32px);}
    .ni-tr{top:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);transform:scaleX(-1);}
    .ni-bl{bottom:clamp(16px,3vw,32px);left:clamp(16px,3vw,32px);transform:scaleY(-1);}
    .ni-br{bottom:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);transform:scale(-1,-1);}
    #ni-sys {
      position:absolute;bottom:clamp(16px,3vw,28px);left:50%;transform:translateX(-50%);
      font-family:'JetBrains Mono',monospace;font-size:clamp(7px,1.4vw,9px);
      letter-spacing:0.20em;text-transform:uppercase;color:rgba(255,255,255,0.18);
      opacity:0;transition:opacity 1s ease 0.5s;white-space:nowrap;
    }
    #ni-sys.show { opacity:1; }
    #ni-ver {
      position:absolute;top:clamp(16px,3vw,28px);right:clamp(16px,3vw,32px);
      font-family:'JetBrains Mono',monospace;font-size:clamp(7px,1.3vw,9px);
      letter-spacing:0.18em;text-transform:uppercase;color:rgba(249,115,22,0.35);
      opacity:0;transition:opacity 0.8s ease 0.4s;
    }
    #ni-ver.show { opacity:1; }
    #ni-prog { position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.05); }
    #ni-prog-fill {
      height:100%;width:0%;
      background:linear-gradient(90deg,#f97316,#ec4899,#8b5cf6);background-size:300% 100%;
      animation:niProgGrad 1.5s linear infinite;
      box-shadow:0 0 12px rgba(249,115,22,0.8);transition:width 0.08s linear;
    }
    @keyframes niProgGrad { 0%{background-position:0% 0;} 100%{background-position:300% 0;} }
    #ni-flash {
      position:absolute;inset:0;z-index:25;opacity:0;pointer-events:none;
      background:radial-gradient(circle at 50% 50%,#ffffff 0%,rgba(249,115,22,0.95) 20%,rgba(139,92,246,0.7) 50%,rgba(0,0,0,0) 80%);
    }
    @media(max-width:480px){ #ni-stats{flex-wrap:wrap;justify-content:center;gap:8px;} .ni-stat{padding:8px 14px;min-width:80px;} }
    @media(max-height:500px) and (orientation:landscape){ #ni-stats{display:none;} #ni-brand{font-size:36px;} }
  `;
  document.head.appendChild(ST);

  /* DOM */
  const cornerSVG = `<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 14V2H14" stroke="rgba(249,115,22,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="2" cy="2" r="1.5" fill="rgba(249,115,22,0.8)"/></svg>`;
  const ov = document.createElement('div');
  ov.id = 'sscIntroOverlay';
  ov.innerHTML = `
    <canvas id="ni-canvas"></canvas>
    <div class="ni-corner ni-tl">${cornerSVG}</div>
    <div class="ni-corner ni-tr">${cornerSVG}</div>
    <div class="ni-corner ni-bl">${cornerSVG}</div>
    <div class="ni-corner ni-br">${cornerSVG}</div>
    <div id="ni-hud">
      <div id="ni-brand"><span class="crack">Crack</span><span class="ai-txt">AI</span></div>
      <div id="ni-tagline"><span id="ni-typed"></span><span id="ni-cursor"></span></div>
      <div id="ni-stats">
        <div class="ni-stat"><div class="ni-stat-val" id="ns-q">0</div><div class="ni-stat-lbl">Questions</div></div>
        <div class="ni-stat"><div class="ni-stat-val" id="ns-a">0</div><div class="ni-stat-lbl">AI Accuracy</div></div>
        <div class="ni-stat"><div class="ni-stat-val" id="ns-s">0</div><div class="ni-stat-lbl">Students</div></div>
      </div>
    </div>
    <div id="ni-sys">CrackAI Neural Engine · India's #1 Study AI</div>
    <div id="ni-ver">v15.0 · IMPACT</div>
    <div id="ni-prog"><div id="ni-prog-fill"></div></div>
    <div id="ni-flash"></div>
  `;
  document.body.insertBefore(ov, document.body.firstChild);

  /* CANVAS */
  const canvas = document.getElementById('ni-canvas');
  const ctx    = canvas.getContext('2d');
  const MB     = window.innerWidth < 620;
  const DPR    = Math.min(window.devicePixelRatio || 1, MB ? 1.5 : 2);
  let W, H, CX, CY;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    CX = W / 2; CY = H / 2;
    canvas.width  = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(DPR, DPR);
  }
  resize();
  window.addEventListener('resize', resize);

  /* UTILS */
  const lerp    = (a,b,t)  => a + (b-a)*t;
  const clamp   = (v,lo,hi)=> Math.max(lo,Math.min(hi,v));
  const eOut3   = t => 1 - Math.pow(1-t,3);
  const eOut5   = t => 1 - Math.pow(1-t,5);
  const eIn5    = t => t*t*t*t*t;
  const eInOut5 = t => t<0.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2;
  const rand    = (lo,hi)  => lo + Math.random()*(hi-lo);
  const TAU     = Math.PI*2;

  /* ORB STATE */
  let orbZ=1.0, orbAlpha=0, orbEnergy=0, orbX=0, orbY=0;

  function orbRadius(z) {
    return (Math.min(W,H) * 0.038) / Math.max(z, 0.001);
  }

  /* PARTICLES */
  const particles = [];
  function spawnParticle(x,y,r,type) {
    const angle = rand(0,TAU);
    const speed = type==='charge' ? rand(r*0.4,r*1.2) : rand(r*0.8,r*3.5);
    const colors= ['#f97316','#ec4899','#8b5cf6','#06b6d4','#fff','#ffd700'];
    particles.push({
      x,y,
      vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
      alpha:rand(0.6,1), size:type==='impact'?rand(2,7):rand(1,3.5),
      life:0, maxLife:type==='impact'?rand(0.4,1.1):rand(0.3,0.8),
      color:colors[Math.floor(rand(0,colors.length))], type
    });
  }
  function updateParticles(dt) {
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.life+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
      p.vx*=0.92; p.vy*=0.92;
      if(p.type!=='impact') p.vy-=30*dt;
      if(p.life>p.maxLife) particles.splice(i,1);
    }
  }
  function drawParticles() {
    particles.forEach(p=>{
      const t=p.life/p.maxLife;
      const a=p.alpha*(1-eOut3(t));
      if(a<0.01) return;
      ctx.save(); ctx.globalAlpha=a;
      ctx.fillStyle=p.color; ctx.shadowColor=p.color;
      ctx.shadowBlur=p.type==='impact'?16:8;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(1-t*0.5),0,TAU); ctx.fill();
      ctx.restore();
    });
  }

  /* SHOCKWAVES */
  const shockwaves=[];
  function spawnShockwave(delay) {
    shockwaves.push({
      r:0, maxR:Math.max(W,H)*1.5,
      speed:rand(900,1400),
      alpha:rand(0.7,1.0), width:rand(3,8),
      color:['#f97316','#ec4899','#8b5cf6','#fff'][Math.floor(rand(0,4))],
      delay, life:-delay
    });
  }
  function updateShockwaves(dt) {
    shockwaves.forEach(sw=>{ sw.life+=dt; if(sw.life>0) sw.r+=sw.speed*dt; });
  }
  function drawShockwaves() {
    shockwaves.forEach(sw=>{
      if(sw.life<=0||sw.r<=0) return;
      const prog=sw.r/sw.maxR;
      const alpha=sw.alpha*(1-eOut3(prog));
      if(alpha<0.005) return;
      ctx.save(); ctx.globalAlpha=alpha;
      ctx.beginPath(); ctx.arc(CX,CY,sw.r,0,TAU);
      ctx.strokeStyle=sw.color; ctx.lineWidth=sw.width*(1-prog*0.7);
      ctx.shadowColor=sw.color; ctx.shadowBlur=30; ctx.stroke();
      ctx.restore();
    });
  }

  /* DEBRIS */
  const debris=[];
  function spawnDebris() {
    const count=MB?40:80;
    for(let i=0;i<count;i++){
      const angle=rand(0,TAU); const speed=rand(200,800);
      debris.push({
        x:CX,y:CY,
        vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
        len:rand(20,120), alpha:rand(0.5,1),
        life:0, maxLife:rand(0.3,0.9),
        color:['#f97316','#ec4899','#8b5cf6','#06b6d4','#fff','#ffd700'][Math.floor(rand(0,6))]
      });
    }
  }
  function updateDebris(dt) {
    for(let i=debris.length-1;i>=0;i--){
      const d=debris[i];
      d.life+=dt; d.x+=d.vx*dt; d.y+=d.vy*dt;
      d.vx*=0.88; d.vy*=0.88;
      if(d.life>d.maxLife) debris.splice(i,1);
    }
  }
  function drawDebris() {
    debris.forEach(d=>{
      const t=d.life/d.maxLife;
      const a=d.alpha*(1-eOut3(t));
      if(a<0.01) return;
      const spd=Math.hypot(d.vx,d.vy)||1;
      const nx=d.vx/spd, ny=d.vy/spd;
      ctx.save(); ctx.globalAlpha=a;
      ctx.strokeStyle=d.color; ctx.lineWidth=rand(0.5,2);
      ctx.shadowColor=d.color; ctx.shadowBlur=10; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(d.x-nx*d.len*0.3, d.y-ny*d.len*0.3);
      ctx.lineTo(d.x+nx*d.len*0.1, d.y+ny*d.len*0.1);
      ctx.stroke(); ctx.restore();
    });
  }

  /* BACKGROUND */
  let bgAlpha=0;
  function drawBG(t) {
    ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
    if(bgAlpha<0.01) return;
    const grd=ctx.createRadialGradient(CX,CY,0,CX,CY,Math.max(W,H)*0.8);
    grd.addColorStop(0,`rgba(12,5,28,${bgAlpha})`);
    grd.addColorStop(0.5,`rgba(5,2,14,${bgAlpha})`);
    grd.addColorStop(1,`rgba(0,0,0,${bgAlpha})`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);
    [{x:CX+Math.sin(t*0.4)*W*0.2,y:CY-H*0.25,r:W*0.3,c:[249,115,22],a:0.05},
     {x:CX-Math.cos(t*0.3)*W*0.22,y:CY+H*0.2,r:W*0.35,c:[139,92,246],a:0.04}
    ].forEach(p=>{
      const g2=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      g2.addColorStop(0,`rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a*bgAlpha})`);
      g2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);
    });
  }

  /* DRAW ORB — multi-layer 3D sphere */
  function drawOrb(t,z,energy) {
    const r=orbRadius(z);
    const cx=CX+orbX, cy=CY+orbY;
    if(r<1||orbAlpha<0.01) return;
    const depthFade=clamp(1-z*0.35,0.3,1);

    ctx.save(); ctx.globalAlpha=orbAlpha*depthFade;

    // 1. Wide halo
    const haloR=r*(2.8+energy*2.0);
    const halo=ctx.createRadialGradient(cx,cy,r*0.4,cx,cy,haloR);
    halo.addColorStop(0,`rgba(249,115,22,${0.18+energy*0.28})`);
    halo.addColorStop(0.3,`rgba(139,92,246,${0.10+energy*0.18})`);
    halo.addColorStop(0.6,`rgba(236,72,153,${0.05+energy*0.10})`);
    halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=halo;
    ctx.beginPath(); ctx.arc(cx,cy,haloR,0,TAU); ctx.fill();

    // 2. Atmosphere
    const atmoR=r*1.48;
    const atmo=ctx.createRadialGradient(cx,cy,r*0.7,cx,cy,atmoR);
    atmo.addColorStop(0,`rgba(255,160,80,${0.5+energy*0.35})`);
    atmo.addColorStop(0.5,`rgba(200,80,200,${0.25+energy*0.22})`);
    atmo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=atmo;
    ctx.beginPath(); ctx.arc(cx,cy,atmoR,0,TAU); ctx.fill();

    // 3. Sphere body (dark core gradient)
    const body=ctx.createRadialGradient(cx-r*0.25,cy-r*0.28,r*0.05,cx,cy,r);
    body.addColorStop(0,'#fff8f0');
    body.addColorStop(0.12,'#ffd080');
    body.addColorStop(0.3,'#f97316');
    body.addColorStop(0.6,'#7c3aed');
    body.addColorStop(0.82,'#1a0a2e');
    body.addColorStop(1,'#050010');
    ctx.fillStyle=body;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,TAU); ctx.fill();

    // 4. Specular highlight (top-left)
    const hlR=r*0.35;
    const hl=ctx.createRadialGradient(cx-r*0.28,cy-r*0.30,0,cx-r*0.20,cy-r*0.22,hlR);
    hl.addColorStop(0,'rgba(255,255,255,0.95)');
    hl.addColorStop(0.4,'rgba(255,230,180,0.45)');
    hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=hl;
    ctx.beginPath(); ctx.arc(cx-r*0.20,cy-r*0.22,hlR,0,TAU); ctx.fill();

    // 5. Bounce light (bottom-right purple)
    const hl2=ctx.createRadialGradient(cx+r*0.3,cy+r*0.32,0,cx+r*0.3,cy+r*0.32,r*0.22);
    hl2.addColorStop(0,'rgba(139,92,246,0.38)');
    hl2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hl2;
    ctx.beginPath(); ctx.arc(cx+r*0.3,cy+r*0.32,r*0.22,0,TAU); ctx.fill();

    // 6. Equatorial ring (rotating)
    const ringRx=r*1.15, ringRy=r*0.22;
    const ringAlpha=0.3+energy*0.6;
    ctx.save();
    ctx.translate(cx,cy); ctx.rotate(t*1.1);
    ctx.scale(1,ringRy/ringRx);
    ctx.strokeStyle=`rgba(249,115,22,${ringAlpha})`;
    ctx.lineWidth=Math.max(1,r*0.04);
    ctx.shadowColor='#f97316'; ctx.shadowBlur=r*0.28;
    ctx.beginPath(); ctx.arc(0,0,ringRx,0,TAU); ctx.stroke();
    ctx.rotate(Math.PI/3);
    ctx.strokeStyle=`rgba(139,92,246,${ringAlpha*0.7})`;
    ctx.shadowColor='#8b5cf6';
    ctx.beginPath(); ctx.arc(0,0,ringRx*0.88,0,TAU); ctx.stroke();
    ctx.restore();

    // 7. Energy charge pulse
    if(energy>0.25) {
      const pulseT=((t*2)%1);
      const pulseR=r*(1+pulseT*2.8);
      const pulseA=(1-pulseT)*(energy-0.25)*0.85;
      ctx.save(); ctx.globalAlpha=orbAlpha*pulseA;
      ctx.beginPath(); ctx.arc(cx,cy,pulseR,0,TAU);
      ctx.strokeStyle='#f97316'; ctx.lineWidth=2;
      ctx.shadowColor='#f97316'; ctx.shadowBlur=22; ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  /* SPEED LINES — during launch */
  const speedLines=[];
  function initSpeedLines() {
    speedLines.length=0;
    const count=MB?35:70;
    for(let i=0;i<count;i++){
      const angle=rand(0,TAU);
      speedLines.push({
        angle, dist:rand(0.12,0.65), len:rand(0.04,0.18),
        alpha:rand(0.3,0.9), speed:rand(0.9,2.2),
        color:['#f97316','#ec4899','#8b5cf6','#06b6d4','#fff'][Math.floor(rand(0,5))]
      });
    }
  }
  function drawSpeedLines(progress) {
    if(!speedLines.length) return;
    const maxR=Math.max(W,H)*0.88;
    speedLines.forEach(sl=>{
      const r1=maxR*sl.dist*(0.5+progress*0.8);
      const r2=r1+maxR*sl.len*(0.5+progress*1.6);
      ctx.save(); ctx.globalAlpha=sl.alpha*progress*0.9;
      ctx.strokeStyle=sl.color; ctx.lineWidth=1;
      ctx.shadowColor=sl.color; ctx.shadowBlur=6;
      ctx.beginPath();
      ctx.moveTo(CX+Math.cos(sl.angle)*r1, CY+Math.sin(sl.angle)*r1);
      ctx.lineTo(CX+Math.cos(sl.angle)*r2, CY+Math.sin(sl.angle)*r2);
      ctx.stroke(); ctx.restore();
    });
  }

  /* HUD REFS */
  const brandEl  = document.getElementById('ni-brand');
  const taglineEl= document.getElementById('ni-tagline');
  const typedEl  = document.getElementById('ni-typed');
  const statsEl  = document.getElementById('ni-stats');
  const sysEl    = document.getElementById('ni-sys');
  const verEl    = document.getElementById('ni-ver');
  const progFill = document.getElementById('ni-prog-fill');
  const flashEl  = document.getElementById('ni-flash');
  const corners  = document.querySelectorAll('.ni-corner');

  const TAGLINE_TEXT = "India's #1 AI Study Engine";
  let typeIdx=0, typeTimer=0;
  const TYPE_SPEED=0.048;
  let hudShown=false, typeStarted=false, statsShown=false, cornersShown=false, impactFired=false;

  function showBrand() {
    brandEl.classList.add('show');
    setTimeout(()=>{ taglineEl.classList.add('show'); typeStarted=true; }, 200);
  }
  function tickTypewriter(dt) {
    if(!typeStarted) return;
    typeTimer+=dt;
    if(typeTimer>TYPE_SPEED && typeIdx<TAGLINE_TEXT.length){
      typeTimer=0; typeIdx++;
      typedEl.textContent=TAGLINE_TEXT.substring(0,typeIdx);
    }
  }
  function animCount(el,target,dur,suffix) {
    const start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/(dur*1000),1);
      const val=Math.floor(eOut3(p)*target);
      if(suffix){ el.textContent=Math.floor(eOut3(p)*target)+suffix; }
      else { el.textContent=val>=1000?(val>=100000?Math.floor(val/1000)+'K':val.toLocaleString('en-IN')):String(val); }
      if(p<1) requestAnimationFrame(tick);
    };
    tick();
  }
  function setProgress(pct){ progFill.style.width=pct+'%'; }

  /* MAIN LOOP */
  let elapsed=0, phase=0, phaseT=0, rafId=null, lastTs=null;

  function animate(ts) {
    rafId=requestAnimationFrame(animate);
    if(!lastTs) lastTs=ts;
    const dt=Math.min((ts-lastTs)/1000,0.05);
    lastTs=ts; elapsed+=dt; phaseT+=dt;

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);

    /* PHASE 0 — VOID (0–0.4s) */
    if(phase===0) {
      bgAlpha=eOut3(clamp(phaseT/0.4,0,1))*0.4;
      orbAlpha=eOut5(clamp(phaseT/0.35,0,1))*0.25;
      orbZ=1.0; orbEnergy=0; orbX=orbY=0;
      drawBG(elapsed); drawOrb(elapsed,orbZ,orbEnergy);
      setProgress(5);
      if(phaseT>0.4){ phase=1; phaseT=0; }
    }
    /* PHASE 1 — EMERGE (0.4–1.2s) */
    else if(phase===1) {
      const t=clamp(phaseT/0.8,0,1);
      bgAlpha=lerp(0.4,1,eOut3(t));
      orbAlpha=lerp(0.25,1,eOut3(t));
      orbZ=lerp(1.0,0.55,eOut3(t));
      orbEnergy=0;
      orbX=Math.sin(elapsed*1.8)*4; orbY=Math.cos(elapsed*2.1)*4;
      if(Math.random()>0.75) spawnParticle(CX+orbX,CY+orbY,orbRadius(orbZ),'charge');
      drawBG(elapsed); updateParticles(dt); drawParticles();
      drawOrb(elapsed,orbZ,orbEnergy);
      setProgress(5+Math.floor(t*20));
      if(phaseT>0.8){ phase=2; phaseT=0; }
    }
    /* PHASE 2 — CHARGE (1.2–2.4s) */
    else if(phase===2) {
      const t=clamp(phaseT/1.2,0,1);
      bgAlpha=1; orbAlpha=1;
      orbZ=lerp(0.55,0.42,eOut3(t));
      orbEnergy=eInOut5(t);
      const wobble=6+orbEnergy*14;
      orbX=Math.sin(elapsed*2.4)*wobble; orbY=Math.cos(elapsed*3.1)*wobble*0.6;
      for(let i=0;i<(orbEnergy>0.6?3:1);i++){
        if(Math.random()>0.4) spawnParticle(CX+orbX,CY+orbY,orbRadius(orbZ),'charge');
      }
      drawBG(elapsed); updateParticles(dt); drawParticles();
      drawOrb(elapsed,orbZ,orbEnergy);
      setProgress(25+Math.floor(t*25));
      if(phaseT>1.2){ phase=3; phaseT=0; initSpeedLines(); }
    }
    /* PHASE 3 — LAUNCH (2.4–3.1s) — exponential zoom */
    else if(phase===3) {
      const t=clamp(phaseT/0.7,0,1);
      const zoom=eIn5(t);
      orbZ=lerp(0.42,0.003,zoom);
      orbAlpha=lerp(1,0.55,zoom*0.5);
      orbEnergy=lerp(1,1.5,zoom);
      bgAlpha=1;
      orbX=lerp(Math.sin(elapsed*2.4)*6,0,zoom);
      orbY=lerp(Math.cos(elapsed*3.1)*4,0,zoom);
      drawBG(elapsed);
      updateShockwaves(dt); drawShockwaves();
      drawSpeedLines(zoom);
      updateParticles(dt); drawParticles();
      drawOrb(elapsed,orbZ,orbEnergy);
      setProgress(50+Math.floor(zoom*25));
      if(t>=1){ phase=4; phaseT=0; }
    }
    /* PHASE 4 — IMPACT (3.1–3.6s) */
    else if(phase===4) {
      const t=clamp(phaseT/0.5,0,1);
      if(!impactFired){
        impactFired=true;
        for(let i=0;i<(MB?4:7);i++) spawnShockwave(i*0.04);
        spawnDebris();
        for(let i=0;i<(MB?25:60);i++) spawnParticle(CX,CY,200,'impact');
      }
      drawBG(elapsed);
      updateShockwaves(dt); drawShockwaves();
      updateDebris(dt); drawDebris();
      updateParticles(dt); drawParticles();
      const flashPeak=clamp(phaseT/0.08,0,1);
      const flashFade=1-clamp((phaseT-0.08)/0.42,0,1);
      flashEl.style.opacity=String(flashPeak*flashFade);
      setProgress(75+Math.floor(t*5));
      if(t>=1){ phase=5; phaseT=0; flashEl.style.opacity='0'; }
    }
    /* PHASE 5 — BRAND (3.6–5.6s) */
    else if(phase===5) {
      const t=clamp(phaseT/2.0,0,1);
      bgAlpha=1;
      drawBG(elapsed);
      updateShockwaves(dt); drawShockwaves();
      updateDebris(dt); drawDebris();
      updateParticles(dt); drawParticles();
      if(!hudShown){
        hudShown=true; showBrand();
        setTimeout(()=>{ corners.forEach(c=>c.classList.add('show')); sysEl.classList.add('show'); verEl.classList.add('show'); },400);
      }
      tickTypewriter(dt);
      if(!statsShown && typeIdx>=TAGLINE_TEXT.length){
        statsShown=true; statsEl.style.opacity='1';
        animCount(document.getElementById('ns-q'),284600,2.0);
        animCount(document.getElementById('ns-a'),98,1.8,'%');
        animCount(document.getElementById('ns-s'),51200,2.2);
      }
      setProgress(80+Math.floor(t*20));
      if(t>=1){ setProgress(100); phase=6; phaseT=0; }
    }
    /* PHASE 6 — EXIT */
    else if(phase===6) {
      const t=clamp(phaseT/0.7,0,1);
      drawBG(elapsed); updateParticles(dt); drawParticles();
      tickTypewriter(dt);
      if(t>=1 && !exited){ cancelAnimationFrame(rafId); doExit(0); }
    }
  }

  animate(0);

  /* EXIT */
  let exited=false;
  function doExit(delay) {
    if(exited) return; exited=true;
    setTimeout(()=>{
      ov.style.transition='opacity 0.55s cubic-bezier(.4,0,.2,1)';
      ov.style.opacity='0';
      setTimeout(()=>{ ov.style.display='none'; try{ov.parentNode.removeChild(ov);}catch(e){} },600);
    }, delay);
  }

  window._niStartExit=()=>{ if(phase<6){ phase=6; phaseT=0; } };

  const startTs=Date.now();
  const MIN_SHOW=5600;
  function triggerExit() {
    const waited=Date.now()-startTs;
    setTimeout(()=>{ if(window._niStartExit) window._niStartExit(); else doExit(0); }, Math.max(0,MIN_SHOW-waited));
  }
  if(document.readyState==='complete'){ triggerExit(); }
  else { window.addEventListener('load',triggerExit,{once:true}); }
  setTimeout(()=>{ if(!exited) doExit(0); },8000);

})();


/* ═══════════════════════════════════════════════════════════════════
   CrackAI Sign-In Page Animation — v4.0  "OBSIDIAN"
   Ultra-premium right-panel canvas loop. 5 cinematic scenes, ~8s cycle.
   Billion-dollar aesthetic: deep space, liquid glass, precise motion.
   Zero deps. Runs after splash exits.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Styles ── */
  var S = document.createElement('style');
  S.id = 'cai-signin-v4-styles';
  S.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    #cai-anim-panel {
      position: absolute;
      inset: 0;
      overflow: hidden;
      background: #04030d;
      display: none;
    }
    #cai-anim-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    /* ── Noise texture overlay for premium depth ── */
    #cai-anim-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    /* ── Vignette ── */
    #cai-anim-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%);
      pointer-events: none;
    }

    /* ── HUD layer ── */
    #cai-anim-hud {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      pointer-events: none;
      z-index: 10;
      padding: 0 28px 36px;
    }

    /* Scene chip */
    #cai-scene-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(167,139,250,0.9);
      background: rgba(139,92,246,0.10);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 100px;
      padding: 5px 15px;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1);
      margin-bottom: 14px;
    }
    #cai-scene-chip.show { opacity: 1; transform: translateY(0); }

    /* Scene title */
    #cai-scene-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(20px, 3.2vw, 32px);
      font-weight: 800;
      color: #f8f7ff;
      letter-spacing: -0.04em;
      text-align: center;
      line-height: 1.15;
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.06s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.06s;
    }
    #cai-scene-title.show { opacity: 1; transform: translateY(0); }
    #cai-scene-title .hl {
      background: linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #fb923c 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* Scene description */
    #cai-scene-desc {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(11.5px, 1.5vw, 13.5px);
      font-weight: 400;
      color: rgba(255,255,255,0.38);
      text-align: center;
      margin-top: 8px;
      opacity: 0;
      transition: opacity 0.55s ease 0.18s;
      max-width: 300px;
      line-height: 1.65;
      letter-spacing: 0.01em;
    }
    #cai-scene-desc.show { opacity: 1; }

    /* Stats row */
    #cai-live-stats {
      display: flex;
      gap: 10px;
      margin-top: 22px;
      opacity: 0;
      transition: opacity 0.6s ease 0.28s;
    }
    #cai-live-stats.show { opacity: 1; }
    .cai-ls {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 9px 15px;
      border: 1px solid rgba(139,92,246,0.18);
      border-radius: 14px;
      background: rgba(139,92,246,0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      position: relative;
      overflow: hidden;
    }
    .cai-ls::after {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(167,139,250,0.10), transparent);
      animation: caiLsShimmer 3.4s ease infinite;
    }
    @keyframes caiLsShimmer { to { left: 200%; } }
    .cai-ls-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #a78bfa, #f472b6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .cai-ls-lbl {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.25);
      margin-top: 2px;
    }

    /* Scene progress dots */
    #cai-scene-dots {
      display: flex;
      gap: 5px;
      margin-top: 20px;
      opacity: 0;
      transition: opacity 0.5s ease 0.35s;
    }
    #cai-scene-dots.show { opacity: 1; }
    .cai-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.14);
      transition: background 0.35s ease, width 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .cai-dot.active {
      background: linear-gradient(90deg, #a78bfa, #f472b6);
      width: 20px;
      border-radius: 3px;
    }

    /* Corner brackets */
    .cai-corner-br {
      position: absolute;
      width: 22px; height: 22px;
      opacity: 0.3;
      z-index: 8;
    }
    .cai-corner-br.tl { top: 22px; left: 22px; }
    .cai-corner-br.tr { top: 22px; right: 22px; transform: scaleX(-1); }
    .cai-corner-br.bl { bottom: 22px; left: 22px; transform: scaleY(-1); }
    .cai-corner-br.br { bottom: 22px; right: 22px; transform: scale(-1,-1); }

    /* Scanline premium effect */
    #cai-scanline {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.18) 20%, rgba(167,139,250,0.35) 50%, rgba(167,139,250,0.18) 80%, transparent 100%);
      pointer-events: none;
      z-index: 9;
      animation: caiScanMove 7s linear infinite;
      top: 0;
    }
    @keyframes caiScanMove { 0%{top:0%;opacity:0} 5%{opacity:1} 90%{opacity:0.6} 100%{top:100%;opacity:0} }

    /* Top status bar */
    #cai-status-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: rgba(255,255,255,0.04);
      z-index: 8;
      overflow: hidden;
    }
    #cai-status-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #7c3aed, #a78bfa, #f472b6);
      background-size: 200% 100%;
      animation: caiBarGrad 2s linear infinite;
      transition: width 0.12s linear;
      box-shadow: 0 0 8px rgba(167,139,250,0.6);
    }
    @keyframes caiBarGrad { 0%{background-position:0%} 100%{background-position:200%} }

    /* Left panel enhancements */
    .cai-btn-google-premium::after {
      content: '';
      position: absolute;
      top: 0; left: -120%; width: 60%; height: 100%;
      background: linear-gradient(105deg, transparent 20%, rgba(139,92,246,0.10) 50%, transparent 80%);
      animation: caiBtnShimmerV4 3.6s ease 2s infinite;
      pointer-events: none;
    }
    @keyframes caiBtnShimmerV4 { 0%{left:-120%} 100%{left:160%} }

    @keyframes caiBtnGlowV4 {
      0%,100% { box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 0 0 0 rgba(139,92,246,0.22); }
      60%     { box-shadow: 0 2px 8px rgba(0,0,0,0.08), 0 0 0 8px rgba(139,92,246,0); }
    }
    #cai-auth-google-v4 { animation: caiBtnGlowV4 2.8s ease 2.5s infinite; }

    /* Floating badge */
    #cai-floating-badge-v4 {
      position: absolute;
      bottom: 0; right: 0;
      transform: translate(0, -20px);
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 10.5px;
      font-weight: 700;
      padding: 6px 13px;
      border-radius: 100px;
      box-shadow: 0 4px 20px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.12);
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
      letter-spacing: -0.01em;
      z-index: 5;
      display: none;
    }
    #cai-floating-badge-v4.show {
      display: block;
      animation: caiBadgeInV4 0.6s cubic-bezier(0.22,1,0.36,1) forwards,
                 caiBadgeFloatV4 4s ease-in-out 0.6s infinite;
    }
    @keyframes caiBadgeInV4 {
      from { opacity: 0; transform: translate(0, 16px) scale(0.82); }
      to   { opacity: 1; transform: translate(0, 0) scale(1); }
    }
    @keyframes caiBadgeFloatV4 {
      0%,100% { transform: translate(0, 0px); }
      50%     { transform: translate(0, -6px); }
    }

    @media (max-width: 640px) {
      #cai-anim-panel { display: none !important; }
      #cai-floating-badge-v4 { display: none !important; }
    }
  `;
  document.head.appendChild(S);

  /* ── Wait for authScreen ── */
  function init() {
    var authEl = document.getElementById('authScreen');
    if (!authEl) { setTimeout(init, 300); return; }
    function trySetup() { if (!authEl.classList.contains('hidden')) setup(authEl); }
    var obs = new MutationObserver(function() {
      if (!authEl.classList.contains('hidden')) { obs.disconnect(); setup(authEl); }
    });
    obs.observe(authEl, { attributes: true, attributeFilter: ['class'] });
    trySetup();
  }

  function setup(authEl) {
    var rightPanel = authEl.querySelector('.cai-right');
    if (!rightPanel || rightPanel._caiV4Done) return;
    rightPanel._caiV4Done = true;
    rightPanel.style.cssText += ';position:relative;padding:0;overflow:hidden;min-height:500px;';

    var existing = Array.from(rightPanel.children);
    existing.forEach(function(el) { el.style.cssText = 'display:none!important'; });

    /* Corner SVG */
    var cSVG = '<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11V2H11" stroke="rgba(167,139,250,0.75)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="2" cy="2" r="1.4" fill="rgba(167,139,250,0.9)"/></svg>';

    var panel = document.createElement('div');
    panel.id = 'cai-anim-panel';
    panel.style.display = 'block';
    panel.innerHTML =
      '<canvas id="cai-anim-canvas"></canvas>' +
      '<div id="cai-scanline"></div>' +
      '<div id="cai-status-bar"><div id="cai-status-fill"></div></div>' +
      '<div class="cai-corner-br tl">' + cSVG + '</div>' +
      '<div class="cai-corner-br tr">' + cSVG + '</div>' +
      '<div class="cai-corner-br bl">' + cSVG + '</div>' +
      '<div class="cai-corner-br br">' + cSVG + '</div>' +
      '<div id="cai-anim-hud">' +
        '<div id="cai-scene-chip">AI Feature</div>' +
        '<div id="cai-scene-title">Solving Questions</div>' +
        '<div id="cai-scene-desc">Ask anything, get instant answers</div>' +
        '<div id="cai-live-stats">' +
          '<div class="cai-ls"><div class="cai-ls-val" id="cai-ls-q">51.2K</div><div class="cai-ls-lbl">Students</div></div>' +
          '<div class="cai-ls"><div class="cai-ls-val" id="cai-ls-a">98%</div><div class="cai-ls-lbl">Accuracy</div></div>' +
          '<div class="cai-ls"><div class="cai-ls-val" id="cai-ls-b">284K</div><div class="cai-ls-lbl">Questions</div></div>' +
        '</div>' +
        '<div id="cai-scene-dots">' +
          '<div class="cai-dot" data-idx="0"></div>' +
          '<div class="cai-dot" data-idx="1"></div>' +
          '<div class="cai-dot" data-idx="2"></div>' +
          '<div class="cai-dot" data-idx="3"></div>' +
          '<div class="cai-dot" data-idx="4"></div>' +
        '</div>' +
      '</div>';
    rightPanel.appendChild(panel);

    /* Left panel extras */
    var googleBtn = authEl.querySelector('#googleSignInBtn');
    if (googleBtn) {
      googleBtn.id = 'cai-auth-google-v4';
      googleBtn.classList.add('cai-btn-google-premium');
    }
    var leftPanel = authEl.querySelector('.cai-left');
    if (leftPanel) {
      leftPanel.style.position = 'relative';
      var badge = document.createElement('div');
      badge.id = 'cai-floating-badge-v4';
      badge.innerHTML = '✦ 51,200+ students active now';
      leftPanel.appendChild(badge);
      setTimeout(function() { badge.classList.add('show'); }, 3500);
    }

    /* ── Canvas ── */
    var canvas  = document.getElementById('cai-anim-canvas');
    var ctx     = canvas.getContext('2d');
    var W, H, CX, CY;
    var DPR     = Math.min(window.devicePixelRatio || 1, 2.5);
    var statusFill = document.getElementById('cai-status-fill');

    function resize() {
      W  = panel.offsetWidth  || rightPanel.offsetWidth  || window.innerWidth  * 0.5;
      H  = panel.offsetHeight || rightPanel.offsetHeight || window.innerHeight;
      CX = W / 2; CY = H / 2;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── Math utils ── */
    var TAU = Math.PI * 2;
    function lerp(a,b,t){ return a + (b-a)*t; }
    function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }
    function eOut3(t){ return 1 - Math.pow(1-t,3); }
    function eOut5(t){ return 1 - Math.pow(1-t,5); }
    function eInOut3(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
    function rand(lo,hi){ return lo + Math.random()*(hi-lo); }
    function rInt(lo,hi){ return Math.floor(rand(lo,hi)); }

    /* ── Particle pool ── */
    var particles = [];
    function spawnP(x,y,vx,vy,color,life,size,type) {
      particles.push({x:x,y:y,vx:vx,vy:vy,color:color,life:0,maxLife:life,size:size,type:type||'dot'});
    }
    function tickP(dt) {
      for (var i=particles.length-1;i>=0;i--) {
        var p=particles[i];
        p.life+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
        p.vx*=0.94; p.vy*=0.94;
        if (p.type==='dot') p.vy+=22*dt;
        if (p.life>p.maxLife) particles.splice(i,1);
      }
    }
    function drawP() {
      particles.forEach(function(p) {
        var t=p.life/p.maxLife, a=(1-eOut3(t))*0.88;
        if (a<0.01) return;
        ctx.save();
        ctx.globalAlpha=a;
        ctx.fillStyle=p.color;
        ctx.shadowColor=p.color; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(1-t*0.45),0,TAU); ctx.fill();
        ctx.restore();
      });
    }
    function burst(x,y,color,n,speed) {
      for (var i=0;i<(n||14);i++) {
        var a=rand(0,TAU), s=rand(speed||50, (speed||50)*2.8);
        spawnP(x,y,Math.cos(a)*s,Math.sin(a)*s-50,color,rand(0.55,1.2),rand(2,5),'dot');
      }
    }

    /* ── Rounded rect helper ── */
    function rr(x,y,w,h,r) {
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
      else {
        ctx.beginPath();
        ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
        ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
        ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
        ctx.closePath();
      }
    }

    function wrapText(text, x, y, maxW, lineH) {
      var words=text.split(' '), line='';
      for(var n=0;n<words.length;n++){
        var test=line+words[n]+' ';
        if(ctx.measureText(test).width>maxW && n>0){ ctx.fillText(line.trim(),x,y); line=words[n]+' '; y+=lineH; }
        else line=test;
      }
      ctx.fillText(line.trim(),x,y);
    }

    /* ── Background — deep void with slow nebula ── */
    function drawBG(t) {
      /* Pure dark base */
      ctx.fillStyle = '#04030d';
      ctx.fillRect(0,0,W,H);

      /* Nebula clouds — very subtle, slow-moving */
      var nebulae = [
        {x: CX + Math.sin(t*0.11)*W*0.22, y: CY - H*0.32, r: W*0.7, c:'80,60,180', a:0.038},
        {x: CX - Math.cos(t*0.09)*W*0.18, y: CY + H*0.3,  r: W*0.65, c:'180,50,120', a:0.028},
        {x: CX + Math.cos(t*0.14)*W*0.1,  y: CY,            r: W*0.45, c:'50,120,200', a:0.020}
      ];
      nebulae.forEach(function(n) {
        var g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);
        g.addColorStop(0,'rgba('+n.c+','+n.a+')');
        g.addColorStop(0.5,'rgba('+n.c+','+(n.a*0.4)+')');
        g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      });

      /* Subtle grid — perspective vanishing to center */
      ctx.save();
      ctx.globalAlpha = 0.028;
      ctx.strokeStyle = '#7c6fcd';
      ctx.lineWidth   = 0.8;
      var gs = Math.max(W,H) / 14;
      /* Horizontal */
      for (var gy=0; gy<=H; gy+=gs) {
        ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke();
      }
      /* Vertical */
      for (var gx=0; gx<=W; gx+=gs) {
        ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke();
      }
      ctx.restore();

      /* Star field — static-ish micro dots */
      ctx.save(); ctx.globalAlpha=0.55;
      ctx.fillStyle='#fff';
      for (var si=0; si<38; si++) {
        var sx = ((si * 397 + 113) % W);
        var sy = ((si * 211 + 79)  % H);
        var sBright = 0.12 + 0.55*((Math.sin(t*0.7+si*1.3)*0.5+0.5));
        ctx.globalAlpha = sBright * 0.5;
        ctx.beginPath(); ctx.arc(sx, sy, 0.7+0.6*(si%3)*0.5, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    /* ═══════════════════════════════════════════════
       SCENE 1 — PHONE MOCKUP: Snap a question
    ═══════════════════════════════════════════════ */
    var s1T=0, s1Typed=0, s1Replied=false, s1TypeTimer=0;
    function initS1(){ s1T=0; s1Typed=0; s1Replied=false; s1TypeTimer=0; particles.length=0; }
    initS1();

    function drawS1(st,dt) {
      s1T+=dt;
      var ph=H*0.56, pw=ph*0.49;
      var px=CX-pw/2, py=CY-ph/2-H*0.03;

      /* Ambient glow behind phone */
      var aGlow=ctx.createRadialGradient(CX,CY,0,CX,CY,pw*1.4);
      aGlow.addColorStop(0,'rgba(124,58,237,0.12)');
      aGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=aGlow; ctx.fillRect(0,0,W,H);

      /* Phone shadow */
      ctx.save();
      ctx.shadowColor='rgba(100,60,220,0.55)';
      ctx.shadowBlur=55;
      ctx.shadowOffsetY=16;
      rr(px,py,pw,ph,20);
      ctx.fillStyle='#0e0c22'; ctx.fill();
      ctx.restore();

      /* Phone border gradient */
      ctx.save();
      var phoneBorder=ctx.createLinearGradient(px,py,px+pw,py+ph);
      phoneBorder.addColorStop(0,'rgba(167,139,250,0.35)');
      phoneBorder.addColorStop(0.5,'rgba(244,114,182,0.20)');
      phoneBorder.addColorStop(1,'rgba(139,92,246,0.30)');
      ctx.strokeStyle=phoneBorder; ctx.lineWidth=1.5;
      rr(px,py,pw,ph,20); ctx.stroke();
      ctx.restore();

      /* Notch */
      ctx.fillStyle='#0e0c22';
      rr(CX-14,py-1,28,10,5); ctx.fill();

      /* Screen bezel */
      ctx.save();
      rr(px+4,py+12,pw-8,ph-24,14);
      ctx.fillStyle='#07060f'; ctx.fill();
      ctx.restore();

      /* Status bar */
      ctx.save();
      ctx.fillStyle='rgba(167,139,250,0.07)';
      ctx.fillRect(px+4,py+12,pw-8,22);
      ctx.font='bold 7.5px "JetBrains Mono",monospace';
      ctx.textAlign='center'; ctx.fillStyle='rgba(255,255,255,0.22)';
      ctx.fillText('CrackAI', CX, py+27);
      /* Signal dots */
      for(var si2=0;si2<3;si2++){
        ctx.fillStyle='rgba(167,139,250,'+(0.3+si2*0.25)+')';
        ctx.fillRect(px+10+si2*6,py+20,4,5+si2*2);
      }
      ctx.restore();

      /* Chat area bg */
      ctx.save();
      rr(px+4,py+34,pw-8,ph-62,0); ctx.fillStyle='#07060f'; ctx.fill();
      ctx.restore();

      /* Question chip — user bubble */
      var bx=px+8, bw2=pw-16, by=py+44;
      ctx.save();
      /* Bubble bg */
      var bGrad=ctx.createLinearGradient(bx,by,bx,by+48);
      bGrad.addColorStop(0,'rgba(124,58,237,0.22)');
      bGrad.addColorStop(1,'rgba(124,58,237,0.12)');
      ctx.fillStyle=bGrad; ctx.strokeStyle='rgba(167,139,250,0.25)'; ctx.lineWidth=1;
      rr(bx,by,bw2,48,10); ctx.fill(); ctx.stroke();
      /* Label */
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.font='6px "JetBrains Mono",monospace';
      ctx.textAlign='left'; ctx.fillText('YOU', bx+8, by+12);
      /* Question text */
      ctx.fillStyle='rgba(248,247,255,0.88)';
      ctx.font='7px "Plus Jakarta Sans",sans-serif';
      wrapText('If 2x² + 5x - 3 = 0, find x', bx+8, by+26, bw2-16, 11);
      /* Camera icon */
      ctx.fillStyle='rgba(167,139,250,0.90)';
      ctx.shadowColor='#a78bfa'; ctx.shadowBlur=8;
      rr(bx+bw2-26, by+6, 18, 16, 4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='9px sans-serif';
      ctx.textAlign='center'; ctx.shadowBlur=0;
      ctx.fillText('📷', bx+bw2-17, by+18);
      /* Timestamp */
      ctx.fillStyle='rgba(255,255,255,0.18)';
      ctx.font='5px sans-serif';
      ctx.textAlign='right'; ctx.fillText('now', bx+bw2-5, by+44);
      ctx.restore();

      /* AI response or typing indicator */
      var ry=by+56;
      if (s1T < 2.2) {
        /* Typing dots */
        ctx.save();
        ctx.fillStyle='rgba(251,146,60,0.10)';
        rr(bx+bw2-48,ry,40,18,9); ctx.fill();
        for(var di=0;di<3;di++){
          var dp2=(s1T*2.2+di*0.45)%1;
          ctx.fillStyle='rgba(251,146,60,'+(0.35+dp2*0.65)+')';
          ctx.beginPath(); ctx.arc(bx+bw2-38+di*10, ry+9+Math.sin(s1T*4+di*1.1)*2.5, 2.2,0,TAU); ctx.fill();
        }
        ctx.restore();
      } else {
        if(!s1Replied){ s1Replied=true; burst(CX, CY, '#a78bfa', 12, 80); }
        /* AI response bubble */
        s1TypeTimer+=dt;
        var maxChars=42;
        s1Typed=Math.min(maxChars, Math.floor(s1TypeTimer*40));
        var ansText='x = 0.5 or x = -3 ✓ (discriminant = 25 + 24 = 49)';
        var shown=ansText.substring(0,s1Typed);

        ctx.save();
        var rGrad=ctx.createLinearGradient(bx,ry,bx,ry+52);
        rGrad.addColorStop(0,'rgba(251,146,60,0.18)');
        rGrad.addColorStop(1,'rgba(251,146,60,0.08)');
        ctx.fillStyle=rGrad; ctx.strokeStyle='rgba(251,146,60,0.28)'; ctx.lineWidth=1;
        rr(bx,ry,bw2-4,52,10); ctx.fill(); ctx.stroke();
        /* AI label */
        ctx.fillStyle='rgba(251,146,60,0.7)';
        ctx.font='6px "JetBrains Mono",monospace';
        ctx.textAlign='left'; ctx.fillText('CRACKAI ✦', bx+8, ry+12);
        /* Answer text */
        ctx.fillStyle='rgba(248,247,255,0.82)';
        ctx.font='7px "Plus Jakarta Sans",sans-serif';
        wrapText(shown, bx+8, ry+26, bw2-24, 11);
        /* Typing cursor */
        if(s1Typed<maxChars){
          ctx.fillStyle='rgba(251,146,60,0.9)';
          ctx.fillRect(bx+8+ctx.measureText(shown.split('\n').pop()).width+1, ry+20, 1.5, 9);
        }
        ctx.restore();
      }

      /* Home indicator */
      ctx.fillStyle='rgba(255,255,255,0.14)';
      rr(CX-18,py+ph-10,36,4,2); ctx.fill();

      /* Floating subject tags */
      var tags=[
        {t:'Algebra', c:'#a78bfa', ox:-pw*0.72, oy:-ph*0.18},
        {t:'Physics', c:'#f472b6', ox: pw*0.72, oy:-ph*0.06},
        {t:'SSC CGL', c:'#fb923c', ox:-pw*0.62, oy: ph*0.22}
      ];
      tags.forEach(function(tg,i) {
        var fx=CX+tg.ox+Math.sin(s1T*0.7+i*1.1)*5;
        var fy=CY+tg.oy+Math.cos(s1T*0.55+i*0.9)*3.5;
        var ta=0.5+Math.sin(s1T*0.8+i)*0.18;
        ctx.save(); ctx.globalAlpha=ta;
        ctx.fillStyle=tg.c+'18'; ctx.strokeStyle=tg.c+'50'; ctx.lineWidth=1;
        var tw=ctx.measureText(tg.t).width+18;
        rr(fx-tw/2,fy-10,tw,20,10); ctx.fill(); ctx.stroke();
        ctx.fillStyle=tg.c;
        ctx.font='bold 8px "Space Grotesk",sans-serif';
        ctx.textAlign='center'; ctx.fillText(tg.t,fx,fy+3);
        ctx.restore();
      });
      tickP(dt); drawP();
    }

    /* ═══════════════════════════════════════════════
       SCENE 2 — NEURAL ORB: AI intelligence visual
    ═══════════════════════════════════════════════ */
    var s2T=0;
    function initS2(){ s2T=0; particles.length=0; }

    function drawS2(st,dt) {
      s2T+=dt;
      var orbR=Math.min(W,H)*0.155;
      var pulse=Math.sin(s2T*1.8)*0.06;

      /* Wide soft halo */
      var halo=ctx.createRadialGradient(CX,CY,orbR*0.6,CX,CY,orbR*4);
      halo.addColorStop(0,'rgba(124,58,237,0.10)');
      halo.addColorStop(0.4,'rgba(167,139,250,0.05)');
      halo.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=halo; ctx.fillRect(0,0,W,H);

      /* Concentric pulse rings */
      for(var ri=0;ri<5;ri++){
        var rp=(s2T*0.65+ri*0.28)%1;
        var rrad=orbR*(1.1+rp*3.2);
        var ra=(1-rp)*0.18*(1+ri*0.05);
        ctx.save(); ctx.globalAlpha=ra;
        ctx.strokeStyle='rgba(139,92,246,1)'; ctx.lineWidth=1.2;
        ctx.shadowColor='#7c3aed'; ctx.shadowBlur=12;
        ctx.beginPath(); ctx.arc(CX,CY,rrad,0,TAU); ctx.stroke();
        ctx.restore();
      }

      /* Rotating energy rings */
      for(var eri=0;eri<3;eri++){
        var eAngle=s2T*0.9*(eri%2===0?1:-1)+eri*1.2;
        var eRx=orbR*(1.55+eri*0.22), eRy=orbR*(0.28+eri*0.06);
        ctx.save();
        ctx.translate(CX,CY); ctx.rotate(eAngle);
        ctx.scale(1, eRy/eRx);
        var eColor=['rgba(167,139,250,0.38)','rgba(244,114,182,0.28)','rgba(251,146,60,0.22)'][eri];
        ctx.strokeStyle=eColor; ctx.lineWidth=1.2+eri*0.3;
        ctx.shadowColor=['#a78bfa','#f472b6','#fb923c'][eri]; ctx.shadowBlur=14;
        ctx.beginPath(); ctx.arc(0,0,eRx,0,TAU); ctx.stroke();
        ctx.restore();
      }

      /* Orb body */
      var orbBodyG=ctx.createRadialGradient(CX-orbR*0.28,CY-orbR*0.3,orbR*0.04,CX,CY,orbR*(1+pulse));
      orbBodyG.addColorStop(0,'#f5f0ff');
      orbBodyG.addColorStop(0.08,'#d8b4fe');
      orbBodyG.addColorStop(0.28,'#7c3aed');
      orbBodyG.addColorStop(0.6,'#3b0764');
      orbBodyG.addColorStop(0.85,'#130528');
      orbBodyG.addColorStop(1,'#04030d');
      ctx.save();
      ctx.shadowColor='#a78bfa'; ctx.shadowBlur=50;
      ctx.fillStyle=orbBodyG;
      ctx.beginPath(); ctx.arc(CX,CY,orbR*(1+pulse),0,TAU); ctx.fill();
      /* Specular highlight */
      var specG=ctx.createRadialGradient(CX-orbR*0.30,CY-orbR*0.32,0,CX-orbR*0.18,CY-orbR*0.2,orbR*0.36);
      specG.addColorStop(0,'rgba(255,255,255,0.92)');
      specG.addColorStop(0.5,'rgba(220,200,255,0.30)');
      specG.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=specG;
      ctx.beginPath(); ctx.arc(CX-orbR*0.18,CY-orbR*0.2,orbR*0.36,0,TAU); ctx.fill();
      /* Rim light */
      var rimG=ctx.createRadialGradient(CX+orbR*0.35,CY+orbR*0.35,0,CX+orbR*0.35,CY+orbR*0.35,orbR*0.28);
      rimG.addColorStop(0,'rgba(244,114,182,0.40)');
      rimG.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=rimG;
      ctx.beginPath(); ctx.arc(CX+orbR*0.35,CY+orbR*0.35,orbR*0.28,0,TAU); ctx.fill();
      ctx.restore();

      /* Orbiting knowledge nodes */
      var NODES=[
        {a:0.0,  dist:0.40, label:'SSC',     c:'#a78bfa', emoji:'📘'},
        {a:1.26, dist:0.37, label:'Maths',   c:'#f472b6', emoji:'🧮'},
        {a:2.51, dist:0.39, label:'GK',      c:'#fb923c', emoji:'🌍'},
        {a:3.77, dist:0.36, label:'English', c:'#34d399', emoji:'📖'},
        {a:5.03, dist:0.38, label:'Science', c:'#38bdf8', emoji:'⚗️'}
      ];
      var maxOrbitR=Math.min(W,H)*0.44;
      NODES.forEach(function(n,ni) {
        var angle=n.a+s2T*0.52;
        var nx=CX+Math.cos(angle)*maxOrbitR*n.dist;
        var ny=CY+Math.sin(angle)*maxOrbitR*n.dist;

        /* Dashed connector */
        ctx.save(); ctx.globalAlpha=0.25+Math.sin(s2T*1.5+n.a)*0.08;
        ctx.strokeStyle=n.c; ctx.lineWidth=0.9; ctx.setLineDash([3,6]);
        ctx.beginPath(); ctx.moveTo(CX,CY); ctx.lineTo(nx,ny); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();

        /* Data packet */
        var pp=(s2T*0.75+ni*0.22)%1;
        var bpx=lerp(CX,nx,pp), bpy=lerp(CY,ny,pp);
        ctx.save(); ctx.globalAlpha=(1-Math.abs(pp-0.5)*2)*0.85;
        ctx.fillStyle=n.c; ctx.shadowColor=n.c; ctx.shadowBlur=12;
        ctx.beginPath(); ctx.arc(bpx,bpy,2.5,0,TAU); ctx.fill();
        ctx.restore();

        /* Node pill */
        var nr=18;
        ctx.save();
        ctx.shadowColor=n.c; ctx.shadowBlur=22;
        var nGrad=ctx.createRadialGradient(nx-nr*0.3,ny-nr*0.3,2,nx,ny,nr);
        nGrad.addColorStop(0,n.c+'cc');
        nGrad.addColorStop(1,n.c+'22');
        ctx.fillStyle=nGrad;
        ctx.strokeStyle=n.c+'88'; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.arc(nx,ny,nr,0,TAU); ctx.fill(); ctx.stroke();
        /* Label */
        ctx.fillStyle='#fff'; ctx.shadowBlur=0;
        ctx.font='bold 7px "Space Grotesk",sans-serif'; ctx.textAlign='center';
        ctx.fillText(n.label, nx, ny+2.5);
        ctx.restore();

        /* Pulse ring */
        var pp2=(s2T*0.9+ni*0.35)%1;
        ctx.save(); ctx.globalAlpha=(1-pp2)*0.28;
        ctx.strokeStyle=n.c; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.arc(nx,ny,nr+pp2*16,0,TAU); ctx.stroke();
        ctx.restore();
      });

      /* Accuracy badge */
      var badgeY=CY+Math.min(W,H)*0.3;
      ctx.save(); ctx.globalAlpha=0.92;
      var bG=ctx.createLinearGradient(CX-52,badgeY,CX+52,badgeY);
      bG.addColorStop(0,'rgba(124,58,237,0.22)');
      bG.addColorStop(1,'rgba(244,114,182,0.18)');
      ctx.fillStyle=bG; ctx.strokeStyle='rgba(167,139,250,0.40)'; ctx.lineWidth=1.2;
      rr(CX-52,badgeY-15,104,30,15); ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.font='bold 12px "Space Grotesk",sans-serif'; ctx.textAlign='center';
      ctx.fillText('⚡ 98% Accuracy · Real-time', CX, badgeY+4);
      ctx.restore();

      tickP(dt); drawP();
    }

    /* ═══════════════════════════════════════════════
       SCENE 3 — BATTLE ARENA: cinematic VS
    ═══════════════════════════════════════════════ */
    var s3T=0, s3Flash=0;
    function initS3(){ s3T=0; s3Flash=0; particles.length=0; }

    function drawS3(st,dt) {
      s3T+=dt;

      /* Arena glow split: left purple, right pink */
      var leftGlow=ctx.createRadialGradient(CX-W*0.28,CY,0,CX-W*0.28,CY,W*0.55);
      leftGlow.addColorStop(0,'rgba(124,58,237,0.10)');
      leftGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=leftGlow; ctx.fillRect(0,0,W,H);
      var rightGlow=ctx.createRadialGradient(CX+W*0.28,CY,0,CX+W*0.28,CY,W*0.55);
      rightGlow.addColorStop(0,'rgba(236,72,153,0.10)');
      rightGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=rightGlow; ctx.fillRect(0,0,W,H);

      /* Center divider line */
      ctx.save();
      var divG=ctx.createLinearGradient(CX,CY-H*0.28,CX,CY+H*0.28);
      divG.addColorStop(0,'rgba(255,255,255,0)');
      divG.addColorStop(0.5,'rgba(255,255,255,0.12)');
      divG.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=divG; ctx.lineWidth=1; ctx.setLineDash([6,8]);
      ctx.beginPath(); ctx.moveTo(CX,CY-H*0.28); ctx.lineTo(CX,CY+H*0.28); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();

      /* VS text */
      var vsS=1+Math.sin(s3T*2.5)*0.05;
      ctx.save();
      ctx.translate(CX,CY); ctx.scale(vsS,vsS);
      /* Glow behind VS */
      var vsGlow=ctx.createRadialGradient(0,0,0,0,0,55);
      vsGlow.addColorStop(0,'rgba(251,146,60,0.18)');
      vsGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=vsGlow; ctx.fillRect(-55,-55,110,110);
      /* VS text */
      ctx.font='bold 48px "Space Grotesk",sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      var vsG=ctx.createLinearGradient(-26,-20,26,20);
      vsG.addColorStop(0,'#fb923c'); vsG.addColorStop(1,'#f472b6');
      ctx.fillStyle=vsG;
      ctx.shadowColor='rgba(251,146,60,0.6)'; ctx.shadowBlur=35;
      ctx.fillText('VS', 0, 0);
      ctx.restore();

      /* Players */
      drawArenaPlayer(CX-W*0.27, CY, s3T, 'You',   '#a78bfa', 0.0,  '🎓');
      drawArenaPlayer(CX+W*0.27, CY, s3T, 'Rival', '#f472b6', 1.4,  '👤');

      /* Score bar */
      var scoreA=Math.min(Math.floor(s3T*22),260);
      var scoreB=Math.min(Math.floor(s3T*16),195);
      var sy=CY+Math.min(W,H)*0.30;
      ctx.save();
      ctx.fillStyle='rgba(4,3,13,0.7)';
      ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
      rr(CX-72,sy-16,144,32,16); ctx.fill(); ctx.stroke();
      ctx.font='bold 16px "Space Grotesk",sans-serif'; ctx.textAlign='center';
      ctx.fillStyle='#a78bfa'; ctx.fillText(scoreA, CX-26, sy+5);
      ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.font='11px "JetBrains Mono",monospace';
      ctx.fillText('·', CX, sy+5);
      ctx.fillStyle='#f472b6'; ctx.font='bold 16px "Space Grotesk",sans-serif';
      ctx.fillText(scoreB, CX+26, sy+5);
      ctx.restore();

      /* Lightning between players every ~0.5s */
      if (Math.floor(s3T*4)%2===0) {
        drawLightning(CX-W*0.12, CY-H*0.06, CX+W*0.12, CY+H*0.06);
      }

      tickP(dt); drawP();
    }
    function drawArenaPlayer(x,y,t,name,color,phase,emoji) {
      var scale=1+Math.sin(t*2.2+phase)*0.035;
      ctx.save();
      ctx.translate(x,y); ctx.scale(scale,scale);
      /* Outer ring pulse */
      var rp2=(t*1.1+phase)%1;
      ctx.globalAlpha=(1-rp2)*0.25;
      ctx.strokeStyle=color; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(0,0,42+rp2*12,0,TAU); ctx.stroke();
      ctx.globalAlpha=1;
      /* Shadow halo */
      ctx.shadowColor=color; ctx.shadowBlur=32;
      /* Avatar body */
      var ag=ctx.createRadialGradient(-10,-10,4,0,0,30);
      ag.addColorStop(0,color); ag.addColorStop(1,color+'33');
      ctx.fillStyle=ag;
      ctx.beginPath(); ctx.arc(0,0,28,0,TAU); ctx.fill();
      /* Inner border */
      ctx.strokeStyle=color+'cc'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(0,0,30,0,TAU); ctx.stroke();
      /* Emoji */
      ctx.font='17px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowBlur=0; ctx.fillText(emoji, 0, 1);
      /* Name */
      ctx.font='bold 9.5px "Space Grotesk",sans-serif';
      ctx.textBaseline='top'; ctx.fillStyle=color;
      ctx.shadowColor=color; ctx.shadowBlur=10;
      ctx.fillText(name, 0, 36);
      ctx.restore();
      /* HP bar */
      var bw3=58, bh=5, charge=clamp(0.25+Math.sin(t*1.4+phase)*0.35+0.45,0.2,1.0);
      ctx.save();
      ctx.fillStyle='rgba(255,255,255,0.06)'; rr(x-bw3/2,y+52,bw3,bh,3); ctx.fill();
      var barG=ctx.createLinearGradient(x-bw3/2,0,x+bw3/2,0);
      barG.addColorStop(0,color); barG.addColorStop(1,color+'66');
      ctx.fillStyle=barG; rr(x-bw3/2,y+52,bw3*charge,bh,3); ctx.fill();
      ctx.restore();
    }
    function drawLightning(x1,y1,x2,y2) {
      ctx.save();
      ctx.strokeStyle='rgba(253,224,71,0.85)'; ctx.lineWidth=2;
      ctx.shadowColor='#fde047'; ctx.shadowBlur=18;
      ctx.globalAlpha=0.75;
      var mx=(x1+x2)/2+rand(-10,10), my=(y1+y2)/2+rand(-8,8);
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(mx,my,x2,y2); ctx.stroke();
      ctx.lineWidth=0.8; ctx.globalAlpha=0.4;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx+rand(-12,12),my+rand(-12,12)); ctx.stroke();
      ctx.restore();
    }

    /* ═══════════════════════════════════════════════
       SCENE 4 — LEADERBOARD: rank achievement
    ═══════════════════════════════════════════════ */
    var s4T=0, s4Spawned=false;
    function initS4(){ s4T=0; s4Spawned=false; particles.length=0; }

    function drawS4(st,dt) {
      s4T+=dt;

      if(!s4Spawned && s4T>0.25){
        s4Spawned=true;
        var cols=['#a78bfa','#f472b6','#fb923c','#fde047','#34d399'];
        for(var ci=0;ci<40;ci++){
          spawnP(rand(W*0.1,W*0.9), rand(-30,10),
            rand(-35,35), rand(70,210),
            cols[rInt(0,cols.length)], rand(1.5,3.2), rand(3,8), 'dot');
        }
      }

      /* Crown glow */
      var cwY=CY-H*0.25;
      var cwGlow=ctx.createRadialGradient(CX,cwY,0,CX,cwY,80);
      cwGlow.addColorStop(0,'rgba(253,224,71,0.18)');
      cwGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=cwGlow; ctx.fillRect(0,0,W,H);

      /* Trophy */
      var ts=clamp(s4T/0.65,0,1);
      var bob=Math.sin(s4T*1.6)*4;
      ctx.save();
      ctx.translate(CX, cwY+bob);
      ctx.scale(eOut5(ts),eOut5(ts));
      ctx.font=Math.floor(Math.min(W,H)*0.13)+'px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='#fde047'; ctx.shadowBlur=55;
      ctx.fillText('🏆', 0, 0);
      ctx.restore();

      /* Leaderboard rows */
      var rows=[
        {rank:1, name:'You',     score:2480, c:'#fde047', emoji:'🥇', hl:true},
        {rank:2, name:'Aarav',   score:2340, c:'#c0c0c0', emoji:'🥈', hl:false},
        {rank:3, name:'Priya',   score:2210, c:'#cd7f32', emoji:'🥉', hl:false}
      ];
      var rowH=36, rowW=Math.min(W*0.78, 280), rowX=CX-rowW/2;
      var startY=CY-H*0.06;

      rows.forEach(function(row,ri) {
        var rowA=clamp((s4T-0.3-ri*0.18)/0.4,0,1);
        var rx=lerp(-rowW, rowX, eOut5(rowA));
        var ry=startY+ri*rowH*1.1;
        ctx.save();
        ctx.globalAlpha=rowA;
        /* Row bg */
        if(row.hl){
          var hlGrad=ctx.createLinearGradient(rx,ry,rx+rowW,ry+rowH-4);
          hlGrad.addColorStop(0,'rgba(253,224,71,0.18)');
          hlGrad.addColorStop(1,'rgba(251,146,60,0.12)');
          ctx.fillStyle=hlGrad;
          ctx.strokeStyle='rgba(253,224,71,0.45)'; ctx.lineWidth=1.2;
          ctx.shadowColor='rgba(253,224,71,0.3)'; ctx.shadowBlur=15;
        } else {
          ctx.fillStyle='rgba(255,255,255,0.04)';
          ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1;
          ctx.shadowBlur=0;
        }
        rr(rx,ry,rowW,rowH-4,10); ctx.fill(); ctx.stroke();
        /* Medal */
        ctx.font='14px sans-serif'; ctx.textAlign='left';
        ctx.fillText(row.emoji, rx+10, ry+rowH*0.6);
        /* Name */
        ctx.font=row.hl?'bold 12px "Space Grotesk",sans-serif':'12px "Space Grotesk",sans-serif';
        ctx.fillStyle=row.hl?'#fff':'rgba(255,255,255,0.62)';
        ctx.textBaseline='middle'; ctx.shadowBlur=0;
        ctx.fillText(row.name, rx+36, ry+rowH*0.5-2);
        /* Score */
        ctx.font='bold 12px "Space Grotesk",sans-serif';
        ctx.fillStyle=row.c; ctx.textAlign='right';
        ctx.fillText(row.score.toLocaleString('en-IN'), rx+rowW-12, ry+rowH*0.5-2);
        ctx.restore();
      });

      /* +XP badge */
      if(s4T>1.5){
        var xpA=clamp((s4T-1.5)/0.4,0,1);
        var xp=Math.floor(Math.min((s4T-1.5)/1.5,1)*500);
        ctx.save(); ctx.globalAlpha=xpA;
        var xpG=ctx.createLinearGradient(CX-44,0,CX+44,0);
        xpG.addColorStop(0,'#7c3aed'); xpG.addColorStop(1,'#f472b6');
        ctx.fillStyle=xpG; ctx.shadowColor='rgba(124,58,237,0.5)'; ctx.shadowBlur=18;
        rr(CX-44,CY+H*0.26,88,28,14); ctx.fill();
        ctx.fillStyle='#fff'; ctx.font='bold 12px "Space Grotesk",sans-serif';
        ctx.textAlign='center'; ctx.shadowBlur=0;
        ctx.fillText('+'+xp+' XP earned', CX, CY+H*0.26+18);
        ctx.restore();
      }
      tickP(dt); drawP();
    }

    /* ═══════════════════════════════════════════════
       SCENE 5 — STUDY NETWORK: live collaboration
    ═══════════════════════════════════════════════ */
    var s5T=0;
    function initS5(){ s5T=0; particles.length=0; }

    function drawS5(st,dt) {
      s5T+=dt;

      /* Hub glow */
      var hubGlow=ctx.createRadialGradient(CX,CY,0,CX,CY,W*0.35);
      hubGlow.addColorStop(0,'rgba(124,58,237,0.12)');
      hubGlow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=hubGlow; ctx.fillRect(0,0,W,H);

      var n=6, ringR=Math.min(W,H)*0.30;
      var COLORS=['#a78bfa','#f472b6','#fb923c','#34d399','#38bdf8','#fde047'];
      var EMOJIS=['🎓','👨‍💻','👩‍🎓','🧑‍🏫','📚','⚡'];
      var NAMES=['Arjun','Neha','Vikram','Siya','Rahul','Meera'];

      for(var gi=0;gi<n;gi++){
        var ga=gi*(TAU/n)-TAU/4+s5T*0.30;
        var gx=CX+Math.cos(ga)*ringR;
        var gy=CY+Math.sin(ga)*ringR;
        var gc=COLORS[gi];

        /* Connection to hub */
        var conA=0.18+Math.sin(s5T*1.2+gi)*0.08;
        ctx.save(); ctx.globalAlpha=conA;
        ctx.strokeStyle=gc; ctx.lineWidth=1.2; ctx.setLineDash([4,9]);
        ctx.shadowColor=gc; ctx.shadowBlur=4;
        ctx.beginPath(); ctx.moveTo(CX,CY); ctx.lineTo(gx,gy); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();

        /* Data flow along connection */
        var fp=(s5T*0.7+gi*0.18)%1;
        var fpx=lerp(CX,gx,fp), fpy=lerp(CY,gy,fp);
        ctx.save(); ctx.globalAlpha=(1-Math.abs(fp-0.5)*2)*0.75;
        ctx.fillStyle=gc; ctx.shadowColor=gc; ctx.shadowBlur=10;
        ctx.beginPath(); ctx.arc(fpx,fpy,2.5,0,TAU); ctx.fill();
        ctx.restore();

        /* Avatar node */
        ctx.save();
        ctx.shadowColor=gc; ctx.shadowBlur=20;
        var nodeG=ctx.createRadialGradient(gx-8,gy-8,3,gx,gy,20);
        nodeG.addColorStop(0,gc+'ee'); nodeG.addColorStop(1,gc+'28');
        ctx.fillStyle=nodeG; ctx.strokeStyle=gc+'88'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(gx,gy,20,0,TAU); ctx.fill(); ctx.stroke();
        ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowBlur=0; ctx.fillText(EMOJIS[gi],gx,gy);
        ctx.restore();

        /* Pulse ring */
        var pp3=(s5T*0.85+gi*0.2)%1;
        ctx.save(); ctx.globalAlpha=(1-pp3)*0.22;
        ctx.strokeStyle=gc; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.arc(gx,gy,20+pp3*16,0,TAU); ctx.stroke();
        ctx.restore();

        /* Name tag */
        ctx.save(); ctx.globalAlpha=0.55+Math.sin(s5T*0.6+gi)*0.12;
        ctx.fillStyle=gc;
        ctx.font='bold 7.5px "Space Grotesk",sans-serif';
        ctx.textAlign='center';
        ctx.fillText(NAMES[gi], gx, gy+32);
        ctx.restore();
      }

      /* Hub — central AI node */
      ctx.save();
      ctx.shadowColor='#a78bfa'; ctx.shadowBlur=40;
      var hubG=ctx.createRadialGradient(CX-10,CY-10,5,CX,CY,28);
      hubG.addColorStop(0,'#d8b4fe'); hubG.addColorStop(1,'#7c3aed');
      ctx.fillStyle=hubG;
      ctx.beginPath(); ctx.arc(CX,CY,28,0,TAU); ctx.fill();
      ctx.strokeStyle='rgba(167,139,250,0.6)'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(CX,CY,32,0,TAU); ctx.stroke();
      ctx.font='18px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowBlur=0; ctx.fillText('🤖',CX,CY);
      ctx.restore();

      /* Live message bubbles floating out */
      var MSGS=['Great answer! 🎉','Score: 94%','Level 8 reached','#1 in batch!'];
      MSGS.forEach(function(msg,mi){
        var mt=((s5T*0.55+mi*0.72)%1);
        var ma=mt<0.12?mt/0.12:mt>0.82?(1-(mt-0.82)/0.18):1;
        var angle=(mi*(TAU/4))+s5T*0.18;
        var mx2=CX+Math.cos(angle)*W*0.38;
        var my2=CY+Math.sin(angle)*H*0.32;
        ctx.save(); ctx.globalAlpha=ma*0.75;
        var mw=ctx.measureText(msg).width+20;
        ctx.fillStyle='rgba(124,58,237,0.18)'; ctx.strokeStyle='rgba(167,139,250,0.38)'; ctx.lineWidth=1;
        rr(mx2-mw/2,my2-10,mw,20,10); ctx.fill(); ctx.stroke();
        ctx.fillStyle='rgba(248,247,255,0.82)';
        ctx.font='7.5px "Plus Jakarta Sans",sans-serif';
        ctx.textAlign='center'; ctx.fillText(msg,mx2,my2+4);
        ctx.restore();
      });

      /* Active users counter */
      var uY=CY+Math.min(W,H)*0.30;
      ctx.save(); ctx.globalAlpha=0.85;
      ctx.fillStyle='rgba(124,58,237,0.12)'; ctx.strokeStyle='rgba(167,139,250,0.30)'; ctx.lineWidth=1.2;
      rr(CX-64,uY-14,128,28,14); ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.75)';
      ctx.font='bold 10.5px "Space Grotesk",sans-serif'; ctx.textAlign='center';
      ctx.fillText('👥 ' + (1243+Math.floor(s5T*3)) + ' students online', CX, uY+4);
      ctx.restore();

      tickP(dt); drawP();
    }

    /* ── Scenes registry ── */
    var SCENES=[
      {chip:'📷 Step 1', title:'Snap a <span class="hl">Question</span>', desc:'Photo, PDF or type — CrackAI understands everything', draw:drawS1, init:initS1},
      {chip:'🧠 Step 2', title:'<span class="hl">AI Solves</span> It Live', desc:'Step-by-step reasoning · 98% accuracy · Hindi & English', draw:drawS2, init:initS2},
      {chip:'⚔️ Step 3', title:'Enter the <span class="hl">Arena</span>', desc:'Challenge friends. Answer faster. Climb the ranks', draw:drawS3, init:initS3},
      {chip:'🏆 Step 4', title:'You <span class="hl">Ranked #1</span>', desc:'Track streaks, earn XP, and unlock achievements daily', draw:drawS4, init:initS4},
      {chip:'👥 Step 5', title:'Live <span class="hl">Study Network</span>', desc:'1,200+ groups active right now — learn together, win together', draw:drawS5, init:initS5}
    ];

    var sceneIdx=0, sceneElapsed=0, SCENE_DUR=8.0;
    var fadingOut=false, transAlpha=1, nextSceneIdx=0;

    var chipEl   = document.getElementById('cai-scene-chip');
    var titleEl  = document.getElementById('cai-scene-title');
    var descEl   = document.getElementById('cai-scene-desc');
    var statsEl2 = document.getElementById('cai-live-stats');
    var dotsEl   = document.getElementById('cai-scene-dots');
    var dotsAll  = dotsEl ? dotsEl.querySelectorAll('.cai-dot') : [];

    function showHUD(idx){
      var sc=SCENES[idx];
      [chipEl,titleEl,descEl,statsEl2,dotsEl].forEach(function(el){ el && el.classList.remove('show'); });
      setTimeout(function(){
        if(chipEl)  chipEl.textContent=sc.chip;
        if(titleEl) titleEl.innerHTML=sc.title;
        if(descEl)  descEl.textContent=sc.desc.replace(/<[^>]+>/g,'');
        [chipEl,titleEl,descEl,statsEl2,dotsEl].forEach(function(el){ el && el.classList.add('show'); });
        dotsAll.forEach(function(d,i){ d.classList.toggle('active',i===idx); });
      }, 230);
    }
    showHUD(0);

    /* ── Main render loop ── */
    var elapsed2=0, lastTs2=null, rafId2=null;

    function renderLoop(ts){
      rafId2=requestAnimationFrame(renderLoop);
      var authEl2=document.getElementById('authScreen');
      if(authEl2 && authEl2.classList.contains('hidden')) return;

      if(!lastTs2) lastTs2=ts;
      var dt=Math.min((ts-lastTs2)/1000,0.05);
      lastTs2=ts; elapsed2+=dt;
      sceneElapsed+=dt;

      /* Scene transition */
      if(sceneElapsed>=SCENE_DUR && !fadingOut){
        fadingOut=true;
        nextSceneIdx=(sceneIdx+1)%SCENES.length;
      }
      if(fadingOut){
        transAlpha=Math.max(0,transAlpha-dt*3.5);
        if(transAlpha<=0){
          sceneIdx=nextSceneIdx; sceneElapsed=0;
          fadingOut=false; transAlpha=0;
          SCENES[sceneIdx].init();
          showHUD(sceneIdx);
        }
      } else {
        transAlpha=Math.min(1,transAlpha+dt*3.2);
      }

      /* Progress bar */
      if(statusFill) statusFill.style.width=(Math.min(sceneElapsed/SCENE_DUR,1)*100)+'%';

      ctx.clearRect(0,0,W,H);
      drawBG(elapsed2);
      ctx.save();
      ctx.globalAlpha=transAlpha;
      SCENES[sceneIdx].draw(sceneElapsed,dt);
      ctx.restore();
    }

    /* Start after splash exits or after 200ms */
    function startAnim(){
      if(!rafId2) renderLoop(performance.now());
    }
    setTimeout(startAnim,200);
    var splashObs2=new MutationObserver(function(ml){
      ml.forEach(function(){
        if(!document.getElementById('sscIntroOverlay')){ splashObs2.disconnect(); startAnim(); }
      });
    });
    splashObs2.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

})();