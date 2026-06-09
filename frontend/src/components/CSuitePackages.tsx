import { useState } from 'react'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

interface Mod { color: string; tag: string; title: string; items: string[] }
interface Card { icon: string; title: string; desc: string }
interface Outcome { value: string; label: string }
interface Package {
  id: string; icon: string; role: string; title: string; subtitle: string; desc: string
  price: number; color: string; bg: string; border: string; duration: string
  modules: Mod[]; cards?: Card[]; outcomes?: Outcome[]
}

const PACKAGES: Package[] = [
  { id:'chro',icon:'👥',role:'CHRO PACKAGE',title:'People & Talent',subtitle:'AI Transformation',
    desc:'The complete AI talent transformation programme — from assessing your current workforce readiness to building an AI-native organisation culture.',
    price:2520000,color:'#BC8CFF',bg:'rgba(157,110,255,.08)',border:'rgba(157,110,255,.25)',duration:'3-MONTH PROGRAMME · DEDICATED EXPERT',
    modules:[
      {color:'#BC8CFF',tag:'MODULE 1 · AI TALENT READINESS ASSESSMENT',title:"Know your people's AI readiness",items:['Individual AI skill gap analysis by role and department','Organisational AI maturity heatmap','Role-at-risk assessment — which jobs will AI impact most','AI readiness benchmark vs industry peers','Learning needs analysis across all functions','Leadership AI capability scorecard']},
      {color:'#58A6FF',tag:'MODULE 2 · AI-POWERED RECRUITMENT',title:'Hire AI talent faster and better',items:['AI-powered JD writer — role-specific, bias-reduced','AI screening platform for CV shortlisting','Technical AI competency interview framework','AI talent market mapping — where to find people','AI hiring strategy for data scientists, ML engineers, AI PMs','Build vs buy vs partner decision framework']},
      {color:'#3FB950',tag:'MODULE 3 · AI LEARNING & RESKILLING',title:'Build AI capability across the organisation',items:['AI awareness programme — all-staff (2-hour sessions)','AI fluency for leaders — C-suite specific curriculum','Role-specific reskilling pathway per job family','Hands-on AI tools training (ChatGPT, Claude, Copilot)','AI learning paths per function (Finance, HR, Ops, Sales)','AI certification programme with badges and credentials']},
      {color:'#E3B341',tag:'MODULE 4 · AI CULTURE & INNOVATION PROGRAMMES',title:'Make AI adoption a cultural movement',items:['AI Hackathon design and facilitation (24–48hr sprint)','AI Innovation Lab setup — dedicated team + process','AI Idea Contest — crowdsourced use cases from employees','AI Roadshows — travelling demos across offices and plants','AI Champions Network — 1 AI champion per department','AI Town Halls — quarterly all-hands AI progress briefings']},
      {color:'#F85149',tag:'MODULE 5 · CHANGE MANAGEMENT & GOVERNANCE',title:'Make the transformation stick',items:['AI change management playbook and communication plan','Employee anxiety about AI — structured engagement approach','Responsible AI policy — ethics, fairness, transparency','AI governance committee setup and charter','People KPIs for AI transformation (adoption, capability, sentiment)','Board reporting dashboard — AI people metrics monthly']},
    ]},
  { id:'cfo',icon:'💰',role:'CFO PACKAGE',title:'Financial AI',subtitle:'Intelligence',
    desc:'Transform your finance function from backward-looking reporting to forward-looking AI-driven intelligence and decision support.',
    price:2100000,color:'#3FB950',bg:'rgba(0,229,160,.08)',border:'rgba(0,229,160,.25)',duration:'3-MONTH PROGRAMME · DEDICATED EXPERT',
    modules:[
      {color:'#3FB950',tag:'MODULE 1 · AI FINANCIAL FORECASTING',title:'See the future, not just the past',items:['AI revenue forecasting — 12-month ahead with confidence intervals','AI cash flow prediction — 90-day rolling forecast','AI P&L scenario modelling (3 scenarios in 60 seconds)','Budget vs actuals AI analysis with root cause','AI-driven annual budget planning acceleration','Natural language query — ask your P&L anything']},
      {color:'#58A6FF',tag:'MODULE 2 · FRAUD DETECTION & RISK AI',title:'Protect the balance sheet 24/7',items:['Real-time transaction anomaly scoring and alerts','Vendor payment fraud detection (duplicate, altered invoices)','AI expense claim fraud detection','Credit risk scoring for customers and counterparties','FX risk and hedging AI advisor','AI audit trail — automatic transaction documentation']},
      {color:'#E3B341',tag:'MODULE 3 · COST OPTIMISATION AI',title:'Find savings hiding in the data',items:['AI spend analytics — category-by-category opportunity map','Vendor consolidation AI — identify duplicate or redundant spend','Working capital optimisation (AR, AP, inventory)','SaaS and software licence AI audit','AI-driven contract renewal and negotiation intelligence','Energy and utility cost AI optimisation']},
      {color:'#BC8CFF',tag:'MODULE 4 · AI INVESTMENT ROI & CFO INTELLIGENCE',title:'Make AI investment decisions with confidence',items:['AI ROI calculator — NPV, IRR, payback for any AI use case','AI investment thesis and board narrative','Real-time CFO Intelligence Dashboard','AI-powered board reporting pack (monthly auto-generated)','Regulatory compliance AI (GST, SEBI, RBI reporting)','AI financial close acceleration (30–40% faster)']},
    ]},
  { id:'coo',icon:'⚙️',role:'COO PACKAGE',title:'Operations AI',subtitle:'Transformation',
    desc:'Transform operations from reactive and manual to predictive and intelligent. Every machine, every process, every decision — augmented by AI.',
    price:2688000,color:'#E3B341',bg:'rgba(255,184,0,.06)',border:'rgba(255,184,0,.25)',duration:'3-MONTH PROGRAMME · DEDICATED EXPERT',
    modules:[
      {color:'#E3B341',tag:'MODULE 1 · PREDICTIVE MAINTENANCE AI',title:'Fix machines before they break',items:['Sensor-driven failure prediction 14+ days ahead','Real-time equipment health monitoring dashboard','AI-optimised maintenance scheduling','Spare parts demand prediction (reduce buffer stock)','Root cause analysis AI — why did this fail?','OEE (Overall Equipment Effectiveness) AI optimiser']},
      {color:'#58A6FF',tag:'MODULE 2 · PROCESS AUTOMATION & EFFICIENCY',title:'Automate the right things, first',items:['Process mining — find hidden inefficiencies in workflows','AI automation opportunity map — ranked by ROI and effort','RPA + AI integration roadmap','Document processing AI (invoices, orders, contracts)','AI-powered shift scheduling optimisation','Energy consumption optimisation AI']},
      {color:'#3FB950',tag:'MODULE 3 · QUALITY INTELLIGENCE',title:'Zero defects. 100% inspection.',items:['Computer vision QC — 100% inspection vs 8–10% sampling','Defect detection to 0.3mm — invisible to the human eye','AI supplier quality scoring and early warning','Warranty prediction AI — catch issues before field failure','Digital twin — simulate process changes before implementing','AI PPM (Parts Per Million) reduction roadmap']},
      {color:'#BC8CFF',tag:'MODULE 4 · SUPPLY CHAIN AI',title:'Resilient, responsive supply chain',items:['AI demand forecasting (SKU-level, 90%+ accuracy target)','Inventory optimisation — reduce without lowering service level','Supplier risk AI — flag disruptions 30 days ahead','Logistics route optimisation AI (cost + carbon)','Procurement AI — best time and price to buy','Operations AI dashboard — real-time COO intelligence hub']},
    ]},
  { id:'cio',icon:'🏗️',role:'CIO PACKAGE',title:'AI Architecture &',subtitle:'Technology Strategy',
    desc:'Design the technology foundation for an AI-native enterprise. Architecture, data, vendors, governance — the complete CIO blueprint.',
    price:2940000,color:'#58A6FF',bg:'rgba(0,200,255,.06)',border:'rgba(0,200,255,.25)',duration:'3-MONTH PROGRAMME · DEDICATED EXPERT',
    modules:[
      {color:'#58A6FF',tag:'MODULE 1 · AI READINESS ASSESSMENT',title:'Know exactly where you stand',items:['Technology landscape map — current state audit','Data readiness assessment — quality, availability, governance','AI technical debt analysis — what needs to be fixed first','Cloud and infrastructure AI readiness gap analysis','Security posture review for AI systems','API and integration landscape review']},
      {color:'#3FB950',tag:'MODULE 2 · TARGET ARCHITECTURE DESIGN',title:'Design the AI-native future state',items:['AI-ready target architecture blueprint','Data platform design (lakehouse, real-time, ML pipeline)','AI model deployment and MLOps framework','Integration architecture for AI agents and tools','Migration roadmap — current to target state','Build vs buy vs partner decision matrix']},
      {color:'#BC8CFF',tag:'MODULE 3 · VENDOR EVALUATION & SELECTION',title:'Choose the right AI vendors',items:['AI vendor market landscape (foundation models, tools, platforms)','Structured RFP process for AI vendors','TCO analysis — true cost of each AI option','Vendor risk assessment (lock-in, financial stability, compliance)','Proof of concept framework — how to test before committing','Negotiation playbook and contract key terms']},
    ]},
  { id:'cmo',icon:'📣',role:'CMO PACKAGE',title:'Chief Marketing Officer',subtitle:'',
    desc:'AI personalisation at scale. Revenue attribution. Content intelligence. Built for the marketing leader who needs to prove ROI on every rupee.',
    price:2352000,color:'#E6933A',bg:'rgba(240,136,62,.06)',border:'rgba(240,136,62,.25)',duration:'COMPLETE CMO AI PROGRAMME',modules:[],
    cards:[
      {icon:'🎯',title:'AI Personalisation Engine',desc:'1-to-1 personalisation across email, web, app and ads. AI segments and serves the right message to the right customer at the right moment. 3–5× engagement uplift.'},
      {icon:'🧠',title:'Customer Intelligence Platform',desc:'360° customer view — transaction history, behaviour signals, NPS, CLV prediction. Segment your entire customer base automatically. Know who will churn before they do.'},
      {icon:'📊',title:'Campaign Optimisation AI',desc:'AI allocates budget in real time across channels. Tests 100s of creative variants. Identifies winning combinations and scales them automatically. 20–40% CAC reduction.'},
      {icon:'✍️',title:'Content AI Studio',desc:'AI-generated content at brand voice. Blog, social, email, ads — all on-brand, on-message. SEO-optimised. 10× your content output with 30% of the team.'},
      {icon:'💰',title:'Marketing ROI Attribution',desc:'Multi-touch attribution across every channel. Know exactly which spend is driving revenue. Prove marketing ROI to the board with data no CFO can argue with.'},
      {icon:'📈',title:'Brand & Social Intelligence',desc:'Real-time brand sentiment monitoring across social, news, and reviews. AI surfaces reputation risks before they escalate. Competitive share-of-voice tracking daily.'},
    ],
    outcomes:[{value:'3–5×',label:'Engagement lift'},{value:'40%',label:'CAC reduction'},{value:'10×',label:'Content output'},{value:'12wk',label:'To first results'}]},
  { id:'ceo',icon:'🎯',role:'CEO PACKAGE',title:'Chief Executive Officer',subtitle:'',
    desc:'The complete CEO AI transformation package. Board narrative. Investment thesis. Competitive mapping. A 5-year AI vision that wins investors, aligns leadership, and compounds growth.',
    price:3360000,color:'#BC8CFF',bg:'rgba(188,140,255,.06)',border:'rgba(188,140,255,.25)',duration:'THE FLAGSHIP CEO PROGRAMME',modules:[],
    cards:[
      {icon:'📋',title:'Board AI Strategy Deck',desc:'Board-ready AI strategy presentation built for your company. Investment case, use case roadmap, risk framework, milestones, success metrics. Delivered in 48 hours. Updated quarterly.'},
      {icon:'🗺️',title:'Competitive AI Mapping',desc:'Live intelligence on where your top 10 competitors are with AI. Their investments, use cases, talent, and published results. Updated monthly. Know who is ahead and by how far.'},
      {icon:'💡',title:'AI Investment Thesis',desc:'Structured investment case for your AI programme. ROI model per use case. Capital allocation framework. Phased investment plan aligned to risk appetite and growth objectives.'},
      {icon:'🏆',title:'Executive AI Coaching',desc:'Monthly 1:1 sessions with a senior AI strategist. Deep-dive on AI trends in your sector. Coaching on communicating AI to your board, investors, and leadership team.'},
      {icon:'🔬',title:'5-Year AI Transformation Roadmap',desc:'Phase-by-phase AI transformation roadmap with milestones, KPIs, investment gates. Aligned to your 3-year strategic plan. Quarterly reviews and recalibration included.'},
      {icon:'🛡️',title:'AI Governance Framework',desc:'Enterprise AI governance policy. Ethics board setup. Risk management framework. Regulatory compliance (SEBI, RBI, DPDP Act). Investor and auditor-ready AI documentation.'},
    ],
    outcomes:[{value:'48hr',label:'Board deck ready'},{value:'5yr',label:'Transformation plan'},{value:'12',label:'Monthly coaching sessions'},{value:'∞',label:'Competitive intelligence'}]},
]

