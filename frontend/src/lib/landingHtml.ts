// Auto-generated from client HTML mockup. Static markup only — interactivity wired in React.
export const LANDING_HTML = `
<div id="prog" style="pointer-events:none"></div>

<!-- NAV -->
<nav id="nav">
 <div class="nav-in">
  <button class="nav-logo" data-onclick="sTo(0)">
   <div class="nav-hex">⬡</div>
   <div class="nav-wordmark">AI<span>inBox</span></div>
  </button>
  <div class="nav-center">
   <button class="nl" data-num="01" data-onclick="sTo('#services')">Strategy</button>
   <button class="nl" data-num="02" data-onclick="sTo('#workshops')">Workshops</button>
   <button class="nl" data-num="03" data-onclick="sTo('#csuite')">Packages</button>
   <button class="nl" data-num="04" data-onclick="sTo('#pricing')">Pricing</button>
   <button class="nl" data-num="05" data-onclick="sTo('#contact')">Contact</button>
  </div>
  <button class="nav-btn" data-onclick="sTo('#services')">Start free →</button>
 </div>
</nav>

<!-- TICKER -->
<div id="ticker">
 <div class="tk-track">
  <div class="tk-item"><span class="tk-dot"></span> AI CONSULTING <strong class="hi">$72.8B BY 2030</strong></div>
  <div class="tk-item">CAGR <strong class="hi">31.6%</strong></div>
  <div class="tk-item">SME SEGMENT <strong class="hi">35.9% CAGR</strong> — FASTEST GROWING</div>
  <div class="tk-item">86% OF BUYERS SEEK AI-ENABLED FIRMS · IBM 2025</div>
  <div class="tk-item">ACCENTURE GENAI FY25 <strong class="hi">$5.9B</strong></div>
  <div class="tk-item">BCG AI REVENUE <strong class="hi">40% OF TOTAL</strong> 2026</div>
  <div class="tk-item">66% WILL LEAVE FIRMS NOT DELIVERING AI</div>
  <div class="tk-item"><span class="tk-dot"></span> AI CONSULTING <strong class="hi">$72.8B BY 2030</strong></div>
  <div class="tk-item">CAGR <strong class="hi">31.6%</strong></div>
  <div class="tk-item">SME SEGMENT <strong class="hi">35.9% CAGR</strong> — FASTEST GROWING</div>
  <div class="tk-item">86% OF BUYERS SEEK AI-ENABLED FIRMS · IBM 2025</div>
  <div class="tk-item">ACCENTURE GENAI FY25 <strong class="hi">$5.9B</strong></div>
  <div class="tk-item">BCG AI REVENUE <strong class="hi">40% OF TOTAL</strong> 2026</div>
  <div class="tk-item">66% WILL LEAVE FIRMS NOT DELIVERING AI</div>
 </div>
</div>

<!-- HERO -->
<section id="hero">
 <div class="hero-grid"></div>
 <div class="hero-left-rule"></div>
 <div class="wrap" style="position:relative;z-index:1;width:100%">

  <!-- HERO 2-COL: copy left, video right -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;min-height:70vh;padding:80px 0 40px">

   <!-- LEFT: copy -->
   <div>
    <div class="hero-badge r">
   <span class="tk-dot" style="margin-right:8px"></span>
   <span class="hero-eyebrow" style="color:var(--silver);letter-spacing:.12em">ENTERPRISE AI TRANSFORMATION &nbsp;·&nbsp; EST. 2026</span>
  </div>
  <h1 class="h1 r" data-d="1" style="margin-bottom:30px;max-width:860px">
   The AI edge<br>
   your competitors<br>
   <em class="accent">don't have yet.</em>
  </h1>
  <p class="body-lg r" data-d="2" style="margin-bottom:40px;max-width:420px;font-size:18px;line-height:1.8;color:var(--silver)">Board-ready strategy in 60 seconds. Executive design sprints. Full-scale deployment. Built for enterprise leaders the Big 4 are too expensive to serve.</p>
  <div class="hero-actions r" data-d="3" id="hero-cta">
   <button class="btn btn-w btn-lg" data-onclick="sTo('#services')">Build your strategy <span class="btn-arrow">→</span></button>
   <button class="btn btn-o btn-lg" data-onclick="sTo('#workshops')">Book a workshop</button>
  </div>
  <p class="hero-note r" data-d="4" style="margin-top:12px">
   <span class="tk-dot"></span> Free · No credit card · PDF in 60 seconds
  </p>
   </div>

   <!-- RIGHT: video sphere + orbital system -->
   <div style="position:relative;display:flex;align-items:center;justify-content:center;min-height:560px">

    <!-- Ambient glow behind sphere -->
    <div style="position:absolute;width:520px;height:520px;border-radius:50%;
      background:radial-gradient(circle,rgba(201,150,58,.12) 0%,rgba(88,166,255,.05) 45%,transparent 70%);
      filter:blur(20px);animation:heroGlow 4s ease-in-out infinite"></div>

    <!-- Outer orbital rings -->
    <div class="hero-orb-ring" style="position:absolute;width:520px;height:520px;border-radius:50%;border:1px solid rgba(201,150,58,.14);animation:orbRotate 22s linear infinite"></div>
    <div class="hero-orb-ring" style="position:absolute;width:440px;height:440px;border-radius:50%;border:1px solid rgba(88,166,255,.12);animation:orbRotate 16s linear infinite reverse"></div>
    <div style="position:absolute;width:380px;height:380px;border-radius:50%;border:1px dashed rgba(201,150,58,.1);animation:orbRotate 30s linear infinite"></div>
    <div style="position:absolute;width:340px;height:340px;border-radius:50%;border:1px solid rgba(188,140,255,.08);animation:orbRotate 10s linear infinite reverse"></div>

    <!-- Orbital dots travelling the rings -->
    <div style="position:absolute;width:520px;height:520px;animation:orbRotate 22s linear infinite">
     <div style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:9px;height:9px;border-radius:50%;background:var(--gold);box-shadow:0 0 16px rgba(201,150,58,.9),0 0 30px rgba(201,150,58,.4)"></div>
    </div>
    <div style="position:absolute;width:440px;height:440px;animation:orbRotate 16s linear infinite reverse">
     <div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 14px rgba(88,166,255,.9),0 0 28px rgba(88,166,255,.4)"></div>
    </div>
    <div style="position:absolute;width:520px;height:520px;animation:orbRotate 28s linear infinite reverse">
     <div style="position:absolute;top:50%;right:-3px;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--violet);box-shadow:0 0 12px rgba(188,140,255,.9)"></div>
    </div>
    <div style="position:absolute;width:380px;height:380px;animation:orbRotate 14s linear infinite">
     <div style="position:absolute;top:50%;left:-3px;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:var(--jade);box-shadow:0 0 10px rgba(63,185,80,.9)"></div>
    </div>

    <!-- THE SPHERE — video viewport -->
    <div style="position:relative;width:360px;height:360px;border-radius:50%;overflow:hidden;
      border:1px solid rgba(201,150,58,.3);
      box-shadow:0 0 80px rgba(201,150,58,.18),0 0 160px rgba(88,166,255,.08),
      inset 0 0 60px rgba(0,0,0,.5),0 0 0 6px rgba(13,17,23,.6),0 0 0 7px rgba(201,150,58,.15);
      animation:videoPulse 4s ease-in-out infinite">

     <!-- Video -->
     <video autoplay muted loop playsinline
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:1">
      <source src="/hero-sphere.mp4" type="video/mp4"/>
     </video>

     <!-- Cinematic vignette -->
     <div style="position:absolute;inset:0;z-index:2;pointer-events:none;
       background:radial-gradient(circle at center,transparent 50%,rgba(7,9,13,.55) 100%)"></div>
     <!-- Specular highlight -->
     <div style="position:absolute;top:8%;left:18%;width:40%;height:30%;z-index:3;pointer-events:none;
       background:radial-gradient(ellipse,rgba(255,255,255,.12) 0%,transparent 70%);
       border-radius:50%;filter:blur(8px)"></div>
     <!-- Inner ring edge -->
     <div style="position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:50%;
       box-shadow:inset 0 0 30px rgba(201,150,58,.15),inset 0 2px 20px rgba(255,255,255,.06)"></div>
    </div>

    <!-- Floating label chips around sphere -->
    <div style="position:absolute;top:8%;left:-2%;background:rgba(13,17,23,.85);backdrop-filter:blur(10px);
      border:1px solid rgba(201,150,58,.25);border-radius:8px;padding:8px 12px;z-index:5;
      animation:chipFloat 5s ease-in-out infinite">
     <div style="font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:var(--gold)">⚡ 60-SECOND STRATEGY</div>
    </div>
    <div style="position:absolute;bottom:12%;right:-4%;background:rgba(13,17,23,.85);backdrop-filter:blur(10px);
      border:1px solid rgba(88,166,255,.25);border-radius:8px;padding:8px 12px;z-index:5;
      animation:chipFloat 6s ease-in-out infinite 1s">
     <div style="font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:var(--cyan)">🔓 UNLOCKED VALUE</div>
    </div>
    <div style="position:absolute;bottom:24%;left:-6%;background:rgba(13,17,23,.85);backdrop-filter:blur(10px);
      border:1px solid rgba(63,185,80,.25);border-radius:8px;padding:8px 12px;z-index:5;
      animation:chipFloat 5.5s ease-in-out infinite .5s">
     <div style="font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:var(--jade)">📈 5.8× ROI</div>
   </div>

  </div>

  <!-- STATS ROW below 2-col -->
  <div class="scroll-cue" aria-hidden="true"><div class="scroll-cue-line"></div><span style="font-family:var(--mono);font-size:8px;letter-spacing:.15em;color:var(--zinc)">SCROLL</span></div>
  <div class="stats r" data-d="4">
   <div class="stat"><div class="stat-n" style="color:var(--amber)">$72.8B</div><div class="stat-l">Market 2030</div></div>
   <div class="stat"><div class="stat-n" style="color:var(--cyan)">31.6%</div><div class="stat-l">Sector CAGR</div></div>
   <div class="stat"><div class="stat-n" style="color:var(--jade)">86%</div><div class="stat-l">Buyers want AI firms</div></div>
   <div class="stat"><div class="stat-n" style="color:var(--violet)">6</div><div class="stat-l">Transformation stages</div></div>
   <div class="stat"><div class="stat-n" style="color:var(--rose)">95%</div><div class="stat-l">Pilots fail without guidance</div></div>
  </div>
 </div>
</div>
</section>
<!-- TRUST STRIP -->
<div style="padding:28px 48px;border-top:1px solid var(--lead);background:rgba(13,17,23,.4);backdrop-filter:blur(12px)">
 <div style="max-width:1240px;margin:0 auto">
  <p style="font-family:var(--mono);font-size:9px;letter-spacing:.18em;color:var(--mist);text-transform:uppercase;margin-bottom:18px;text-align:center">Enterprise-grade AI infrastructure · Security · Compliance · Scale</p>
  <div style="display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap;opacity:.5">
   <div style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--silver);display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="3"/><path d="M20 30 L28 38 L40 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
    Enterprise Security
   </div>
   <div style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--silver);display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="44" height="44" rx="6" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="30" r="8" fill="currentColor"/></svg>
    Global Edge Network
   </div>
   <div style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--silver);display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 60 60" fill="none"><path d="M30 8 L52 20 L52 40 L30 52 L8 40 L8 20 Z" stroke="currentColor" stroke-width="3"/></svg>
    McKinsey · BCG Benchmarks
   </div>
   <div style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--silver);display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 60 60" fill="none"><path d="M10 50 L30 10 L50 50 Z" stroke="currentColor" stroke-width="3" fill="none"/><circle cx="30" cy="32" r="5" fill="currentColor"/></svg>
    Multimodal AI Cascade
   </div>
   <div style="font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--silver);display:flex;align-items:center;gap:8px">
    <svg width="14" height="14" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="20" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="30" r="8" fill="currentColor"/></svg>
    PCI-Compliant Payments
   </div>
  </div>
 </div>
</div>

<!-- STRATEGY SECTION -->
<!-- CINEMATIC VIDEO SECTION -->
<section style="padding:0;border-top:1px solid var(--lead);background:#000;overflow:hidden;position:relative">

 <!-- Ambient glow -->
 <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
   width:900px;height:500px;pointer-events:none;
   background:radial-gradient(ellipse,rgba(201,150,58,.1) 0%,transparent 70%)"></div>

 <div style="position:relative;max-width:1100px;margin:0 auto;padding:80px 48px">

  <!-- Section label -->
  <div style="text-align:center;margin-bottom:44px">
   <div class="label" style="color:rgba(201,150,58,.5);margin-bottom:14px;
     display:flex;align-items:center;justify-content:center;gap:12px;letter-spacing:.22em">
    <span style="width:32px;height:1px;background:rgba(201,150,58,.3);display:inline-block"></span>
    AETHER INTELLIGENCE
    <span style="width:32px;height:1px;background:rgba(201,150,58,.3);display:inline-block"></span>
   </div>
   <div style="font-family:var(--serif);font-size:clamp(28px,3.5vw,52px);font-weight:200;
     color:#fff;letter-spacing:-.015em;line-height:1.1">
    Intelligence, <em style="color:#C9963A;font-style:italic">crystallised.</em>
   </div>
  </div>

  <!-- VIDEO SHOWCASE — autoplay, looping -->
  <div style="position:relative;max-width:680px;margin:0 auto;border-radius:14px;
    overflow:hidden;box-shadow:0 0 140px rgba(201,150,58,.18),
    0 50px 120px rgba(0,0,0,.85),0 0 0 1px rgba(201,150,58,.25)">

   <video autoplay muted loop playsinline
     style="width:100%;height:auto;display:block">
    <source src="/hero-sphere.mp4" type="video/mp4"/>
   </video>

   <!-- Cinematic vignette overlay -->
   <div style="position:absolute;inset:0;pointer-events:none;
     background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.45) 100%);
     box-shadow:inset 0 0 80px rgba(0,0,0,.5)"></div>

   <!-- Corner accents -->
   <div style="position:absolute;top:14px;left:14px;width:24px;height:24px;
     border-top:1.5px solid rgba(201,150,58,.5);border-left:1.5px solid rgba(201,150,58,.5);
     border-radius:3px 0 0 0;pointer-events:none"></div>
   <div style="position:absolute;top:14px;right:14px;width:24px;height:24px;
     border-top:1.5px solid rgba(201,150,58,.5);border-right:1.5px solid rgba(201,150,58,.5);
     border-radius:0 3px 0 0;pointer-events:none"></div>
   <div style="position:absolute;bottom:14px;left:14px;width:24px;height:24px;
     border-bottom:1.5px solid rgba(201,150,58,.5);border-left:1.5px solid rgba(201,150,58,.5);
     border-radius:0 0 0 3px;pointer-events:none"></div>
   <div style="position:absolute;bottom:14px;right:14px;width:24px;height:24px;
     border-bottom:1.5px solid rgba(201,150,58,.5);border-right:1.5px solid rgba(201,150,58,.5);
     border-radius:0 0 3px 0;pointer-events:none"></div>

   <!-- Live badge -->
   <div style="position:absolute;top:18px;left:50%;transform:translateX(-50%);
     display:flex;align-items:center;gap:7px;background:rgba(0,0,0,.55);
     backdrop-filter:blur(10px);border:1px solid rgba(201,150,58,.25);
     border-radius:100px;padding:5px 14px;pointer-events:none">
    <span class="tk-dot"></span>
    <span style="font-family:var(--mono);font-size:8px;letter-spacing:.16em;color:rgba(255,255,255,.7)">AI IN A BOX</span>
   </div>
  </div>

  <!-- Caption -->
  <p style="text-align:center;font-family:var(--mono);font-size:9px;letter-spacing:.14em;
    color:var(--zinc);margin-top:24px">
   STRATEGIC CONSULTING &nbsp;·&nbsp; ROBUST DEVELOPMENT &nbsp;·&nbsp; SEAMLESS DEPLOYMENT
  </p>

  <!-- CTA -->
  <div style="display:flex;justify-content:center;margin-top:24px">
   <button class="btn btn-a btn-lg" data-onclick="sTo('#services');showTier('a')">
    Generate your strategy free <span class="btn-arrow">→</span>
   </button>
  </div>

 </div>
</section>



<section class="section" id="services" style="border-top:1px solid var(--lead)">
<div class="wrap">
 <div class="sh r">
  <div class="sh-label"><div class="sh-label-line"></div><span class="label"><span style="color:var(--amber);margin-right:8px;font-family:var(--mono)">01</span>Three Strategy Tiers</span></div>
  <div class="sh-title">Instant. Custom. <em class="accent">Function.</em></div>
  <p class="sh-sub">Free instant strategy powered by live web research. Paid tiers built from your specific questionnaire — pointed, not generic.</p>
 </div>
 <div class="tier-nav r">
  <button class="tier-btn on" id="tt-a" data-onclick="showTier('a')">
   <span class="tier-btn-name">⚡ Instant</span>
   <span class="tier-btn-meta">60 seconds · PDF · Web research</span>
   <span class="tier-btn-meta" style="color:var(--amber)">FREE</span>
  </button>
  <button class="tier-btn" id="tt-b" data-onclick="showTier('b')">
   <span class="tier-btn-name">🎯 Custom</span>
   <span class="tier-btn-meta">Questionnaire · Pointed · In-depth</span>
   <span class="tier-btn-meta" style="color:var(--amber)">$2,500</span>
  </button>
  <button class="tier-btn" id="tt-c" data-onclick="showTier('c')">
   <span class="tier-btn-name">🔧 Function</span>
   <span class="tier-btn-meta">Finance / HR / Ops / Sales / IT</span>
   <span class="tier-btn-meta" style="color:var(--amber)">$5,000</span>
  </button>
 </div>

 <!-- TIER A: INSTANT -->
 <div id="tier-a" class="tier-panel on">
  <div class="strat-grid">
   <div class="strat-sidebar">
    <div class="strat-card">
     <span class="strat-card-label label" style="color:var(--amber)">⚡ Free Instant Strategy</span>
     <p class="body-sm" style="margin-bottom:20px;font-weight:300">Enter your company and industry. We search the web live for your sector's AI landscape, competitor moves, and proven use cases — then generate a board-ready PDF in under 60 seconds.</p>
     <div class="s-field"><label class="s-lbl">Company Name *</label><input id="ia-co" class="s-in" placeholder="e.g. Tata Steel, HDFC Bank…" data-oninput="iaCheck()"/></div>
     <div class="s-field"><label class="s-lbl">Industry *</label>
      <select id="ia-ind" class="s-in" data-onchange="iaCheck()">
       <option value="">Select industry…</option>
       <option>Manufacturing</option><option>Banking &amp; Financial Services</option>
       <option>Healthcare &amp; Pharma</option><option>Retail &amp; E-commerce</option>
       <option>Agriculture &amp; Agri-tech</option><option>Technology &amp; SaaS</option>
       <option>Energy &amp; Utilities</option><option>Logistics &amp; Supply Chain</option>
       <option>Automotive</option><option>Real Estate &amp; Construction</option>
       <option>Education &amp; Ed-tech</option><option>Hospitality &amp; Travel</option>
       <option>Media &amp; Entertainment</option><option>Telecommunications</option>
       <option>Consumer Goods &amp; FMCG</option>
      </select>
     </div>
     <div class="s-field" style="margin-bottom:22px"><label class="s-lbl">Company Size</label>
      <select id="ia-sz" class="s-in">
       <option value="">Optional…</option>
       <option>Startup — under 100 employees</option><option>SME — 100 to 500 employees</option>
       <option>Mid-market — 500 to 5,000 employees</option><option>Enterprise — 5,000 to 50,000 employees</option>
       <option>Large Enterprise — 50,000+ employees</option>
      </select>
     </div>
     <button id="ia-btn" data-onclick="runInstant()" class="btn btn-w" style="width:100%;justify-content:center;opacity:.4;pointer-events:none" disabled>Generate strategy <span class="btn-arrow">→</span></button>
     <p style="text-align:center;font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:var(--zinc);margin-top:9px">FREE · NO CREDIT CARD · PDF INCLUDED</p>
     <div style="margin-top:12px;padding:10px;background:rgba(88,166,255,.05);border:1px solid rgba(88,166,255,.15);border-radius:5px;text-align:center">
      <div style="margin-top:12px;padding:12px;background:rgba(88,166,255,.05);border:1px solid rgba(88,166,255,.12);border-radius:5px;text-align:center">
      <div style="font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--cyan);margin-bottom:10px">MULTIMODAL AI CASCADE</div>
      <div id="cascade-anim" style="display:flex;justify-content:center;align-items:center;gap:6px;height:32px">
       <div class="casc-node" style="width:8px;height:8px;border-radius:50%;background:var(--jade);animation:cascPulse 1.8s ease infinite"></div>
       <div class="casc-line" style="width:16px;height:1px;background:linear-gradient(90deg,var(--jade),var(--cyan));animation:cascFlow 1.8s ease infinite"></div>
       <div class="casc-node" style="width:8px;height:8px;border-radius:50%;background:var(--cyan);animation:cascPulse 1.8s .4s ease infinite"></div>
       <div class="casc-line" style="width:16px;height:1px;background:linear-gradient(90deg,var(--cyan),var(--violet));animation:cascFlow 1.8s .4s ease infinite"></div>
       <div class="casc-node" style="width:10px;height:10px;border-radius:50%;background:var(--violet);box-shadow:0 0 8px rgba(188,140,255,.6);animation:cascPulse 1.8s .8s ease infinite"></div>
      </div>
     </div>
      <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap">
       <span style="font-size:10px;color:var(--zinc)">Classify</span>
       <span style="font-size:10px;color:var(--zinc)">→</span>
       <span style="font-size:10px;color:var(--zinc)">Research</span>
       <span style="font-size:10px;color:var(--zinc)">→</span>
       <span style="font-size:10px;color:var(--zinc)">Generate</span>
      </div>
     </div>
    </div>
   </div>
   <div>
    <div class="out-empty" id="ia-empty">
     <div class="out-empty-icon">⚡</div>
     <div class="out-empty-h">Your strategy appears here</div>
     <p class="out-empty-p">We search the web live for your sector's AI landscape, then build your high-level strategy.</p>
     <div class="out-meta">
      <div><div class="out-meta-n" style="color:var(--amber)">60s</div><div class="out-meta-l">Generation</div></div>
      <div><div class="out-meta-n" style="color:var(--jade)">PDF</div><div class="out-meta-l">Free download</div></div>
      <div><div class="out-meta-n" style="color:var(--cyan)">Live</div><div class="out-meta-l">Web research</div></div>
     </div>
    </div>
    <div id="ia-loading" style="display:none;border:1px solid var(--lead);border-radius:8px;padding:26px">
     <div class="label" style="margin-bottom:14px">Generating your strategy…</div>
     <div id="ia-steps"></div>
     <div class="prog"><div id="ia-bar" class="prog-fill" style="width:0%"></div></div>
    </div>
    <div id="ia-result"></div>
   </div>
  </div>
 </div>

 <!-- TIER B: CUSTOM -->
 <div id="tier-b" class="tier-panel">
  <div class="strat-grid">
   <div>
    <div class="step-bar">
     <div class="st-item active" id="cbs-0"><div class="st-n">1</div><div class="st-l">Organisation</div></div>
     <div class="st-line" id="cbl-0"></div>
     <div class="st-item" id="cbs-1"><div class="st-n">2</div><div class="st-l">AI Maturity</div></div>
     <div class="st-line" id="cbl-1"></div>
     <div class="st-item" id="cbs-2"><div class="st-n">3</div><div class="st-l">Objectives</div></div>
     <div class="st-line" id="cbl-2"></div>
     <div class="st-item" id="cbs-3"><div class="st-n">4</div><div class="st-l">Constraints</div></div>
     <div class="st-line" id="cbl-3"></div>
     <div class="st-item" id="cbs-4"><div class="st-n">5</div><div class="st-l">Your Strategy</div></div>
    </div>
    <div id="cb-body"></div>
   </div>
   <div class="strat-sidebar">
    <div class="sc">
     <div class="lock-badge">🔒 PAID STRATEGY</div>
     
     <div class="h4 serif" style="margin-bottom:9px">Why Custom?</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">The Instant strategy gives you the sector view. Custom is built around <em style="color:var(--paper)">your specific organisation</em> — your data maturity, leadership, constraints. No two outputs are the same.</p>
     <div class="sc-feat">50+ org-specific dimensions analysed</div>
     <div class="sc-feat">Competitor benchmarking in your exact segment</div>
     <div class="sc-feat">Use cases ranked by your data readiness</div>
     <div class="sc-feat">Budget model tuned to your investment signals</div>
     <div class="sc-feat">30-min expert review call included</div>
     <div style="height:1px;background:var(--lead);margin:16px 0"></div>
     <div class="sc-price">$2,500</div>
     <div class="sc-price-note">ONE-TIME · PDF + EXPERT CALL</div>
     <div class="sc-cta-rail" id="cb-cta-rail">Complete the questionnaire to unlock</div>
    </div>
   </div>
  </div>
 </div>

 <!-- TIER C: FUNCTION -->
 <div id="tier-c" class="tier-panel">
  <div class="strat-grid">
   <div>
    <div id="fc-pick">
     <p class="label" style="margin-bottom:14px">Select your function to begin</p>
     <div class="fn-grid">
      <button class="fn-card" data-onclick="pickFn(this,'Finance')"><span class="fn-icon">💰</span><div class="fn-name">Finance</div><div class="fn-role">CFO · FP&amp;A · Treasury</div></button>
      <button class="fn-card" data-onclick="pickFn(this,'HR')"><span class="fn-icon">👥</span><div class="fn-name">People &amp; HR</div><div class="fn-role">CHRO · Talent · L&amp;D</div></button>
      <button class="fn-card" data-onclick="pickFn(this,'Operations')"><span class="fn-icon">⚙️</span><div class="fn-name">Operations</div><div class="fn-role">COO · Supply Chain · Quality</div></button>
      <button class="fn-card" data-onclick="pickFn(this,'Sales &amp; Marketing')"><span class="fn-icon">📣</span><div class="fn-name">Sales &amp; Marketing</div><div class="fn-role">CMO · Revenue · CX</div></button>
      <button class="fn-card" data-onclick="pickFn(this,'IT &amp; Technology')"><span class="fn-icon">🏗️</span><div class="fn-name">IT &amp; Technology</div><div class="fn-role">CIO · CTO · Data</div></button>
      <button class="fn-card" data-onclick="pickFn(this,'Customer Experience')"><span class="fn-icon">⭐</span><div class="fn-name">Customer Experience</div><div class="fn-role">Service · Support · NPS</div></button>
     </div>
    </div>
    <div id="fc-qs"></div>
   </div>
   <div class="strat-sidebar">
    <div class="sc">
     <div class="lock-badge">🔒 PAID STRATEGY</div>
     
     <div class="h4 serif" style="margin-bottom:9px">Function-specific.<br>Deeply tailored.</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">A pointed AI strategy for one function, built on exactly how that function operates in your organisation.</p>
     <div class="sc-feat">6 targeted function-specific questions</div>
     <div class="sc-feat">200+ use cases filtered to your context</div>
     <div class="sc-feat">Ranked by data readiness + effort + ROI</div>
     <div class="sc-feat">Vendor shortlist for your current stack</div>
     <div class="sc-feat">12-month implementation roadmap</div>
     <div style="height:1px;background:var(--lead);margin:16px 0"></div>
     <div class="sc-price">$5,000</div>
     <div class="sc-price-note">PER FUNCTION · PDF + EXPERT REVIEW</div>
     <div class="sc-cta-rail" id="fc-cta-rail">Select a function above to begin</div>
    </div>
   </div>
  </div>
 </div>
</div>
</section>

<!-- WORKSHOPS -->
<section class="section" id="workshops" style="background:var(--onyx)">
<div class="wrap">
 <div class="sh r">
  <div class="sh-label"><div class="sh-label-line"></div><span class="label"><span style="color:var(--amber);margin-right:8px;font-family:var(--mono)">02</span>Executive Workshops</span></div>
  <div class="sh-title">Where strategy becomes <em class="accent">action.</em></div>
  <p class="sh-sub">Immersive design-thinking experiences for leadership teams. Based on the Google Ventures Design Sprint methodology, reimagined for AI strategy.</p>
 </div>

 <!-- FLAGSHIP: AI DESIGN SPRINT -->
 <div class="ws-hero r">
  <div class="ws-hero-top">

   <!-- LEFT: copy -->
   <div class="ws-hero-left">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(230,147,58,.08);border:1px solid rgba(230,147,58,.2);border-radius:100px;padding:5px 14px 5px 10px;margin-bottom:22px">
     <span class="tk-dot"></span>
     <span class="label" style="color:var(--amber)">Flagship Programme</span>
    </div>
    <div class="h3 serif" style="margin-bottom:16px;font-size:clamp(28px,3vw,44px)">AI Strategy<br><em class="accent">Design Sprint</em></div>
    <p class="body-lg" style="margin-bottom:24px;max-width:440px">A 2-day immersive workshop for your executive team. Map, explore, decide, and prototype your AI strategy — in the room, together. Leave with a validated, board-ready roadmap your whole leadership team owns.</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:28px">
     <div class="body-sm" style="display:flex;align-items:center;gap:10px"><span style="color:var(--jade);font-size:11px">✓</span>Pre-workshop AI maturity assessment for every participant</div>
     <div class="body-sm" style="display:flex;align-items:center;gap:10px"><span style="color:var(--jade);font-size:11px">✓</span>Expert facilitation by certified design thinking practitioners</div>
     <div class="body-sm" style="display:flex;align-items:center;gap:10px"><span style="color:var(--jade);font-size:11px">✓</span>Real-time AI strategy generation using our live platform</div>
     <div class="body-sm" style="display:flex;align-items:center;gap:10px"><span style="color:var(--jade);font-size:11px">✓</span>Board-ready AI strategy deck delivered within 48 hours</div>
     <div class="body-sm" style="display:flex;align-items:center;gap:10px"><span style="color:var(--jade);font-size:11px">✓</span>30-day post-workshop implementation support included</div>
    </div>
    <!-- Price + tags -->
    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:8px">
     <div class="h3 serif" style="font-size:clamp(28px,3vw,44px);color:var(--amber)">$14,500</div>
     <div class="label">Per workshop</div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
     <span class="tag tag-jade">2 days</span>
     <span class="tag tag-cyan">Up to 12 executives</span>
     <span class="tag tag-violet">Board deck in 48hrs</span>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
     <button class="btn btn-a btn-lg" data-workshop="sprint" data-onclick="bookWorkshop('sprint')">Book this workshop <span class="btn-arrow">→</span></button>
     <button class="btn btn-o" data-onclick="sTo('#contact')">Request brochure</button>
    </div>
   </div>

   <!-- RIGHT: 2-day agenda -->
   <div class="ws-hero-right">
    <div class="label" style="color:var(--amber);margin-bottom:20px;display:flex;align-items:center;gap:8px">
     <span style="width:14px;height:1px;background:var(--amber);display:inline-block"></span>
     2-Day Agenda
    </div>

    <div class="ws-agenda-item">
     <div class="ws-agenda-lbl">Day 1</div>
     <div>
      <div class="ws-agenda-title">Map &amp; Explore</div>
      <div class="ws-agenda-desc">AI landscape briefing · Competitor threat analysis · AI maturity scoring live · Opportunity identification across functions · Priority matrix workshop</div>
     </div>
    </div>

    <div class="ws-agenda-item">
     <div class="ws-agenda-lbl">Day 1</div>
     <div>
      <div class="ws-agenda-title">Sketch &amp; Decide</div>
      <div class="ws-agenda-desc">Use case deep-dives · Business case development · Live AI strategy generation · Leadership voting and alignment · Priority selection</div>
     </div>
    </div>

    <div class="ws-agenda-item">
     <div class="ws-agenda-lbl">Day 2</div>
     <div>
      <div class="ws-agenda-title">Prototype &amp; Validate</div>
      <div class="ws-agenda-desc">Roadmap prototyping · Investment framework build · Risk and governance planning · Executive team alignment · Implementation planning</div>
     </div>
    </div>

    <div class="ws-agenda-item">
     <div class="ws-agenda-lbl">Post</div>
     <div>
      <div class="ws-agenda-title">Board Deck Delivery</div>
      <div class="ws-agenda-desc">Polished board-ready AI strategy deck delivered within 48 hours · Full action plan · Budget framework · 30-day follow-up call included</div>
     </div>
    </div>

    <!-- Stats bar -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--lead);border-radius:7px;overflow:hidden;margin-top:20px">
     <div style="padding:14px 12px;text-align:center">
      <div style="font-family:var(--serif);font-size:22px;font-weight:200;color:var(--amber)">100%</div>
      <div class="label" style="font-size:8px">NPS positive</div>
     </div>
     <div style="padding:14px 12px;text-align:center;border-left:1px solid var(--lead);border-right:1px solid var(--lead)">
      <div style="font-family:var(--serif);font-size:22px;font-weight:200;color:var(--jade)">48hr</div>
      <div class="label" style="font-size:8px">Strategy delivery</div>
     </div>
     <div style="padding:14px 12px;text-align:center">
      <div style="font-family:var(--serif);font-size:22px;font-weight:200;color:var(--cyan)">12</div>
      <div class="label" style="font-size:8px">Execs per sprint</div>
     </div>
    </div>
   </div>
  </div>
 </div>

 <!-- OTHER WORKSHOP CARDS -->
 <div class="ws-cards r">
  <div class="ws-card" style="padding:28px">
   <span class="ws-icon">⚡</span>
   <div class="label" style="color:var(--cyan);margin-bottom:6px">Half-day · Up to 15 executives</div>
   <div class="h4 serif" style="margin-bottom:10px">AI Accelerator</div>
   <p class="body-sm" style="margin-bottom:16px">High-intensity 4-hour session. AI opportunity mapping, top 3 use cases with business cases, executive briefing pack delivered same day.</p>
   <div style="font-family:var(--serif);font-size:26px;font-weight:200;color:var(--cyan);margin-bottom:14px">$4,200</div>
   <button class="btn btn-o btn-sm" data-workshop="accelerator" data-onclick="bookWorkshop('accelerator')">Book →</button>
  </div>

  <div class="ws-card" style="padding:28px">
   <span class="ws-icon">🎯</span>
   <div class="label" style="color:var(--violet);margin-bottom:6px">2 hours · Board &amp; investors</div>
   <div class="h4 serif" style="margin-bottom:10px">Board AI Briefing</div>
   <p class="body-sm" style="margin-bottom:16px">Structured briefing on the AI imperative, competitive landscape, and what your organisation must do now. Investor-grade content and framing.</p>
   <div style="font-family:var(--serif);font-size:26px;font-weight:200;color:var(--violet);margin-bottom:14px">$1,800</div>
   <button class="btn btn-o btn-sm" data-workshop="briefing" data-onclick="bookWorkshop('briefing')">Book →</button>
  </div>

  <div class="ws-card" style="padding:28px">
   <span class="ws-icon">🏅</span>
   <div class="label" style="color:var(--jade);margin-bottom:6px">5 days · Cross-functional team</div>
   <div class="h4 serif" style="margin-bottom:10px">AI Innovation Lab</div>
   <p class="body-sm" style="margin-bottom:16px">Full Google Ventures Design Sprint reimagined for AI. From problem to validated AI prototype in 5 days. Map, sketch, decide, prototype, test.</p>
   <div style="font-family:var(--serif);font-size:26px;font-weight:200;color:var(--jade);margin-bottom:14px">$30,000</div>
   <button class="btn btn-o btn-sm" data-workshop="lab" data-onclick="bookWorkshop('lab')">Book →</button>
  </div>
 </div>
</div>
</section>


<section class="section" id="csuite" style="background:var(--abyss);border-top:1px solid var(--rim)">
<div class="wrap">
 <div class="sh">
  <span class="sh-label" style="color:var(--gold)">C-SUITE PACKAGES — FULL DETAIL</span>
  <div class="sh-title">Every package. Every deliverable.<br>Every outcome.</div>
  <p class="sh-sub">Role-specific AI transformation — purpose-built for each executive function. Click any package to explore in full.</p>
 </div>

 <!-- Package tabs -->
 <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:28px" id="pkg-tabs">
  <button class="pkg-tab on" data-onclick="showPkg(this,'chro')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid rgba(157,110,255,.35);background:rgba(157,110,255,.1);color:var(--violet);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">👥 CHRO</button>
  <button class="pkg-tab" data-onclick="showPkg(this,'cfo')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--rim);background:transparent;color:var(--mist);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">💰 CFO</button>
  <button class="pkg-tab" data-onclick="showPkg(this,'coo')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--rim);background:transparent;color:var(--mist);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">⚙️ COO</button>
  <button class="pkg-tab" data-onclick="showPkg(this,'cio')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--rim);background:transparent;color:var(--mist);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">🏗️ CIO</button>
  <button class="pkg-tab" data-onclick="showPkg(this,'cmo')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--rim);background:transparent;color:var(--mist);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">📣 CMO</button>
  <button class="pkg-tab" data-onclick="showPkg(this,'ceo')" style="padding:10px 20px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--rim);background:transparent;color:var(--mist);cursor:pointer;font-family:Outfit,sans-serif;transition:all .2s">🎯 CEO</button>
 </div>

 <!-- CHRO Package -->
 <div id="pkg-chro" class="pkg-detail on">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:var(--violet)10;border:1px solid var(--violet)40;border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:var(--violet)20;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">👥</div>
     <div class="label" style="color:var(--violet);margin-bottom:7px">CHRO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief HR Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">The complete People AI programme. From assessing workforce readiness to building an AI-native culture. Every talent process, reimagined with AI.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--violet)">$30,000</div>
     <div class="sc-price-note">COMPLETE PROGRAMME</div>
     <button class="btn btn-a" style="width:100%;justify-content:center;margin-top:12px" data-onclick="sTo('#contact')">Book discovery call <span class="btn-arrow">→</span></button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🎯</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Talent Readiness Assessment</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Individual AI skill gap analysis by role. Organisational AI maturity heatmap. Role-at-risk assessment. Learning needs analysis. Leadership AI capability scorecard. Benchmark vs industry peers.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🤖</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI-Powered Recruitment Engine</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI screening of CVs and applications at 10× speed. Predictive fit scoring against your top performers. Bias reduction framework. AI interview assist for structured questions. Time-to-hire reduced 40–60%.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📊</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Skills Gap & Learning Platform</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-generated personalised learning paths per role. Real-time skills inventory across the organisation. Automated L&D content curation. Completion and effectiveness tracking. 30–45% improvement in L&D retention.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🔮</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Predictive Attrition & Retention AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">85–90% accuracy in predicting who will leave 3 months ahead. Flight risk dashboards per manager. Early intervention triggers. Personalised retention actions per employee. Reduce voluntary attrition 20–30%.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🎓</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Culture & Innovation Programme</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI hackathons and innovation labs. AI champions network across functions. Lunch & learn series for all levels. AI showcase events. Change management playbook. Build an organisation that wants to use AI.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">⚡</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">HR Operations Automation</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI chatbot handling 60–75% of tier-1 HR queries. Document generation automation (offer letters, policies). AI-assisted performance review process. Payroll anomaly detection. Free up HR team for strategic work.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid var(--violet)30;border-radius:7px;padding:22px;background:var(--violet)07">
     <div class="label" style="color:var(--violet);margin-bottom:12px">Delivery & Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">40%</div><div class="label" style="font-size:8px">Faster hiring</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">85%</div><div class="label" style="font-size:8px">Attrition accuracy</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">75%</div><div class="label" style="font-size:8px">Query deflection</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">12wk</div><div class="label" style="font-size:8px">To first results</div></div>
     </div>
    </div>
   </div>
  </div>
</div>

<div id="pkg-cfo" class="pkg-detail">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:var(--jade)10;border:1px solid var(--jade)40;border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:var(--jade)20;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">💰</div>
     <div class="label" style="color:var(--jade);margin-bottom:7px">CFO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief Financial Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">Transform Finance from backward-looking reporting to forward-looking AI-driven intelligence. Faster close. Better forecasts. Fraud caught before it costs.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--jade)">$25,000</div>
     <div class="sc-price-note">COMPLETE PROGRAMME</div>
     <button class="btn btn-a" style="width:100%;justify-content:center;margin-top:12px" data-onclick="sTo('#contact')">Book discovery call <span class="btn-arrow">→</span></button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📈</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Financial Forecasting</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI revenue forecasting 12 months ahead with confidence intervals. AI cash flow prediction — 90-day rolling. P&L scenario modelling (3 scenarios in 60 seconds). Budget vs actuals root cause analysis. Ask your P&L anything in natural language.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🛡️</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Fraud Detection & Risk</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Real-time transaction anomaly detection. Vendor fraud and duplicate payment scanning. AI credit risk scoring for customers and suppliers. Regulatory compliance monitoring. 30–50% reduction in fraud losses within 6 months.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">⚡</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Month-End Close Acceleration</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-automated journal entry matching and reconciliation. Intercompany elimination AI. Automated variance commentary generation. Close checklist AI assistant. Reduce month-end close from 10+ days to under 5 days.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📋</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Regulatory Reporting AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-generated board packs and MIS reports. Automated SEBI/RBI regulatory filings. GST reconciliation AI. Transfer pricing documentation AI. 40–60% reduction in reporting effort with 99.2% accuracy.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🔍</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Cost Intelligence</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Automated spend categorisation and analysis. AI contract review for cost leakage. Vendor performance AI scoring. Zero-based budgeting AI support. Identifies 8–15% cost reduction opportunities typically hidden in data.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--jade)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🎯</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">CFO Command Dashboard</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Real-time financial intelligence in one view. AI-generated daily CFO briefing. Cash position, forecasts, risk alerts — all live. Natural language drill-down. Decision support before every board and leadership meeting.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid var(--jade)30;border-radius:7px;padding:22px;background:var(--jade)07">
     <div class="label" style="color:var(--jade);margin-bottom:12px">Delivery & Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--jade)">60%</div><div class="label" style="font-size:8px">Close time reduction</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--jade)">30%</div><div class="label" style="font-size:8px">Fraud loss reduction</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--jade)">99%</div><div class="label" style="font-size:8px">Reporting accuracy</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--jade)">8-15%</div><div class="label" style="font-size:8px">Cost savings found</div></div>
     </div>
    </div>
   </div>
  </div>
</div>

<div id="pkg-coo" class="pkg-detail">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:var(--gold)10;border:1px solid var(--gold)40;border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:var(--gold)20;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">⚙️</div>
     <div class="label" style="color:var(--gold);margin-bottom:7px">COO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief Operating Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">From reactive and manual to predictive and intelligent. Every machine, every process, every supply chain decision — augmented and optimised by AI.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--gold)">$32,000</div>
     <div class="sc-price-note">COMPLETE PROGRAMME</div>
     <button class="btn btn-a" style="width:100%;justify-content:center;margin-top:12px" data-onclick="sTo('#contact')">Book discovery call <span class="btn-arrow">→</span></button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🔧</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Predictive Maintenance AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Sensor-driven failure prediction 14+ days ahead. Real-time equipment health monitoring. AI-optimised maintenance scheduling. Spare parts demand prediction. Root cause analysis AI. 20–35% reduction in unplanned downtime (GE/Siemens benchmarks).</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🏭</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Quality & Defect Detection AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Computer vision inspection at line speed. 99.1%+ defect detection accuracy (vs 87% human baseline). Real-time SPC and process control AI. Supplier quality AI scoring. 40–60% reduction in defect escape rate.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📦</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Supply Chain Intelligence</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI demand forecasting across SKUs and channels. Supplier risk monitoring and early warning. Dynamic safety stock optimisation. AI-powered S&OP process. 15–25% inventory reduction with fewer stockouts.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📊</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Production Scheduling AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-optimised production sequencing and scheduling. Constraint-based planning with real-time updates. Bottleneck prediction and elimination. Energy consumption optimisation. 8–15% OEE improvement on average.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🚛</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Logistics & Distribution AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Route optimisation AI (15–20% fuel reduction). Last-mile delivery prediction. Warehouse slotting and pick path AI. Fleet maintenance prediction. Real-time logistics control tower with AI alerts.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--gold)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🎯</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">COO Operations Dashboard</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Real-time OEE, quality, and supply chain in one view. AI-generated daily ops briefing. Exception-based alerts — only what needs attention. Drill-down to root cause in 2 clicks. Weekly AI performance report for leadership.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid var(--gold)30;border-radius:7px;padding:22px;background:var(--gold)07">
     <div class="label" style="color:var(--gold);margin-bottom:12px">Delivery & Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--gold)">35%</div><div class="label" style="font-size:8px">Downtime reduction</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--gold)">99%</div><div class="label" style="font-size:8px">Quality accuracy</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--gold)">15%</div><div class="label" style="font-size:8px">Inventory savings</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--gold)">10%</div><div class="label" style="font-size:8px">OEE improvement</div></div>
     </div>
    </div>
   </div>
  </div>
</div>

<div id="pkg-cio" class="pkg-detail">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:var(--cyan)10;border:1px solid var(--cyan)40;border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:var(--cyan)20;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">🏗️</div>
     <div class="label" style="color:var(--cyan);margin-bottom:7px">CIO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief Information Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">Design the technology foundation for an AI-native enterprise. Architecture, data platform, vendor selection, MLOps, and AI governance — the complete CIO blueprint.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--cyan)">$35,000</div>
     <div class="sc-price-note">COMPLETE PROGRAMME</div>
     <button class="btn btn-a" style="width:100%;justify-content:center;margin-top:12px" data-onclick="sTo('#contact')">Book discovery call <span class="btn-arrow">→</span></button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🗺️</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Architecture Blueprint</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Current state technology audit and AI readiness scoring. Target architecture for AI-native enterprise. Data platform design (lake, warehouse, or lakehouse). API and integration layer design. Cloud strategy for AI workloads. Vendor shortlist for your stack.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🔒</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Security & Threat Intelligence</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-powered SIEM and threat detection. Anomaly-based intrusion detection. Security co-pilot for SOC team. Automated incident response playbooks. 31% fewer critical incidents, 28% faster MTTR (industry benchmark).</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">💻</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Developer Productivity Platform</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">GitHub Copilot or equivalent deployment. AI code review and security scanning. AI test generation. Developer workflow automation. 40–55% productivity increase documented across teams (GitHub research).</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">⚡</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Data Platform & MLOps</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Data engineering pipeline automation. Feature store design and build. Model deployment and monitoring (MLOps). AI model performance tracking. Data quality monitoring AI. From model training to production in days, not months.</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🤖</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Service Desk & IT Automation</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-powered IT service desk deflecting 40–60% of tickets. Automated password reset, access provisioning, incident triage. AI knowledge base that learns from every ticket. $1M+ annual savings at enterprise scale (Moveworks benchmark).</p>
     </div><div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--cyan)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📋</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Governance & Compliance Framework</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Enterprise AI policy and acceptable use framework. AI risk management and model audit trail. DPDP Act 2023 compliance for AI systems. SEBI/RBI AI governance for financial institutions. AI vendor assessment framework. Board-ready AI governance report.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid var(--cyan)30;border-radius:7px;padding:22px;background:var(--cyan)07">
     <div class="label" style="color:var(--cyan);margin-bottom:12px">Delivery & Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--cyan)">55%</div><div class="label" style="font-size:8px">Dev productivity</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--cyan)">40%</div><div class="label" style="font-size:8px">Ticket deflection</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--cyan)">31%</div><div class="label" style="font-size:8px">Fewer incidents</div></div><div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--cyan)">8wk</div><div class="label" style="font-size:8px">To first deploy</div></div>
     </div>
    </div>
   </div>
  </div>
</div>

<div id="pkg-cmo" class="pkg-detail">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:rgba(240,136,62,.06);border:1px solid rgba(240,136,62,.25);border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:rgba(240,136,62,.12);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">📣</div>
     <div class="label" style="color:var(--amber);margin-bottom:7px">CMO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief Marketing Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">AI personalisation at scale. Revenue attribution. Content intelligence. Built for the marketing leader who needs to prove ROI on every rupee.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--amber)">$28,000</div>
     <div class="sc-price-note">COMPLETE CMO AI PROGRAMME</div>
     <button class="btn btn-a" style="width:100%;justify-content:center;margin-top:12px" data-onclick="sTo('#contact')">Book discovery call →</button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🎯</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Personalisation Engine</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">1-to-1 personalisation across email, web, app and ads. AI segments and serves the right message to the right customer at the right moment. 3–5× engagement uplift.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🧠</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Customer Intelligence Platform</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">360° customer view — transaction history, behaviour signals, NPS, CLV prediction. Segment your entire customer base automatically. Know who will churn before they do.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📊</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Campaign Optimisation AI</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI allocates budget in real time across channels. Tests 100s of creative variants. Identifies winning combinations and scales them automatically. 20–40% CAC reduction.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">✍️</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Content AI Studio</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">AI-generated content at brand voice. Blog, social, email, ads — all on-brand, on-message. SEO-optimised. 10× your content output with 30% of the team.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">💰</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Marketing ROI Attribution</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Multi-touch attribution across every channel. Know exactly which spend is driving revenue. Prove marketing ROI to the board with data no CFO can argue with.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--amber)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📈</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Brand & Social Intelligence</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Real-time brand sentiment monitoring across social, news, and reviews. AI surfaces reputation risks before they escalate. Competitive share-of-voice tracking daily.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid var(--lead);border-radius:7px;padding:22px;background:rgba(240,136,62,.04)">
     <div class="label" style="color:var(--amber);margin-bottom:12px">Delivery & Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--amber)">3–5×</div><div class="label" style="font-size:8px">Engagement lift</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--amber)">40%</div><div class="label" style="font-size:8px">CAC reduction</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--amber)">10×</div><div class="label" style="font-size:8px">Content output</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--amber)">12wk</div><div class="label" style="font-size:8px">To first results</div></div>
     </div>
    </div>
   </div>
  </div>
</div>

<div id="pkg-ceo" class="pkg-detail">
  <div style="display:grid;grid-template-columns:320px 1fr;gap:32px;align-items:start">
   <div>
    <div style="background:rgba(188,140,255,.06);border:1px solid rgba(188,140,255,.25);border-radius:8px;padding:26px;position:sticky;top:76px">
     <div style="width:48px;height:48px;border-radius:8px;background:rgba(188,140,255,.12);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px">🎯</div>
     <div class="label" style="color:var(--violet);margin-bottom:7px">CEO PACKAGE</div>
     <div class="h4 serif" style="margin-bottom:5px">Chief Executive Officer</div>
     <p class="body-sm" style="margin-bottom:16px;font-weight:300">The complete CEO AI transformation package. Board narrative. Investment thesis. Competitive mapping. A 5-year AI vision that wins investors, aligns leadership, and compounds growth.</p>
     <div style="height:1px;background:var(--lead);margin-bottom:14px"></div>
     <div class="sc-price" style="color:var(--violet)">$40,000</div>
     <div class="sc-price-note">THE FLAGSHIP CEO PROGRAMME</div>
     <button class="btn" style="width:100%;justify-content:center;margin-top:12px;background:var(--violet);color:var(--ink);font-weight:600" data-onclick="sTo('#contact')">Book discovery call →</button>
    </div>
   </div>
   <div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">📋</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Board AI Strategy Deck</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Board-ready AI strategy presentation built for your company. Investment case, use case roadmap, risk framework, milestones, success metrics. Delivered in 48 hours. Updated quarterly.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🗺️</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Competitive AI Mapping</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Live intelligence on where your top 10 competitors are with AI. Their investments, use cases, talent, and published results. Updated monthly. Know who is ahead and by how far.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">💡</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Investment Thesis</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Structured investment case for your AI programme. ROI model per use case. Capital allocation framework. Phased investment plan aligned to risk appetite and growth objectives.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🏆</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">Executive AI Coaching</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Monthly 1:1 sessions with a senior AI strategist. Deep-dive on AI trends in your sector. Coaching on communicating AI to your board, investors, and leadership team. Peer benchmarking.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🔬</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">5-Year AI Transformation Roadmap</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Phase-by-phase AI transformation roadmap with milestones, KPIs, investment gates. Aligned to your 3-year strategic plan. Quarterly reviews and recalibration included.</p>
     </div>
     <div style="background:var(--carbon);border:1px solid var(--lead);border-radius:7px;padding:22px;transition:border-color .2s" data-onmouseover="this.style.borderColor='var(--violet)'" data-onmouseout="this.style.borderColor='var(--lead)'">
      <div style="font-size:20px;margin-bottom:10px">🛡️</div>
      <div style="font-family:var(--serif);font-size:16px;font-weight:300;margin-bottom:8px">AI Governance Framework</div>
      <p style="font-size:12px;color:var(--silver);line-height:1.65;font-weight:300">Enterprise AI governance policy. Ethics board setup. Risk management framework. Regulatory compliance (SEBI, RBI, DPDP Act). Investor and auditor-ready AI documentation.</p>
     </div>
    </div>
    <div style="margin-top:16px;border:1px solid rgba(188,140,255,.2);border-radius:7px;padding:22px;background:rgba(188,140,255,.04)">
     <div class="label" style="color:var(--violet);margin-bottom:12px">What a CEO AI Package delivers</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">48hr</div><div class="label" style="font-size:8px">Board deck ready</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">5yr</div><div class="label" style="font-size:8px">Transformation plan</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">12</div><div class="label" style="font-size:8px">Monthly coaching sessions</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">∞</div><div class="label" style="font-size:8px">Competitive intelligence</div></div>
     </div>
    </div>
   
    <div style="margin-top:16px;border:1px solid rgba(188,140,255,.2);border-radius:7px;padding:22px;background:rgba(188,140,255,.04)">
     <div class="label" style="color:var(--violet);margin-bottom:12px">Delivery &amp; Outcomes</div>
     <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center">
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">48hr</div><div class="label" style="font-size:8px">Board deck ready</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">5yr</div><div class="label" style="font-size:8px">Transformation plan</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">12</div><div class="label" style="font-size:8px">Coaching sessions</div></div>
      <div><div style="font-family:var(--serif);font-size:26px;font-weight:300;color:var(--violet)">∞</div><div class="label" style="font-size:8px">Competitive intel</div></div>
     </div>
    </div></div>
  </div>
</div>

</div>
</section>
<!-- TESTIMONIALS -->
<section class="section" id="testimonials">
<div class="wrap">
 <div class="sh r" style="text-align:center">
  <div class="sh-label" style="justify-content:center"><div class="sh-label-line"></div><span class="label"><span style="color:var(--amber);margin-right:8px;font-family:var(--mono)">04</span>Client Results</span><div class="sh-label-line"></div></div>
  <div class="sh-title">Trusted by enterprise leaders<br>across <em class="accent">India and beyond.</em></div>
 </div>

 <div class="testi-grid r">
  <div class="testi">
   <span class="testi-mark">&ldquo;</span>
   <p class="testi-q">AI in a Box gave us a board-ready AI strategy before our Monday board meeting. What would have taken a Big 4 firm six weeks, we had in 60 minutes. The Design Sprint brought our entire leadership team into alignment for the first time.</p>
   <div class="testi-by">
    <div class="testi-av">AK</div>
    <div>
     <div class="testi-name">Aditya Kumar</div>
     <div class="testi-role">CIO · ₹3,200Cr Manufacturing Group</div>
    </div>
   </div>
  </div>

  <div class="testi">
   <span class="testi-mark">&ldquo;</span>
   <p class="testi-q">The CFO AI Package transformed how our Finance function operates. Month-end close went from 12 days to 4. The fraud detection AI caught ₹2.3Cr in anomalies in the first quarter. Exceptional ROI, exceptional team.</p>
   <div class="testi-by">
    <div class="testi-av">PS</div>
    <div>
     <div class="testi-name">Priya Sharma</div>
     <div class="testi-role">CFO · 8,000-employee Financial Services Firm</div>
    </div>
   </div>
  </div>

  <div class="testi">
   <span class="testi-mark">&ldquo;</span>
   <p class="testi-q">We tried three Big 4 firms. All delivered generic decks. AI in a Box delivered a Custom Strategy that was built around our actual data systems, our team, our budget. It felt like a strategy written by someone who knew our business.</p>
   <div class="testi-by">
    <div class="testi-av">RM</div>
    <div>
     <div class="testi-name">Rahul Mehta</div>
     <div class="testi-role">CEO · ₹1,800Cr Retail Chain · Mumbai</div>
    </div>
   </div>
  </div>
 </div>

 <!-- RESULTS STRIP -->
 <div class="r" style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--lead);border-radius:10px;overflow:hidden;margin-top:40px">
  <div style="padding:24px;text-align:center;border-right:1px solid var(--lead)">
   <div style="font-family:var(--serif);font-size:32px;font-weight:200;color:var(--amber);margin-bottom:4px">5.8×</div>
   <div class="label">Average AI ROI (McKinsey 2025)</div>
  </div>
  <div style="padding:24px;text-align:center;border-right:1px solid var(--lead)">
   <div style="font-family:var(--serif);font-size:32px;font-weight:200;color:var(--jade);margin-bottom:4px">100%</div>
   <div class="label">Client satisfaction score</div>
  </div>
  <div style="padding:24px;text-align:center;border-right:1px solid var(--lead)">
   <div style="font-family:var(--serif);font-size:32px;font-weight:200;color:var(--cyan);margin-bottom:4px">60s</div>
   <div class="label">Free strategy generation</div>
  </div>
  <div style="padding:24px;text-align:center">
   <div style="font-family:var(--serif);font-size:32px;font-weight:200;color:var(--violet);margin-bottom:4px">95%</div>
   <div class="label">Cheaper than Big 4</div>
  </div>
 </div>
</div>
</section>

<!-- PRICING -->
<section class="section" id="pricing" style="background:var(--onyx)">
<div class="wrap">
 <div class="sh r" style="text-align:center">
  <div class="sh-label" style="justify-content:center">
   <div class="sh-label-line"></div>
   <span class="label"><span style="color:var(--amber);margin-right:8px;font-family:var(--mono)">05</span>Transparent Pricing</span>
   <div class="sh-label-line"></div>
  </div>
  <div class="sh-title">Start free.<br><em class="accent">Scale as you grow.</em></div>
  <p class="sh-sub" style="margin:10px auto 32px">No hidden fees. No lock-in. Cancel anytime.</p>

  <!-- BILLING TOGGLE -->
  <div class="pricing-toggle">
   <span class="label">Monthly</span>
   <div class="toggle-track" id="bill-toggle" data-onclick="toggleBill()" title="Switch to annual">
    <div class="toggle-thumb"></div>
   </div>
   <span class="label">Annual <span style="color:var(--jade);margin-left:4px">save 20%</span></span>
  </div>
 </div>

 <!-- PRICING CARDS -->
 <div class="price-grid r" id="price-grid"></div>

 <!-- COMPARISON TABLE -->
 <div class="r" style="margin-top:0">
  <div style="text-align:center;margin-bottom:24px">
   <div class="label" style="color:var(--amber);margin-bottom:6px">Feature Comparison</div>
   <div class="sh-title" style="font-size:clamp(22px,2.5vw,32px)">Everything in one view</div>
  </div>

  <div class="compare-wrap">
   <!-- Header -->
   <div class="compare-head">
    <div class="compare-head-cell">Feature</div>
    <div class="compare-head-cell">Starter</div>
    <div class="compare-head-cell hl">Professional</div>
    <div class="compare-head-cell">Enterprise</div>
    <div class="compare-head-cell">Executive</div>
   </div>

   <!-- Strategy -->
   <div class="compare-row group">
    <div class="compare-cell" style="color:var(--amber);font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;grid-column:1/-1">AI Strategy</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Instant AI strategy</div>
    <div class="compare-cell"><span class="check-p">3 / day</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Unlimited</div>
    <div class="compare-cell"><span class="check-y">✓</span> Unlimited</div>
    <div class="compare-cell"><span class="check-y">✓</span> Unlimited</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Custom strategy ($2,500 value)</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Included</div>
    <div class="compare-cell"><span class="check-y">✓</span> Included</div>
    <div class="compare-cell"><span class="check-y">✓</span> Included</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Function strategies (all 6)</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">PDF download</div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
   </div>

   <!-- Workshops -->
   <div class="compare-row group">
    <div class="compare-cell" style="color:var(--amber);font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;grid-column:1/-1">Executive Workshops</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Board AI Briefing ($1,800 value)</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> 1 included</div>
    <div class="compare-cell"><span class="check-y">✓</span> Unlimited</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">AI Design Sprint ($14,500 value)</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-p">Add-on</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Included</div>
   </div>

   <!-- Support -->
   <div class="compare-row group">
    <div class="compare-cell" style="color:var(--amber);font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;grid-column:1/-1">Support & Expert Access</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Email support</div>
    <div class="compare-cell"><span class="check-y">✓</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Priority</div>
    <div class="compare-cell"><span class="check-y">✓</span> Priority</div>
    <div class="compare-cell"><span class="check-y">✓</span> Dedicated</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Expert consultant hours</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> 8hrs/mo</div>
    <div class="compare-cell"><span class="check-y">✓</span> Dedicated</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Resident AI Expert</div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-n">—</span></div>
    <div class="compare-cell"><span class="check-p">Add-on</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Included</div>
   </div>
   <div class="compare-row">
    <div class="compare-cell">Response SLA</div>
    <div class="compare-cell"><span class="check-p">48 hrs</span></div>
    <div class="compare-cell"><span class="check-p">24 hrs</span></div>
    <div class="compare-cell"><span class="check-p">4 hrs</span></div>
    <div class="compare-cell"><span class="check-y">✓</span> Same day</div>
   </div>
  </div>
 </div>
</div>
</section>

<!-- CTA + CONTACT -->
<section class="section" id="contact">
<div class="wrap">

 <!-- CTA BANNER -->
 <div class="r" style="border:1px solid var(--lead);border-radius:12px;padding:64px 72px;text-align:center;background:var(--onyx);margin-bottom:72px;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:linear-gradient(var(--lead) 1px,transparent 1px),linear-gradient(90deg,var(--lead) 1px,transparent 1px);background-size:64px 64px;opacity:.25;pointer-events:none"></div>
  <!-- Radial glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(201,150,58,.07),transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:1">
   <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(63,185,80,.08);border:1px solid rgba(63,185,80,.2);border-radius:100px;padding:6px 16px 6px 10px;margin-bottom:20px">
    <span class="tk-dot"></span>
    <span class="hero-eyebrow" style="color:var(--jade)">The window to lead is closing</span>
   </div>
   <div class="h2 serif" style="margin-bottom:14px">Start your AI transformation<br>in <em class="accent">sixty seconds.</em></div>
   <p class="body-lg" style="max-width:400px;margin:0 auto 32px">Free to start. No credit card. Board-ready strategy powered by live AI research.</p>
   <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-w btn-lg" data-onclick="sTo('#services');showTier('a')">Get my free strategy <span class="btn-arrow">→</span></button>
    <button class="btn btn-o btn-lg" data-onclick="sTo('#contact-form')">Talk to an expert</button>
   </div>
   <p class="label" style="margin-top:16px;color:var(--zinc)">66% will leave firms not delivering AI · IBM Research 2025</p>
  </div>
 </div>

 <!-- STATS ROW -->
 <div class="r" style="display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--lead);border-radius:10px;overflow:hidden;margin-bottom:56px">
  <div class="contact-stat"><div class="contact-stat-n" style="color:var(--amber)">$2,500</div><div class="contact-stat-l">Custom Strategy</div></div>
  <div class="contact-stat" style="border-left:1px solid var(--lead)"><div class="contact-stat-n" style="color:var(--jade)">24hr</div><div class="contact-stat-l">Expert response</div></div>
  <div class="contact-stat" style="border-left:1px solid var(--lead)"><div class="contact-stat-n" style="color:var(--cyan)">99%</div><div class="contact-stat-l">Client satisfaction</div></div>
  <div class="contact-stat" style="border-left:1px solid var(--lead)"><div class="contact-stat-n" style="color:var(--violet)">5×</div><div class="contact-stat-l">Average ROI in 14 months</div></div>
 </div>

 <!-- CONTACT GRID -->
 <div class="contact-grid" id="contact-form">

  <!-- LEFT: form -->
  <div class="r">
   <div class="sh" style="margin-bottom:28px">
    <div class="sh-label"><div class="sh-label-line"></div><span class="label">Get in touch</span></div>
    <div class="sh-title" style="font-size:clamp(28px,3vw,42px)">Let's talk<br><em class="accent">transformation.</em></div>
    <p class="sh-sub" style="margin-top:8px">Expert response within 24 hours. Enterprise enquiries same day.</p>
   </div>
   <div id="cf-frm">
    <div class="form-wrap">
     <div class="g2" style="margin-bottom:0">
      <div class="s-field">
       <label class="s-lbl">Full name *</label>
       <input class="s-in" id="cf-nm" placeholder="Rahul Sharma"/>
      </div>
      <div class="s-field">
       <label class="s-lbl">Work email *</label>
       <input class="s-in" id="cf-em" type="email" placeholder="rahul@company.com"/>
      </div>
     </div>
     <div class="s-field">
      <label class="s-lbl">Company *</label>
      <input class="s-in" id="cf-co" placeholder="Your organisation"/>
     </div>
     <div class="s-field">
      <label class="s-lbl">I am interested in</label>
      <select class="s-in" id="cf-in">
       <option value="">Select…</option>
       <option>Free Instant AI Strategy</option>
       <option>Custom Strategy ($2,500)</option>
       <option>Function Strategy ($5,000)</option>
       <option>AI Design Sprint ($14,500)</option>
       <option>Board AI Briefing ($1,800)</option>
       <option>C-Suite Package</option>
       <option>Anchor Client Partnership ($48,000)</option>
       <option>Enterprise Platform</option>
      </select>
     </div>
     <div class="s-field" style="margin-bottom:22px">
      <label class="s-lbl">Message</label>
      <textarea class="s-in" id="cf-ms" rows="3" placeholder="Tell us about your organisation and AI goals…"></textarea>
     </div>
     <button class="btn btn-a btn-lg" id="cf-btn" data-onclick="submitCF()" style="width:100%;justify-content:center">Send message <span class="btn-arrow">→</span></button>
     <p class="label" style="text-align:center;margin-top:10px">We respond within 24 hours · No spam ever</p>
    </div>
   </div>
   <div id="cf-ok" style="display:none;padding:40px;border:1px solid rgba(63,185,80,.3);border-radius:8px;background:rgba(63,185,80,.05);text-align:center">
    <div style="font-size:36px;margin-bottom:12px">✅</div>
    <div class="h3 serif" style="margin-bottom:8px">Message received</div>
    <p class="body-sm">We'll reply within 24 hours. Check your email.</p>
   </div>
  </div>

  <!-- RIGHT: info + why us -->
  <div class="r">
   <!-- Why us quick stats -->
   <div style="margin-bottom:24px">
    <div class="label" style="color:var(--amber);margin-bottom:16px;display:flex;align-items:center;gap:8px"><span style="width:14px;height:1px;background:var(--amber);display:inline-block"></span>Why AI in a Box</div>
    <div style="display:flex;flex-direction:column;gap:10px">
     <div class="contact-info-card">
      <div style="display:flex;align-items:flex-start;gap:14px">
       <div style="font-size:20px;flex-shrink:0">⚡</div>
       <div>
        <div style="font-size:13px;font-weight:500;color:var(--paper);margin-bottom:3px">Strategy in 60 seconds — free</div>
        <div class="body-sm" style="font-size:12px">Get a board-ready AI strategy with live research. No credit card. PDF download included.</div>
       </div>
      </div>
     </div>
     <div class="contact-info-card">
      <div style="display:flex;align-items:flex-start;gap:14px">
       <div style="font-size:20px;flex-shrink:0">🎯</div>
       <div>
        <div style="font-size:13px;font-weight:500;color:var(--paper);margin-bottom:3px">Built for your organisation</div>
        <div class="body-sm" style="font-size:12px">Custom strategies built from questionnaires — not generic templates. Every recommendation specific to you.</div>
       </div>
      </div>
     </div>
     <div class="contact-info-card">
      <div style="display:flex;align-items:flex-start;gap:14px">
       <div style="font-size:20px;flex-shrink:0">💰</div>
       <div>
        <div style="font-size:13px;font-weight:500;color:var(--paper);margin-bottom:3px">Fraction of Big 4 cost</div>
        <div class="body-sm" style="font-size:12px">McKinsey charges ₹2Cr+ for a generic strategy. Our Custom Strategy is $2,500 and built around your data.</div>
       </div>
      </div>
     </div>
    </div>
   </div>

   <!-- Contact details -->
   <div class="label" style="color:var(--amber);margin-bottom:14px;display:flex;align-items:center;gap:8px"><span style="width:14px;height:1px;background:var(--amber);display:inline-block"></span>Direct contact</div>
   <div style="display:flex;flex-direction:column;gap:10px">
    <div class="contact-info-card" style="display:flex;align-items:center;gap:14px">
     <div style="width:36px;height:36px;border-radius:7px;background:rgba(230,147,58,.1);border:1px solid rgba(230,147,58,.2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">📧</div>
     <div>
      <div class="label" style="margin-bottom:2px">Email</div>
      <div style="font-size:13px;color:var(--paper)">hello@aiinbox.com</div>
      <div class="label" style="color:var(--zinc);margin-top:1px">Response within 24 hours</div>
     </div>
    </div>
    <div class="contact-info-card" style="display:flex;align-items:center;gap:14px">
     <div style="width:36px;height:36px;border-radius:7px;background:rgba(88,166,255,.1);border:1px solid rgba(88,166,255,.2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">📅</div>
     <div>
      <div class="label" style="margin-bottom:2px">Book a call</div>
      <div style="font-size:13px;color:var(--paper)">30-min discovery call</div>
      <button class="btn btn-o btn-sm" style="margin-top:7px" data-onclick="bookWorkshop('sprint')">Book now →</button>
     </div>
    </div>
    <div class="contact-info-card" style="display:flex;align-items:center;gap:14px">
     <div style="width:36px;height:36px;border-radius:7px;background:rgba(63,185,80,.1);border:1px solid rgba(63,185,80,.2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🏢</div>
     <div>
      <div class="label" style="margin-bottom:2px">Location</div>
      <div style="font-size:13px;color:var(--paper)">Mumbai, India</div>
      <div class="label" style="color:var(--zinc);margin-top:1px">Serving enterprises globally</div>
     </div>
    </div>
   </div>
  </div>
 </div>
</div>
</section>

<!-- FOOTER -->
<footer>
<div class="wrap">
 <!-- TOP GRID -->
 <div class="footer-grid">
  <!-- Brand col -->
  <div>
   <div class="footer-brand">AI<span>in</span>Box</div>
   <p class="footer-desc">The complete enterprise AI transformation platform. From free instant strategy to full C-suite transformation. Built for the leaders the Big 4 are too expensive to serve.</p>
   <div class="footer-badge-row">
    <div class="footer-badge">&#128274; Enterprise Security</div>
    <div class="footer-badge">&#10003; PCI Compliant</div>
    <div class="footer-badge">&#127758; Global Edge</div>
   </div>
   <div class="footer-social" style="margin-top:16px">
    <button class="footer-social-btn" title="LinkedIn" style="cursor:default">in</button>
    <button class="footer-social-btn" title="Twitter/X" style="cursor:default">&#10005;</button>
    <button class="footer-social-btn" title="Email" data-onclick="window.location.href='mailto:hello@aiinbox.com'">&#64;</button>
   </div>
  </div>

  <!-- Platform col -->
  <div>
   <div class="footer-col-h">Platform</div>
   <button class="footer-lnk" data-onclick="sTo('#services');showTier('a')">&#9889; Instant AI Strategy — Free</button>
   <button class="footer-lnk" data-onclick="sTo('#services');showTier('b')">&#127919; Custom Strategy — $2,500</button>
   <button class="footer-lnk" data-onclick="sTo('#services');showTier('c')">&#128295; Function Strategy — $5,000</button>
   <button class="footer-lnk" data-onclick="sTo('#pricing')">Pricing &amp; plans</button>
  </div>

  <!-- Workshops col -->
  <div>
   <div class="footer-col-h">Workshops</div>
   <button class="footer-lnk" data-onclick="sTo('#workshops')">&#127942; AI Design Sprint — $14,500</button>
   <button class="footer-lnk" data-onclick="sTo('#workshops')">&#9889; AI Accelerator — $4,200</button>
   <button class="footer-lnk" data-onclick="sTo('#workshops')">&#127919; Board AI Briefing — $1,800</button>
   <button class="footer-lnk" data-onclick="sTo('#workshops')">&#127885; AI Innovation Lab — $30,000</button>
   <div class="footer-col-h" style="margin-top:20px">C-Suite Packages</div>
   <button class="footer-lnk" data-onclick="sTo('#csuite');showPkg(document.querySelector('.pkg-tab'),'cfo')">CFO Package — $25,000</button>
   <button class="footer-lnk" data-onclick="sTo('#csuite')">CEO Package — $40,000</button>
  </div>

  <!-- Company col -->
  <div>
   <div class="footer-col-h">Company</div>
   <button class="footer-lnk" data-onclick="sTo('#contact')">Contact us</button>
   <button class="footer-lnk" data-onclick="sTo('#contact')">Book a call</button>
   <button class="footer-lnk">Privacy Policy</button>
   <button class="footer-lnk">Terms of Service</button>
   <div class="footer-col-h" style="margin-top:20px">Contact</div>
   <div style="font-size:12px;color:var(--zinc);margin-bottom:4px">hello@aiinbox.com</div>
   <div style="font-size:12px;color:var(--zinc)">Mumbai, India</div>
  </div>
 </div>

 <!-- BOTTOM BAR -->
 <div class="footer-bot">
  <span>&#169; 2026 AI in a Box &#183; All rights reserved &#183; Mumbai, India</span>
  <div style="display:flex;align-items:center;gap:16px">
   <a href="mailto:hello@aiinbox.com" style="color:var(--amber);text-decoration:none;font-family:var(--mono);font-size:9px;letter-spacing:.08em;transition:opacity .2s" data-onmouseover="this.style.opacity='.7'" data-onmouseout="this.style.opacity='1'">hello@aiinbox.com</a>
   <span style="color:var(--lead)">&#183;</span>
   <span>Enterprise AI Platform</span>
  </div>
 </div>
</div>
</footer>

<!-- AVATAR / ARIA -->
<div id="av-wrap">
 <div id="av-chat">
  <div class="av-head">
   <div class="av-face">🤖</div>
   <div><div class="av-n">ARIA — AI in a Box</div><div class="av-s"><span class="av-dot"></span>Online · Instant replies</div></div>
   <button data-onclick="toggleChat()" style="margin-left:auto;background:none;border:none;color:var(--zinc);cursor:pointer;font-size:18px;line-height:1">×</button>
  </div>
  <div class="av-msgs" id="av-msgs"></div>
  <div class="av-qs" id="av-qs">
   <button class="av-q" data-onclick="avSendQ('What is the instant strategy?')">⚡ Instant</button>
   <button class="av-q" data-onclick="avSendQ('Tell me about workshops')">🎯 Workshops</button>
   <button class="av-q" data-onclick="avSendQ('CHRO package details')">👥 CHRO</button>
   <button class="av-q" data-onclick="avSendQ('Pricing')">💰 Pricing</button>
  </div>
  <div class="av-inp-row">
   <input class="av-inp" id="av-in" placeholder="Ask anything…" data-onkeydown="if(event.key==='Enter')avSend()"/>
   <button class="av-send" data-onclick="avSend()">➤</button>
  </div>
 </div>
 <button id="av-btn" data-onclick="toggleChat()">🤖</button>
</div>

<!-- TOAST -->
<div id="toast"><span id="toast-msg">Done</span></div>

<!-- CHECKOUT MODAL -->
<div id="modal">
 <div class="modal-box" style="position:relative">
  <button class="modal-x" data-onclick="closeModal()">×</button>

  <!-- Header -->
  <div class="modal-header">
   <div>
    <div class="label" style="color:var(--amber);margin-bottom:4px">Secure Checkout</div>
    <div class="h4 serif" id="modal-plan">Complete your order</div>
   </div>
   <div id="modal-price" style="font-family:var(--serif);font-size:28px;font-weight:200;color:var(--amber)"></div>
  </div>

  <!-- Step indicators -->
  <div class="modal-steps">
   <div class="modal-step-item active" id="ms-1">
    <div class="modal-step-num">1</div>
    <span>Details</span>
   </div>
   <div style="flex:1;height:1px;background:var(--lead);margin:0 8px"></div>
   <div class="modal-step-item" id="ms-2">
    <div class="modal-step-num">2</div>
    <span>Payment</span>
   </div>
   <div style="flex:1;height:1px;background:var(--lead);margin:0 8px"></div>
   <div class="modal-step-item" id="ms-3">
    <div class="modal-step-num">✓</div>
    <span>Confirmed</span>
   </div>
  </div>

  <!-- Step 1: Details -->
  <div class="m-step on" id="ms-1-body">
   <div class="modal-body">
    <div class="modal-summary">
     <div>
      <div class="label" style="margin-bottom:2px">You're ordering</div>
      <div class="modal-summary-name" id="ms-plan-name">AI Strategy</div>
     </div>
     <div class="modal-summary-price" id="ms-plan-price"></div>
    </div>
    <div class="g2">
     <div class="s-field">
      <label class="s-lbl">First name *</label>
      <input id="co-fn" class="s-in" placeholder="Rahul"/>
     </div>
     <div class="s-field">
      <label class="s-lbl">Last name</label>
      <input id="co-ln" class="s-in" placeholder="Sharma"/>
     </div>
    </div>
    <div class="s-field">
     <label class="s-lbl">Work email *</label>
     <input id="co-em" class="s-in" type="email" placeholder="rahul@company.com"/>
    </div>
    <div class="s-field" style="margin-bottom:22px">
     <label class="s-lbl">Company *</label>
     <input id="co-co" class="s-in" placeholder="Your organisation"/>
    </div>
    <button data-onclick="modalStep2()" class="btn btn-w btn-lg" style="width:100%;justify-content:center">Continue to payment <span class="btn-arrow">→</span></button>
    <div class="trust-badges" style="justify-content:center">
     <div class="trust-badge">🔒 256-bit SSL</div>
     <div class="trust-badge">✓ PCI DSS compliant</div>
     <div class="trust-badge">↩ 30-day guarantee</div>
    </div>
   </div>
  </div>


  <!-- Step 2: Payment -->
  <div class="m-step" id="ms-2-body">
   <div class="modal-body">
    <div class="modal-summary" style="margin-bottom:18px">
     <div class="modal-summary-name" id="ms-plan-name-2">AI Strategy</div>
     <div class="modal-summary-price" id="ms-plan-price-2"></div>
    </div>
    <div class="s-field">
     <label class="s-lbl">Card number</label>
     <input id="co-card" class="s-in" maxlength="19" placeholder="4242 4242 4242 4242"
       style="font-family:var(--mono);letter-spacing:2px"/>
    </div>
    <div class="card-row" style="margin-bottom:20px">
     <div class="s-field" style="margin-bottom:0">
      <label class="s-lbl">Cardholder name</label>
      <input class="s-in" placeholder="Rahul Sharma"/>
     </div>
     <div class="s-field" style="margin-bottom:0">
      <label class="s-lbl">Expiry</label>
      <input class="s-in" placeholder="MM / YY" maxlength="7" style="font-family:var(--mono)"/>
     </div>
     <div class="s-field" style="margin-bottom:0">
      <label class="s-lbl">CVV</label>
      <input class="s-in" type="password" placeholder="&bull;&bull;&bull;" maxlength="4" style="font-family:var(--mono)"/>
     </div>
    </div>
    <button id="pay-btn" class="btn btn-a btn-lg" data-onclick="processPayment()" style="width:100%;justify-content:center">
     Complete payment <span class="btn-arrow">&rarr;</span>
    </button>
    <div class="trust-badges" style="justify-content:center;margin-top:12px">
     <div class="trust-badge">&#128274; Encrypted</div>
     <div class="trust-badge">&#10003; Secure</div>
     <div class="trust-badge">&#128179; All cards accepted</div>
    </div>
   </div>
  </div>

  <!-- Step 3: Success -->
  <div class="m-step" id="ms-3-body">
   <div class="modal-body" style="text-align:center;padding:40px 28px">
    <div class="success-check">&#127881;</div>
    <div class="h3 serif" style="margin-bottom:8px">Payment confirmed!</div>
    <p class="body-sm" style="margin-bottom:20px">Your strategy is being generated now.</p>
    <button class="btn btn-a" data-onclick="closeModal()" style="margin:0 auto">Continue &rarr;</button>
   </div>
  </div>

 </div>
</div>

<!-- AVATAR / ARIA -->
<div id="av-wrap">
 <div id="av-chat">
  <div class="av-head">
   <div class="av-face">&#129302;</div>
   <div><div style="font-size:13px;font-weight:500;color:var(--paper)">ARIA</div><div class="label">AI in a Box Assistant</div></div>
   <button data-onclick="toggleChat()" style="margin-left:auto;background:none;border:none;color:var(--zinc);font-size:18px;cursor:pointer">&#xd7;</button>
  </div>
  <div class="av-msgs" id="av-msgs"></div>
  <div class="av-qs" id="av-qs">
   <button class="av-q" data-onclick="avSendQ('What is the free strategy?')">Free strategy?</button>
   <button class="av-q" data-onclick="avSendQ('How much does custom strategy cost?')">Custom pricing?</button>
   <button class="av-q" data-onclick="avSendQ('Tell me about the workshops')">Workshops?</button>
   <button class="av-q" data-onclick="avSendQ('What are the C-suite packages?')">C-suite?</button>
  </div>
  <div class="av-input">
   <input id="av-in" placeholder="Ask about our services..." data-onkeydown="if(event.key==='Enter')avSend()"/>
   <button data-onclick="avSend()" style="background:none;border:none;padding:12px 14px;color:var(--amber);font-size:16px;cursor:pointer">&#x2192;</button>
  </div>
 </div>
 <button id="av-btn" data-onclick="toggleChat()" title="Chat with ARIA">&#129302;</button>
</div>

<!-- TOAST -->
<div id="toast"><span id="toast-msg">Done</span></div>

<!-- SETUP BANNER -->
<div id="setup-banner">
 <div style="display:flex;align-items:center;gap:16px">
  <div style="width:8px;height:8px;border-radius:50%;background:var(--jade);animation:blink 2s infinite;flex-shrink:0"></div>
  <span style="color:var(--silver)"><strong style="color:var(--jade)">AI ENGINE LIVE</strong> &mdash; 3-model cascade active. Add keys to enable:</span>
  <span style="color:var(--jade)">1. Stripe payments</span>
  <span style="color:var(--violet)">2. EmailJS</span>
  <span style="color:var(--amber)">3. Calendly</span>
  <span style="color:var(--cyan)">4. Worker (optional prod proxy)</span>
 </div>
 <button data-onclick="document.getElementById('setup-banner').style.display='none'" style="background:none;border:none;color:var(--zinc);cursor:pointer;font-size:16px;padding:4px 8px">&times;</button>
</div>


`;
