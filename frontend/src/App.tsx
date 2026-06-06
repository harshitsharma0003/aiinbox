import { useState, useEffect, useRef } from 'react'
import { strategyApi, contactApi, ariaApi } from './lib/api'

const SESSION_ID = 'sess_' + Math.random().toString(36).slice(2)

function App() {
  const [activeTab, setActiveTab] = useState<'instant' | 'custom' | 'function'>('instant')

  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('nav')
      const bar = document.getElementById('prog')
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40)
      if (bar) {
        const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
        bar.style.width = p + '%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Progress bar */}
      <div id="prog" className="fixed top-0 left-0 z-[9999] h-0.5 bg-gradient-to-r from-amber to-violet pointer-events-none transition-all" style={{ width: '0%' }} />

      {/* Nav */}
      <nav id="nav" className="fixed inset-x-0 top-0 z-[9000] h-15 flex items-center transition-all duration-300">
        <style>{`#nav.scrolled { background: rgba(7,9,13,.9); backdrop-filter: blur(20px); border-bottom: 1px solid #21262D; box-shadow: 0 1px 0 #21262D, 0 8px 32px rgba(0,0,0,.3); }`}</style>
        <div className="max-w-[1240px] mx-auto px-12 w-full flex items-center justify-between">
          <button onClick={() => sTo('#hero')} className="flex items-center gap-2">
            <div className="w-7 h-7 border border-lead rounded flex items-center justify-center text-xs hover:border-amber transition-colors">⬡</div>
            <span className="font-serif text-lg font-light tracking-wide">AI<span className="text-amber italic">in</span>Box</span>
          </button>
          <div className="flex gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {['#services:Strategy', '#workshops:Workshops', '#pricing:Pricing', '#contact:Contact'].map(x => {
              const [id, label] = x.split(':')
              return <button key={id} onClick={() => sTo(id)} className="px-4 py-2 text-zinc text-[13px] hover:text-paper transition-colors">{label}</button>
            })}
          </div>
          <button onClick={() => sTo('#services')} className="px-5 py-1.5 bg-paper text-ink text-[13px] font-medium rounded hover:bg-silver transition-all hover:-translate-y-px">Start free →</button>
        </div>
      </nav>

      {/* Ticker */}
      <div className="mt-[60px] h-[34px] bg-onyx border-b border-lead overflow-hidden flex items-center" style={{ maskImage: 'linear-gradient(90deg,transparent,black 5%,black 95%,transparent)' }}>
        <div className="inline-flex whitespace-nowrap animate-[tk_55s_linear_infinite]">
          <style>{`@keyframes tk{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
          {[...Array(2)].map((_, ri) => (
            <span key={ri} className="inline-flex">
              {['AI CONSULTING $72.8B BY 2030', 'CAGR 31.6%', 'SME 35.9% CAGR — FASTEST GROWING', '86% OF BUYERS SEEK AI-ENABLED FIRMS', 'BCG AI REVENUE 40% OF TOTAL 2026', '66% WILL LEAVE FIRMS NOT DELIVERING AI'].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2.5 px-7 font-mono text-[10px] tracking-wide text-zinc border-r border-lead">
                  {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse flex-shrink-0" />}
                  <span dangerouslySetInnerHTML={{ __html: t.replace(/(\$[\d.]+B|\d+\.?\d*%|40%|66%|86%)/g, '<strong class="text-amber">$1</strong>') }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section id="hero" className="min-h-[calc(100vh-94px)] flex items-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#21262D 1px,transparent 1px),linear-gradient(90deg,#21262D 1px,transparent 1px)', backgroundSize: '72px 72px', opacity: .4, maskImage: 'radial-gradient(ellipse 85% 70% at 50% 0%,black,transparent 75%)' }} />
        <div className="max-w-[1240px] mx-auto px-12 relative z-10 w-full">
          <div className="inline-flex items-center gap-2.5 mb-7 bg-amber/5 border border-amber/20 rounded px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-silver uppercase">Enterprise AI Transformation · Est. 2026</span>
          </div>
          <h1 className="font-serif font-light leading-[.98] tracking-tight mb-8" style={{ fontSize: 'clamp(52px,7.5vw,110px)' }}>
            The AI edge<br />your competitors<br />
            <em className="italic" style={{ background: 'linear-gradient(135deg,#E6933A,#E3B341)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>don't have yet.</em>
          </h1>
          <p className="text-[17px] text-silver max-w-[420px] leading-[1.78] font-light mb-10">Board-ready strategy in 60 seconds. Executive design sprints. Full-scale deployment. Built for enterprise leaders the Big 4 are too expensive to serve.</p>
          <div className="flex gap-3 flex-wrap mb-3">
            <button onClick={() => sTo('#services')} className="inline-flex items-center gap-2 px-8 py-3.5 bg-paper text-ink text-sm font-medium rounded hover:-translate-y-px hover:shadow-xl transition-all">Build your strategy →</button>
            <button onClick={() => sTo('#workshops')} className="inline-flex items-center gap-2 px-8 py-3.5 border border-lead text-paper text-sm rounded hover:bg-carbon transition-all">Book a workshop</button>
          </div>
          <p className="font-mono text-[9.5px] tracking-widest text-zinc flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" /> Free · No credit card · PDF in 60 seconds
          </p>
          <div className="mt-16 grid grid-cols-5 border border-lead rounded-md overflow-hidden bg-onyx">
            {[['$72.8B','Market 2030','amber'],['31.6%','Sector CAGR','cyan'],['86%','Buyers want AI firms','jade'],['6','Transformation stages','violet'],['95%','Pilots fail w/o guidance','rose']].map(([n,l,c]) => (
              <div key={l} className="px-6 py-5 border-r border-lead last:border-r-0 hover:bg-carbon/50 transition-colors cursor-default group">
                <div className={`font-serif text-[34px] font-light leading-none mb-1 tracking-tight text-${c} group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`}>{n}</div>
                <div className="font-mono text-[9px] tracking-widest text-zinc uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section id="services" className="py-28 border-t border-lead">
        <div className="max-w-[1240px] mx-auto px-12">
          <div className="mb-14">
            <div className="flex items-center gap-2.5 mb-4"><div className="w-6 h-px bg-amber" /><span className="font-mono text-[9.5px] tracking-widest text-zinc uppercase"><span className="text-amber mr-2">01</span>Three Strategy Tiers</span></div>
            <div className="font-serif text-[clamp(34px,4.2vw,58px)] font-light leading-[1.06] tracking-tight mb-3">Instant. Custom. <em className="italic" style={{ background: 'linear-gradient(135deg,#E6933A,#E3B341)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Function.</em></div>
            <p className="text-[15px] text-silver leading-[1.75] font-light max-w-xl">Free instant strategy powered by live web research. Paid tiers built from your specific questionnaire — pointed, not generic.</p>
          </div>
          <div className="flex gap-1 border border-lead rounded-lg p-1 bg-onyx w-fit mb-9">
            {([['a','⚡ Instant','60s · Free','instant'],['b','🎯 Custom','4 steps · $2,500','custom'],['c','🔧 Function','Per function · $5,000','function']] as const).map(([k,name,meta,tab]) => (
              <button key={k} onClick={() => setActiveTab(tab)} className={`px-7 py-2.5 rounded-md text-[13px] transition-all flex flex-col items-center gap-0.5 min-w-[160px] ${activeTab === tab ? 'bg-carbon text-paper border border-amber/25' : 'text-zinc hover:text-silver'}`}>
                <span className="font-medium">{name}</span>
                <span className={`font-mono text-[9px] tracking-wider ${activeTab === tab ? 'text-amber' : 'text-zinc'}`}>{meta}</span>
              </button>
            ))}
          </div>
          {activeTab === 'instant' && <InstantStrategy sessionId={SESSION_ID} />}
          {activeTab === 'custom' && <CustomStrategy sessionId={SESSION_ID} onSelectInstant={() => setActiveTab('instant')} />}
          {activeTab === 'function' && <FunctionStrategy sessionId={SESSION_ID} />}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 border-t border-lead bg-onyx">
        <PricingSection />
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 border-t border-lead">
        <ContactSection />
      </section>

      {/* Workshops */}
      <section id="workshops" className="py-28 border-t border-lead bg-onyx">
        <div className="max-w-[1240px] mx-auto px-12">
          <div className="mb-14">
            <div className="font-serif text-[clamp(34px,4vw,56px)] font-light mb-3">Executive AI Workshops.<br /><em className="italic text-amber">Where strategy becomes action.</em></div>
          </div>
          <div className="grid grid-cols-4 border border-lead rounded-lg overflow-hidden">
            {[['⚡','AI Accelerator Half-Day','4hr · Up to 15 execs','$4,200'],['🎯','Board AI Briefing','2hr · Board & investors','$1,800'],['🏆','AI Design Sprint 2-Day','2 days · Up to 12 execs','$14,500'],['🏅','AI Innovation Lab 5-Day','5 days · Cross-functional','$30,000']].map(([icon,name,meta,price]) => (
              <div key={name} className="p-7 border-r border-lead last:border-r-0 hover:bg-carbon/50 transition-colors group">
                <div className="text-xl mb-4">{icon}</div>
                <div className="font-serif text-[19px] font-light mb-2">{name}</div>
                <div className="text-xs text-zinc mb-3">{meta}</div>
                <div className="font-serif text-2xl font-light text-amber mb-4">{price}</div>
                <button onClick={() => sTo('#contact')} className="w-full py-2 border border-lead rounded text-xs text-zinc hover:text-paper hover:border-graph transition-all">Book →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARIA Chat */}
      <ARIAChat sessionId={SESSION_ID} />

      {/* Footer */}
      <footer className="py-16 border-t border-lead bg-onyx">
        <div className="max-w-[1240px] mx-auto px-12">
          <div className="flex justify-between items-center">
            <div className="font-serif text-2xl font-light">AI<span className="text-amber italic">in</span><em className="italic text-zinc">Box</em></div>
            <p className="text-xs text-zinc">© 2026 AI in a Box · hello@aiinbox.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Instant Strategy ───────────────────────────────────────
function InstantStrategy({ sessionId }: { sessionId: string }) {
  const [co, setCo] = useState('')
  const [ind, setInd] = useState('')
  const [sz, setSz] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(0)

  const steps = ['Searching web for industry AI landscape...', 'Analysing competitor AI adoption...', 'Identifying proven use cases...', 'Claude Opus generating your strategy...', 'Preparing board-ready report...']

  useEffect(() => {
    if (!loading) return
    setStep(0)
    const iv = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 900)
    return () => clearInterval(iv)
  }, [loading])

  const generate = async () => {
    if (!co.trim() || !ind) return
    setLoading(true); setResult(null); setError(null)
    try {
      const res = await strategyApi.instant({ company_name: co, industry: ind, company_size: sz, session_id: sessionId })
      setResult(res.strategy)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const industries = ['Manufacturing','Banking & Financial Services','Healthcare & Pharma','Retail & E-commerce','Technology & SaaS','Energy & Utilities','Logistics & Supply Chain','Automotive','Real Estate & Construction','Education & Ed-tech','Consumer Goods & FMCG','Telecommunications']

  return (
    <div className="grid grid-cols-[340px_1fr] gap-6 items-start">
      <div className="sticky top-20 bg-carbon border border-lead rounded-lg p-7">
        <div className="font-mono text-[9px] tracking-widest text-amber uppercase mb-4">⚡ Free Instant Strategy</div>
        <p className="text-[13px] text-silver mb-5 leading-relaxed font-light">Enter your company and industry. We search the web live then generate a board-ready strategy in under 60 seconds.</p>
        <div className="mb-4">
          <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Company Name *</label>
          <input value={co} onChange={e => setCo(e.target.value)} placeholder="e.g. Tata Steel, HDFC Bank…" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber focus:ring-1 focus:ring-amber/20 transition-all" />
        </div>
        <div className="mb-4">
          <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Industry *</label>
          <select value={ind} onChange={e => setInd(e.target.value)} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all appearance-none">
            <option value="">Select industry…</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Company Size</label>
          <select value={sz} onChange={e => setSz(e.target.value)} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all appearance-none">
            <option value="">Optional…</option>
            {['Startup — under 100','SME — 100 to 500','Mid-market — 500 to 5,000','Enterprise — 5,000 to 50,000','Large Enterprise — 50,000+'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={!co.trim() || !ind || loading} className="w-full py-3 bg-paper text-ink text-[13px] font-medium rounded hover:-translate-y-px transition-all disabled:opacity-40 disabled:pointer-events-none">
          {loading ? 'Generating…' : 'Generate strategy →'}
        </button>
        <p className="text-center font-mono text-[9px] tracking-widest text-zinc mt-2">FREE · NO CREDIT CARD · PDF INCLUDED</p>
      </div>
      <div>
        {!loading && !result && !error && (
          <div className="flex flex-col items-center justify-center min-h-[360px] border border-dashed border-lead rounded-lg p-12 text-center">
            <div className="text-4xl opacity-20 mb-4">⚡</div>
            <div className="font-serif text-2xl font-light text-zinc mb-2">Your strategy appears here</div>
            <p className="text-[13px] text-zinc max-w-xs leading-relaxed">We search the web live then build your high-level strategy in under 60 seconds.</p>
          </div>
        )}
        {loading && (
          <div className="border border-lead rounded-lg p-7 animate-fade-in">
            <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-4">Generating your strategy…</div>
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs mb-1.5 transition-all border ${i < step ? 'text-jade border-transparent' : i === step ? 'bg-cyan/5 border-cyan/20 text-paper' : 'text-zinc border-transparent'}`}>
                <span className="w-4 text-center">{i < step ? '✓' : i === step ? '→' : '·'}</span>{s}
              </div>
            ))}
            <div className="h-px bg-lead mt-4 overflow-hidden rounded">
              <div className="h-full bg-gradient-to-r from-cyan to-violet transition-all duration-500" style={{ width: `${(step / steps.length) * 88}%` }} />
            </div>
          </div>
        )}
        {error && (
          <div className="border border-lead rounded-lg p-7 animate-fade-in">
            <p className="text-rose text-sm mb-2">Error: {error}</p>
            <p className="text-silver text-xs">Make sure the backend is running with a valid ANTHROPIC_API_KEY.</p>
          </div>
        )}
        {result && !loading && <StrategyResult text={result} company={co} industry={ind} type="instant" />}
      </div>
    </div>
  )
}