interface Props { openPayment: (plan: string, price: string, inr: number, onPaid: () => void) => void }

export default function CSuitePackages({ openPayment }: Props) {
  const [active, setActive] = useState('chro')
  const pkg = PACKAGES.find(p => p.id === active)!

  return (
    <section id="csuite" className="py-28 border-t border-lead" style={{background:"rgba(13,17,23,.7)"}}>
      <div className="max-w-[1240px] mx-auto px-12">
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-px" style={{background:'#E3B341'}}/>
            <span className="font-mono text-[9.5px] tracking-widest text-zinc uppercase"><span style={{color:'#E3B341'}} className="mr-2">03</span>C-Suite Packages</span>
          </div>
          <div className="font-serif font-light leading-[1.06] tracking-tight mb-3" style={{fontSize:'clamp(34px,4.2vw,56px)'}}>
            Every package. Every deliverable.<br/>
            <em className="italic" style={{background:'linear-gradient(135deg,#E3B341,#E6933A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Every outcome.</em>
          </div>
          <p className="text-[15px] text-silver max-w-xl leading-relaxed font-light">Role-specific AI transformation — purpose-built for each executive function. 3-month programme with a dedicated expert.</p>
        </div>

        {/* Role tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {PACKAGES.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)}
              className="px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all"
              style={{background:active===p.id?p.bg:'transparent',border:`1px solid ${active===p.id?p.border:'#21262D'}`,color:active===p.id?p.color:'#6E7681'}}>
              {p.icon} {p.id.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[300px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <div className="sticky top-20 glass-card p-7 rounded-xl" style={{background:pkg.bg,border:`1px solid ${pkg.border}`}}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5" style={{background:pkg.color+'22'}}>{pkg.icon}</div>
            <div className="font-mono text-[9px] tracking-widest mb-2" style={{color:pkg.color}}>{pkg.role}</div>
            <div className="font-serif text-2xl font-light text-paper mb-0.5">{pkg.title}</div>
            {pkg.subtitle && <div className="font-serif text-lg font-light text-silver mb-4">{pkg.subtitle}</div>}
            <p className="text-[12px] text-silver leading-relaxed mb-6 font-light mt-2">{pkg.desc}</p>
            <div className="h-px bg-lead mb-5"/>
            <div className="font-serif text-3xl font-light mb-1" style={{color:pkg.color}}>{fmt(pkg.price)}</div>
            <div className="font-mono text-[9px] tracking-wider text-zinc mb-6">{pkg.duration}</div>
            <button onClick={() => openPayment(pkg.role, fmt(pkg.price), pkg.price, () => {})}
              className="w-full py-3 rounded-lg text-[13px] font-semibold transition-all hover:-translate-y-px"
              style={{background:pkg.color,color:'#07090D'}}>
              Enquire Now →
            </button>
          </div>

          {/* Modules */}
          <div className="flex flex-col gap-4">
            {pkg.modules.map((mod, i) => (
              <div key={i} className="glass-card p-6 transition-all" style={{borderLeft:`3px solid ${mod.color}`}}>
                <div className="font-mono text-[9px] tracking-widest mb-2" style={{color:mod.color}}>{mod.tag}</div>
                <div className="font-serif text-[17px] font-light text-paper mb-4">{mod.title}</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {mod.items.map((item, j) => (
                    <div key={j} className="flex gap-2 items-start text-[12px] text-silver">
                      <span className="text-jade flex-shrink-0 mt-px">✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {pkg.cards && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {pkg.cards.map((card, i) => (
                    <div key={i} className="glass-card p-5 transition-all"
                      onMouseEnter={e => (e.currentTarget.style.borderColor = pkg.color)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#21262D')}>
                      <div className="text-xl mb-3">{card.icon}</div>
                      <div className="font-serif text-[15px] font-light text-paper mb-2">{card.title}</div>
                      <p className="text-[12px] text-silver leading-relaxed font-light">{card.desc}</p>
                    </div>
                  ))}
                </div>
                {pkg.outcomes && (
                  <div className="glass-card p-6" style={{borderLeft:`3px solid ${pkg.color}`}}>
                    <div className="font-mono text-[9px] tracking-widest mb-4" style={{color:pkg.color}}>DELIVERY & OUTCOMES</div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {pkg.outcomes.map((o, i) => (
                        <div key={i}>
                          <div className="font-serif text-3xl font-light mb-1" style={{color:pkg.color}}>{o.value}</div>
                          <div className="font-mono text-[9px] tracking-wider text-zinc uppercase">{o.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