// ── Strategy Result display ────────────────────────────────
function StrategyResult({ text, company, industry, type }: { text: string; company: string; industry: string; type: string }) {
  const sections = text.split(/\n(?=[1-9]\.|#{1,3}\s)/).filter(Boolean)
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
  const color = type === 'custom' ? '#BC8CFF' : type === 'function' ? '#58A6FF' : '#E6933A'

  const doPDF = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<!DOCTYPE html><html><head><title>AI Strategy — ${company}</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;color:#111;line-height:1.7;font-size:15px}
h1{font-size:26px;margin-bottom:4px}h2{font-size:14px;color:#666;font-weight:400;margin-bottom:22px}
.s{margin-bottom:20px;padding:14px;border:1px solid #e0e0e0;border-radius:6px}
.t{font-size:10px;letter-spacing:1.4px;color:#888;margin-bottom:7px;text-transform:uppercase;font-family:monospace}
.disc{padding:10px 13px;background:#fff8e1;border:1px solid #f59e0b;border-radius:5px;font-size:12px;color:#666;margin-bottom:18px}
footer{margin-top:28px;font-size:10px;color:#aaa;border-top:1px solid #eee;padding-top:14px}</style></head><body>`)
    w.document.write(`<h1>AI Strategy: ${company}</h1><h2>${industry} · ${date}</h2>`)
    w.document.write(`<div class="disc">⚠ Strategy powered by Claude Opus · AI in a Box · aiinbox.com</div>`)
    sections.forEach(sec => {
      const lines = sec.trim().split('\n')
      const hd = lines[0].replace(/^[#\d.\s]+/, '').trim()
      const body = lines.slice(1).join('\n').trim()
      w.document.write(`<div class="s"><div class="t">${hd}</div><div>${body || sec}</div></div>`)
    })
    w.document.write(`<footer>Generated by AI in a Box · Powered by Anthropic Claude Opus · © 2026</footer></body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  return (
    <div className="animate-fade-in">
      <div className="border border-lead rounded-lg overflow-hidden">
        <div className="px-7 py-6 bg-onyx border-b border-lead">
          <div className="font-mono text-[9px] tracking-widest mb-2" style={{ color }}>AI Strategy Report · {date}</div>
          <div className="font-serif text-2xl font-light mb-2">{company}</div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono" style={{ background: color + '15', border: `1px solid ${color}30`, color }}>{industry}</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-jade/10 border border-jade/20 text-jade">Claude Opus · Live web research</span>
          </div>
        </div>
        <div className="px-7 divide-y divide-lead">
          {sections.map((sec, i) => {
            const lines = sec.trim().split('\n')
            const hd = lines[0].replace(/^[#\d.\s]+/, '').trim()
            const body = lines.slice(1).join('\n').trim()
            return (
              <div key={i} className="py-5 group hover:pl-3.5 transition-all border-l-2 border-l-transparent hover:border-l-amber">
                <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-2">{hd}</div>
                <p className="text-[12px] text-silver leading-relaxed whitespace-pre-line">{body || sec}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <button onClick={doPDF} className="flex-1 py-3 bg-amber text-ink text-[13px] font-semibold rounded hover:-translate-y-px hover:shadow-lg transition-all">📥 Download PDF →</button>
        <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 py-3 border border-lead text-paper text-[13px] rounded hover:bg-carbon transition-all">📞 Talk to an expert</button>
      </div>
    </div>
  )
}

// ── Custom Strategy (simplified 4-step) ───────────────────
function CustomStrategy({ sessionId, onSelectInstant }: { sessionId: string; onSelectInstant: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await strategyApi.custom({ answers, session_id: sessionId })
      setResult(res.strategy)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }))

  const steps = [
    { label: 'Organisation', fields: [
      { id: 'co', label: 'Company Name', type: 'text', ph: 'Your organisation name' },
      { id: 'ind', label: 'Industry', type: 'select', opts: ['Manufacturing','Banking & Financial Services','Healthcare & Pharma','Retail & E-commerce','Technology & SaaS','Energy & Utilities','Logistics & Supply Chain','Automotive','Consumer Goods & FMCG','Telecommunications'] },
      { id: 'role', label: 'Your Role', type: 'select', opts: ['CEO / Founder','CFO','CIO / CTO','CHRO','COO','CMO','VP / Director','Manager','Consultant'] },
    ]},
    { label: 'AI Maturity', qs: [
      { id: 'ai_use', q: 'What best describes your current AI usage?', opts: ['No AI at all — starting from scratch','Experimenting with ChatGPT personally','Some AI pilots, not in production','AI actively used in one production system','AI is core across multiple areas'] },
      { id: 'data', q: 'How would you describe your data infrastructure?', opts: ['Siloed — fragmented, no integration','Basic — databases, limited analytics','Developing — data warehouse, some reporting','Strong — good platform, some ML','Advanced — real-time, ML in production'] },
    ]},
    { label: 'Objectives', qs: [
      { id: 'goal', q: 'What is the PRIMARY driver for your AI strategy?', opts: ['Cost reduction','Revenue growth','Competitive pressure','Operational efficiency','Customer experience','Risk & compliance'] },
      { id: 'fn', q: 'Which function is your TOP priority for AI?', opts: ['Operations / Manufacturing','Finance / Risk','Sales / Marketing / CX','HR / Talent','IT / Technology','All functions — enterprise-wide'] },
    ]},
    { label: 'Constraints', qs: [
      { id: 'budget', q: 'What is your realistic annual AI investment budget?', opts: ['Under ₹50 Lakhs','₹50L–₹2 Crore','₹2Cr–₹10 Crore','₹10Cr–₹50 Crore','Above ₹50 Crore'] },
      { id: 'barrier', q: 'What is your biggest barrier to AI adoption?', opts: ['Data quality & availability','Talent & skills gap','Leadership buy-in','Technology debt','Budget constraints','Culture resistance'] },
    ]},
  ]

  if (result) return (
    <div className="grid grid-cols-[340px_1fr] gap-6">
      <div className="bg-carbon border border-lead rounded-lg p-7">
        <div className="font-mono text-[9px] tracking-widest text-violet uppercase mb-3">✓ Custom Strategy Generated</div>
        <div className="font-serif text-xl font-light mb-2">{answers.co}</div>
        <div className="text-xs text-zinc">{answers.ind}</div>
      </div>
      <StrategyResult text={result} company={answers.co || 'Your Organisation'} industry={answers.ind || ''} type="custom" />
    </div>
  )

  return (
    <div className="grid grid-cols-[340px_1fr] gap-6 items-start">
      <div className="sticky top-20 bg-carbon border border-lead rounded-lg p-7">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber/20 bg-amber/10 text-amber font-mono text-[9px] tracking-widest mb-4">🔒 PAID STRATEGY</div>
        <div className="font-serif text-lg font-light mb-2">Why Custom?</div>
        <p className="text-[12px] text-silver leading-relaxed mb-4">The Instant strategy gives you the sector view. Custom is built around <em className="text-paper not-italic">your specific organisation</em>.</p>
        {['50+ org-specific dimensions analysed','Competitor benchmarking in your segment','Use cases ranked by your data readiness','Budget model tuned to your signals'].map(f => (
          <div key={f} className="flex gap-2 items-start text-[12px] text-silver mb-2"><span className="text-jade font-mono mt-px">—</span>{f}</div>
        ))}
        <div className="h-px bg-lead my-4" />
        <div className="font-serif text-4xl font-light text-paper mb-1">$2,500</div>
        <div className="font-mono text-[9px] tracking-widest text-zinc">ONE-TIME · PDF + EXPERT CALL</div>
      </div>
      <div>
        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] transition-all ${i < step ? 'bg-jade text-ink' : i === step ? 'bg-cyan text-ink' : 'bg-onyx border border-lead text-zinc'}`}>{i < step ? '✓' : i + 1}</div>
                <span className={`font-mono text-[9px] tracking-wider ${i === step ? 'text-cyan' : i < step ? 'text-jade' : 'text-zinc'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 -mt-5 transition-all ${i < step ? 'bg-jade' : 'bg-lead'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-carbon border border-lead rounded-lg p-7">
          <div className="font-mono text-[9px] tracking-widest text-violet uppercase mb-5">Step {step + 1} of {steps.length} — {steps[step].label}</div>
          {'fields' in steps[step] && (steps[step] as any).fields.map((f: any) => (
            <div key={f.id} className="mb-4">
              <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">{f.label}</label>
              {f.type === 'text'
                ? <input value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)} placeholder={f.ph} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" />
                : <select value={answers[f.id] || ''} onChange={e => set(f.id, e.target.value)} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all appearance-none">
                    <option value="">Select…</option>
                    {f.opts.map((o: string) => <option key={o}>{o}</option>)}
                  </select>
              }
            </div>
          ))}
          {'qs' in steps[step] && (steps[step] as any).qs.map((q: any) => (
            <div key={q.id} className="mb-6">
              <div className="font-serif text-[18px] font-light mb-3">{q.q}</div>
              {q.opts.map((o: string, i: number) => (
                <button key={o} onClick={() => set(q.id, o)} className={`w-full text-left px-3.5 py-2.5 mb-2 rounded border text-[12px] transition-all flex items-start gap-2.5 ${answers[q.id] === o ? 'border-cyan bg-cyan/7 text-paper' : 'border-lead bg-onyx text-silver hover:border-graph hover:text-paper'}`}>
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] flex-shrink-0 mt-px ${answers[q.id] === o ? 'bg-cyan text-ink' : 'bg-cyan/10 text-cyan'}`}>{'ABCDE'[i]}</span>
                  {o}
                </button>
              ))}
            </div>
          ))}
          {error && <p className="text-rose text-xs mb-3">{error}</p>}
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="px-4 py-2 border border-lead rounded text-[12px] text-zinc hover:text-paper disabled:opacity-0 transition-all">← Back</button>
            <button onClick={() => {
              if (step < steps.length - 1) { setStep(s => s + 1) }
              else { generate() }
            }} disabled={loading} className="px-6 py-2 bg-paper text-ink text-[12px] font-medium rounded hover:-translate-y-px transition-all disabled:opacity-60">
              {loading ? 'Generating…' : step < steps.length - 1 ? 'Continue →' : 'Generate my strategy →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Function Strategy (simplified) ────────────────────────
function FunctionStrategy({ sessionId }: { sessionId: string }) {
  const [fn, setFn] = useState('')
  const [co, setCo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fns = [['💰','Finance','CFO · FP&A · Treasury'],['👥','People & HR','CHRO · Talent · L&D'],['⚙️','Operations','COO · Supply Chain'],['📣','Sales & Marketing','CMO · Revenue · CX'],['🏗️','IT & Technology','CIO · CTO · Data'],['⭐','Customer Experience','Service · Support · NPS']]

  const generate = async () => {
    if (!fn || !co) return
    setLoading(true); setError(null)
    try {
      const res = await strategyApi.function({ company_name: co, function_name: fn, session_id: sessionId })
      setResult(res.strategy)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (result) return (
    <div className="grid grid-cols-[340px_1fr] gap-6">
      <div className="bg-carbon border border-lead rounded-lg p-7">
        <div className="font-mono text-[9px] tracking-widest text-cyan uppercase mb-3">✓ {fn} Strategy</div>
        <div className="font-serif text-xl font-light">{co}</div>
      </div>
      <StrategyResult text={result} company={co} industry={fn} type="function" />
    </div>
  )

  return (
    <div className="grid grid-cols-[340px_1fr] gap-6 items-start">
      <div className="sticky top-20 bg-carbon border border-lead rounded-lg p-7">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber/20 bg-amber/10 text-amber font-mono text-[9px] tracking-widest mb-4">🔒 PAID STRATEGY</div>
        <div className="font-serif text-lg font-light mb-2">Function-specific.<br />Deeply tailored.</div>
        <p className="text-[12px] text-silver leading-relaxed mb-4">A pointed AI strategy for one function, built on exactly how that function operates in your organisation.</p>
        <div className="h-px bg-lead my-4" />
        <div className="font-serif text-4xl font-light text-paper mb-1">$5,000</div>
        <div className="font-mono text-[9px] tracking-widest text-zinc">PER FUNCTION · PDF + EXPERT REVIEW</div>
      </div>
      <div>
        <p className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-4">Select your function to begin</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {fns.map(([icon, name, role]) => (
            <button key={name} onClick={() => setFn(name)} className={`p-5 rounded-lg border text-left transition-all ${fn === name ? 'border-amber bg-amber/6' : 'border-lead bg-onyx hover:border-graph hover:bg-carbon'}`}>
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-[13px] font-medium text-paper mb-1">{name}</div>
              <div className="font-mono text-[9px] tracking-wider text-zinc">{role}</div>
            </button>
          ))}
        </div>
        {fn && (
          <div className="bg-carbon border border-lead rounded-lg p-7 animate-fade-in">
            <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-3">Company Name</div>
            <input value={co} onChange={e => setCo(e.target.value)} placeholder={`e.g. Tata Steel`} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all mb-4" />
            {error && <p className="text-rose text-xs mb-3">{error}</p>}
            <button onClick={generate} disabled={!co.trim() || loading} className="w-full py-3 bg-amber text-ink text-[13px] font-semibold rounded hover:-translate-y-px transition-all disabled:opacity-40">
              {loading ? 'Generating…' : `Generate ${fn} AI Strategy →`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Pricing ────────────────────────────────────────────────
function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const plans = [
    { name: 'Starter', color: '#3FB950', pm: 0, pa: 0, tag: 'Free forever', cta: 'Get started free →', features: ['3 instant strategies/month','Basic AI maturity assessment','Industry use case snapshot','PDF download free','Community access'] },
    { name: 'Professional', color: '#58A6FF', pm: 249, pa: 199, tag: '/month', hot: true, cta: 'Start 14-day free trial →', features: ['Unlimited instant strategies','Custom strategy access','All 6 function modules','AI maturity assessment','Priority support'] },
    { name: 'Enterprise', color: '#BC8CFF', pm: 799, pa: 649, tag: '/month', cta: 'Book a demo →', features: ['Everything in Professional','Dedicated AI consultant 8hr/mo','All executive dashboards','Custom agent development','SLA-backed support'] },
    { name: 'Executive', color: '#E6933A', pm: null, pa: null, tag: 'Custom', cta: 'Talk to us →', features: ['Full transformation partnership','All C-suite AI packages','End-to-end deployment','Resident AI expert dedicated','Outcome-based success fees'] },
  ]

  return (
    <div className="max-w-[1240px] mx-auto px-12">
      <div className="text-center mb-12">
        <div className="font-serif text-[clamp(34px,4.2vw,58px)] font-light mb-3">Start free.<br /><em className="italic" style={{ background: 'linear-gradient(135deg,#E6933A,#E3B341)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scale as you grow.</em></div>
        <div className="flex items-center justify-center gap-2 mt-6">
          {['Monthly', 'Annual'].map((l, i) => (
            <button key={l} onClick={() => setAnnual(i === 1)} className={`px-5 py-2 rounded text-[13px] transition-all ${annual === (i === 1) ? 'bg-carbon text-paper border border-lead' : 'text-zinc'}`}>{l}{i === 1 && <span className="ml-1 text-jade text-[11px]">–20%</span>}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 border border-lead rounded-lg overflow-hidden bg-lead gap-px">
        {plans.map(p => {
          const price = p.pm !== null ? (annual ? p.pa : p.pm) : null
          return (
            <div key={p.name} className={`bg-carbon p-8 flex flex-col relative ${p.hot ? 'bg-onyx' : ''}`}>
              {p.hot && <div className="absolute top-0 inset-x-0 h-0.5 bg-amber" />}
              <div className="font-mono text-[9.5px] tracking-widest text-zinc mb-4">{p.name.toUpperCase()}</div>
              <div className="font-serif text-[46px] font-light leading-none mb-1" style={{ color: p.color }}>{price !== null ? `$${price}` : 'Custom'}<span className="text-base font-light text-zinc">{price !== null ? '/mo' : ''}</span></div>
              <div className="font-mono text-[9.5px] tracking-wider text-zinc mb-5">{p.tag}{annual && price !== null ? ' · 20% off' : ''}</div>
              <div className="h-px bg-lead mb-5" />
              <div className="flex-1 flex flex-col gap-2.5 mb-6">
                {p.features.map(f => <div key={f} className="text-[12px] text-silver flex gap-2.5"><span className="text-jade font-mono">–</span>{f}</div>)}
              </div>
              <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded text-[13px] font-medium transition-all hover:-translate-y-px" style={{ background: p.hot ? '#F0F6FC' : p.name === 'Executive' ? '#E6933A' : 'transparent', color: p.hot || p.name === 'Executive' ? '#07090D' : '#F0F6FC', border: p.hot || p.name === 'Executive' ? 'none' : '1px solid #21262D' }}>{p.cta}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Contact ────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', interest: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.email || !form.company) { setError('Please fill in required fields'); return }
    setLoading(true); setError('')
    try {
      await contactApi.submit(form)
      setDone(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1240px] mx-auto px-12">
      <div className="grid grid-cols-2 gap-16">
        <div>
          <div className="font-serif text-[clamp(28px,3vw,44px)] font-light mb-3">Let's talk<br /><em className="italic text-amber">transformation.</em></div>
          <p className="text-silver text-[15px] mb-8">Expert response within 24 hours. Enterprise enquiries same day.</p>
          {done ? (
            <div className="p-8 border border-jade/30 rounded-lg bg-jade/5 text-center">
              <div className="w-12 h-12 rounded-full bg-jade/20 flex items-center justify-center text-jade text-2xl mx-auto mb-4">✓</div>
              <div className="font-serif text-xl font-light mb-2">Message received.</div>
              <p className="text-silver text-sm">We'll have an expert reach out within 24 hours.</p>
            </div>
          ) : (
            <div className="bg-carbon border border-lead rounded-lg p-7">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div><label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Your name *</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rahul Sharma" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" /></div>
                <div><label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Company *</label><input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your company" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" /></div>
              </div>
              <div className="mb-4"><label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Work email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="rahul@company.com" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" /></div>
              <div className="mb-4"><label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" /></div>
              <div className="mb-4">
                <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">I'm interested in</label>
                <select value={form.interest} onChange={e => set('interest', e.target.value)} className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all appearance-none">
                  <option value="">Select…</option>
                  {['Free AI Strategy','AI Design Sprint ($14,500)','AI Accelerator Half-Day ($4,200)','Board AI Briefing ($1,800)','Executive Package','Full Enterprise Transformation','Resident AI Expert ($7,200/mo)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="mb-6"><label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-1.5">Message</label><textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4} placeholder="Tell us about your AI transformation goals…" className="w-full px-3.5 py-2.5 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all resize-y" /></div>
              {error && <p className="text-rose text-xs mb-3">{error}</p>}
              <button onClick={submit} disabled={loading} className="w-full py-3.5 bg-paper text-ink text-[13px] font-medium rounded hover:-translate-y-px transition-all disabled:opacity-60">
                {loading ? 'Sending…' : 'Send message →'}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4">
          {[['Email','hello@aiinbox.com','Response within 24 hours'],['Phone','+91 98765 43210','Mon–Fri 9am–7pm IST'],['Location','Mumbai, India','Available globally, remote & in-person']].map(([l, v, n]) => (
            <div key={l} className="p-6 border border-lead rounded-lg hover:bg-carbon/50 transition-colors">
              <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-1">{l}</div>
              <div className="text-paper text-[15px] mb-1">{v}</div>
              <div className="text-zinc text-xs">{n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ARIA Chat ──────────────────────────────────────────────
function ARIAChat({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && msgs.length === 0) {
      setTimeout(() => addBot("Hi! I'm ARIA. Ask me about our AI strategies, workshops, pricing, or any AI transformation question — I use Claude Opus for complex queries!"), 350)
    }
  }, [open])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const addBot = (text: string) => setMsgs(m => [...m, { role: 'bot', text }])

  const send = async () => {
    const t = input.trim(); if (!t) return
    setInput(''); setMsgs(m => [...m, { role: 'user', text: t }]); setTyping(true)
    try {
      const res = await ariaApi.chat(t, sessionId)
      setMsgs(m => [...m, { role: 'bot', text: res.reply }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: "I'm having trouble connecting. Please try again." }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[8000] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] bg-carbon border border-lead rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 bg-onyx border-b border-lead">
            <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="text-[13px] font-medium">ARIA — AI in a Box</div>
              <div className="font-mono text-[9px] text-zinc flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />Powered by Claude Opus</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-zinc hover:text-paper text-lg leading-none">×</button>
          </div>
          <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-amber/20 text-paper self-end' : 'bg-onyx text-silver self-start'}`}>{m.text}</div>
            ))}
            {typing && <div className="flex gap-1 self-start px-3 py-2"><span className="w-1.5 h-1.5 rounded-full bg-zinc animate-[pulse_1s_ease_infinite]" style={{ animationDelay: '0s' }} /><span className="w-1.5 h-1.5 rounded-full bg-zinc animate-[pulse_1s_ease_infinite]" style={{ animationDelay: '.2s' }} /><span className="w-1.5 h-1.5 rounded-full bg-zinc animate-[pulse_1s_ease_infinite]" style={{ animationDelay: '.4s' }} /></div>}
            <div ref={endRef} />
          </div>
          <div className="flex gap-2 p-3 border-t border-lead">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask anything…" className="flex-1 px-3 py-2 bg-onyx border border-lead rounded text-[13px] text-paper outline-none focus:border-amber transition-all" />
            <button onClick={send} className="px-3 py-2 bg-amber text-ink rounded text-sm">➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} className="w-14 h-14 bg-amber text-ink rounded-full shadow-xl text-2xl hover:scale-110 hover:shadow-amber/30 transition-all">🤖</button>
    </div>
  )
}

export default App
