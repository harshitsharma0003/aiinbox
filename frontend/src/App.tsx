/// <reference types="vite/client" />
import { useState, useEffect, useRef, useCallback } from 'react'
import { strategyApi, contactApi, ariaApi, paymentApi } from './lib/api'
import CSuitePackages from './components/CSuitePackages'
import FunctionStrategyFull from './components/FunctionStrategyFull'
import SlideViewer from './components/SlideViewer'

// ── Constants ──────────────────────────────────────────────
const SESSION_ID = 'sess_' + Math.random().toString(36).slice(2) + '_' + Date.now()
const SB_URL = 'https://pvagktgspxyizzcdglsm.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2YWdrdGdzcHh5aXp6Y2RnbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzkyNzAsImV4cCI6MjA5NjMxNTI3MH0.jlZcM40xNX5jnedCaKU6M7ou4OCiRZeISPKJC_wbCQ4'
const RZP_KEY = (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_placeholder'

async function sbTrack(table: string, data: Record<string, unknown>) {
  try {
    await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Prefer': 'return=minimal' },
      body: JSON.stringify(data)
    })
  } catch { /* silent */ }
}

const INR = (n: number) => '₹' + n.toLocaleString('en-IN')
const PRICES = {
  custom:   209000,
  function: 418000,
}

// ── Razorpay loader ────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
}

// ══════════════════════════════════════════════════════════
//  PAYMENT MODAL
// ══════════════════════════════════════════════════════════
interface PaymentModalProps {
  open: boolean; planName: string; priceLabel: string; amountInr: number
  onClose: () => void; onSuccess: (id: string) => void; onFailure: (r: string) => void
}
function PaymentModal({ open, planName, priceLabel, amountInr, onClose, onSuccess, onFailure }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'failed'>('form')
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [company, setCompany] = useState('')
  const [err, setErr] = useState(''); const [payId, setPayId] = useState(''); const [failMsg, setFailMsg] = useState('')

  useEffect(() => { if (open) { setStep('form'); setErr(''); setName(''); setEmail(''); setCompany('') } }, [open])

  const pay = async () => {
    if (!name.trim() || !email.includes('@') || !company.trim()) { setErr('Please fill all fields'); return }
    setErr(''); setStep('processing')
    await sbTrack('orders', { plan_name: planName, plan_amount_inr: amountInr, amount_inr: amountInr, billing_cycle: 'one-time', customer_name: name, customer_email: email, customer_company: company, payment_status: 'pending', currency: 'INR' })
    const loaded = await loadRazorpay()
    if (!loaded) { setStep('failed'); setFailMsg('Could not load Razorpay. Check your connection.'); return }
    try {
      let rzpOrderId = ''
      try {
        const ord = await paymentApi.createOrder({ plan_name: planName, amount_inr: amountInr, customer_name: name, customer_email: email, customer_company: company })
        rzpOrderId = ord.razorpay_order_id
      } catch { /* proceed without */ }
      const rzp = new (window as any).Razorpay({
        key: RZP_KEY, amount: amountInr * 100, currency: 'INR',
        name: 'AI in a Box', description: planName,
        order_id: rzpOrderId || undefined,
        prefill: { name, email },
        theme: { color: '#E6933A' },
        handler: async (resp: any) => {
          await sbTrack('payment_attempts', { razorpay_order_id: resp.razorpay_order_id || rzpOrderId, razorpay_payment_id: resp.razorpay_payment_id, status: 'paid', amount_inr: amountInr })
          setPayId(resp.razorpay_payment_id); setStep('success'); onSuccess(resp.razorpay_payment_id)
        },
        modal: { ondismiss: async () => {
          await sbTrack('payment_attempts', { razorpay_order_id: rzpOrderId, status: 'cancelled', amount_inr: amountInr })
          setStep('failed'); setFailMsg('Payment was cancelled.'); onFailure('cancelled')
        }},
      })
      rzp.on('payment.failed', async (resp: any) => {
        await sbTrack('payment_attempts', { razorpay_order_id: rzpOrderId, razorpay_payment_id: resp.error?.metadata?.payment_id, status: 'failed', error_code: resp.error?.code, error_description: resp.error?.description, amount_inr: amountInr })
        setStep('failed'); setFailMsg(resp.error?.description || 'Payment failed.'); onFailure(resp.error?.description)
      })
      rzp.open()
    } catch (e: any) { setStep('failed'); setFailMsg(e.message || 'Something went wrong.'); onFailure(e.message) }
  }

  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lead" style={{ background: 'rgba(7,9,13,.9)' }}>
          <div>
            <div className="mono-label accent mb-1">Secure Checkout</div>
            <div className="font-serif text-lg font-light text-paper">{planName}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc hover:text-paper hover:bg-lead transition-all text-lg">×</button>
        </div>
        <div className="p-6">
          {/* Price */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-amber/20 mb-5" style={{ background: 'rgba(230,147,58,.05)' }}>
            <span className="mono-label">Amount to pay</span>
            <span className="font-serif text-2xl font-light text-amber">{priceLabel}</span>
          </div>

          {step === 'form' && (
            <>
              <div className="flex flex-col gap-3 mb-4">
                {[['Full Name', name, setName, 'text', 'Rahul Sharma'],['Work Email', email, setEmail, 'email', 'rahul@company.com'],['Company', company, setCompany, 'text', 'Your company']].map(([l, v, sv, t, ph]: any) => (
                  <div key={l}>
                    <div className="mono-label mb-1.5">{l} *</div>
                    <input type={t} value={v} onChange={e => sv(e.target.value)} placeholder={ph} className="ai-input" />
                  </div>
                ))}
              </div>
              {err && <p className="text-rose text-xs mb-3 font-mono">{err}</p>}
              <button onClick={pay} className="btn-amber w-full justify-center mb-3">Pay {priceLabel} via Razorpay →</button>
              <div className="flex items-center justify-center gap-2">
                <span className="mono-label">🔒 UPI · Cards · NetBanking · Wallets · EMI</span>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-amber/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-amber border-t-transparent animate-spin-slow" />
              </div>
              <div className="font-serif text-lg text-paper mb-1">Opening Razorpay…</div>
              <p className="text-zinc text-xs">Complete payment in the secure Razorpay window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl text-jade animate-glow-cyan" style={{ background: 'rgba(63,185,80,.15)', border: '2px solid #3FB950' }}>✓</div>
              <div className="font-serif text-xl text-paper mb-2">Payment Confirmed!</div>
              <p className="text-silver text-sm mb-4">Your strategy is generating now.</p>
              <div className="p-3 rounded-lg border border-jade/20 mb-4" style={{ background: 'rgba(63,185,80,.05)' }}>
                <div className="mono-label mb-1">Payment ID</div>
                <div className="font-mono text-[11px] text-jade break-all">{payId}</div>
              </div>
              <button onClick={onClose} className="btn-amber w-full justify-center">Continue →</button>
            </div>
          )}

          {step === 'failed' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl text-rose" style={{ background: 'rgba(248,81,73,.15)', border: '2px solid #F85149' }}>✕</div>
              <div className="font-serif text-xl text-paper mb-2">Payment Failed</div>
              <p className="text-silver text-sm mb-4">{failMsg}</p>
              <button onClick={() => setStep('form')} className="btn-amber w-full justify-center mb-2">Try Again →</button>
              <button onClick={onClose} className="btn-outline w-full justify-center">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  COUNTDOWN TIMER
// ══════════════════════════════════════════════════════════
function CountdownTimer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const iv = setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(iv)
  }, [])
  const pct = ((seconds - left) / seconds) * 100
  const m = Math.floor(left / 60); const s = left % 60
  const r = 15.9; const circ = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(33,38,45,.8)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r={r} fill="none" stroke="var(--amber)" strokeWidth="2.5"
            strokeDasharray={`${pct / 100 * circ} ${circ}`} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-amber font-bold">{left}</div>
      </div>
      <div>
        <div className="mono-label mb-0.5">Generating</div>
        <div className="font-mono text-[14px] text-paper">{m}:{s.toString().padStart(2,'0')} left</div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState<'instant'|'custom'|'function'>('instant')
  const [payment, setPayment] = useState<{open:boolean;plan:string;price:string;inr:number;onPaid:()=>void}|null>(null)

  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('nav')
      const bar = document.getElementById('prog')
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40)
      if (bar) { const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100; bar.style.width = p + '%' }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const openPayment = (plan: string, price: string, inr: number, onPaid: () => void) =>
    setPayment({ open: true, plan, price, inr, onPaid })

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <div id="prog" className="prog-bar" style={{ width: '0%' }} />
      {payment && (
        <PaymentModal open={payment.open} planName={payment.plan} priceLabel={payment.price} amountInr={payment.inr}
          onClose={() => setPayment(null)} onSuccess={() => { setPayment(null); payment.onPaid() }} onFailure={() => {}} />
      )}

      {/* ── NAV ── */}
      <nav id="nav" className="fixed inset-x-0 top-0 z-[9000] h-[60px] flex items-center transition-all duration-300">
        <style>{`#nav.scrolled{background:rgba(7,9,13,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(33,38,45,.8);}`}</style>
        <div className="max-w-[1240px] mx-auto px-8 w-full flex items-center justify-between">
          <button onClick={() => sTo('#hero')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border border-lead group-hover:border-amber transition-colors" style={{ background: 'rgba(230,147,58,.1)' }}>⬡</div>
            <span className="font-serif text-lg font-light">AI<span className="text-amber italic">in</span>Box</span>
          </button>
          <div className="hidden md:flex gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[['#services','Strategy'],['#csuite','Packages'],['#workshops','Workshops'],['#pricing','Pricing'],['#contact','Contact']].map(([id,l]) => (
              <button key={id} onClick={() => sTo(id)} className="px-4 py-2 text-zinc text-[13px] hover:text-paper transition-colors rounded-lg hover:bg-carbon/50">{l}</button>
            ))}
          </div>
          <button onClick={() => sTo('#services')} className="btn-amber py-2 px-5 text-[13px]">Start free →</button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div className="mt-[60px] h-[34px] overflow-hidden flex items-center border-b border-lead" style={{ background: 'rgba(13,17,23,.95)', maskImage: 'linear-gradient(90deg,transparent,black 5%,black 95%,transparent)' }}>
        <div className="ticker-inner inline-flex whitespace-nowrap">
          {[...Array(2)].map((_,ri) => (
            <span key={ri} className="inline-flex">
              {['AI CONSULTING $72.8B BY 2030','CAGR 31.6%','86% OF BUYERS SEEK AI-ENABLED FIRMS','SME 35.9% CAGR — FASTEST GROWING','BCG AI REVENUE 40% OF TOTAL 2026','95% OF AI PILOTS FAIL WITHOUT STRATEGY'].map((t,i) => (
                <span key={i} className="inline-flex items-center gap-2.5 px-7 font-mono text-[9.5px] tracking-wide text-zinc border-r border-lead">
                  {i===0 && <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse flex-shrink-0"/>}
                  <span dangerouslySetInnerHTML={{ __html: t.replace(/(\$[\d.]+B|\d+\.?\d*%)/g, '<strong style="color:#E6933A">$1</strong>') }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <HeroSection sTo={sTo} />

      {/* ── STRATEGY ── */}
      <section id="services" className="py-28 border-t border-lead">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="mb-12">
            <div className="section-head"><div className="line"/><span className="mono-label accent">01 · Three Strategy Tiers</span></div>
            <h2 className="font-serif font-light tracking-tight mb-3" style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1.06 }}>
              Instant. Custom. <em className="italic grad-amber">Function.</em>
            </h2>
            <p className="text-silver text-[15px] leading-relaxed max-w-lg font-light">Free instant strategy powered by live web research. Paid tiers built from your specific questionnaire.</p>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1 border border-lead rounded-xl p-1 w-fit mb-8" style={{ background: 'rgba(13,17,23,.8)' }}>
            {([['instant','⚡ Instant','60 sec · Free'],['custom','🎯 Custom','Questionnaire · '+INR(PRICES.custom)],['function','🔧 Function','6 questions · '+INR(PRICES.function)]] as const).map(([t,name,meta]) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-6 py-2.5 rounded-lg text-[13px] transition-all flex flex-col items-center gap-0.5 min-w-[165px]"
                style={{ background: tab===t ? 'var(--carbon)' : 'transparent', border: tab===t ? '1px solid rgba(230,147,58,.2)' : '1px solid transparent', color: tab===t ? 'var(--paper)' : 'var(--zinc)' }}>
                <span className="font-medium">{name}</span>
                <span className="font-mono text-[9px] tracking-wider" style={{ color: tab===t ? 'var(--amber)' : 'var(--zinc)' }}>{meta}</span>
              </button>
            ))}
          </div>

          {tab==='instant'   && <InstantStrategy sessionId={SESSION_ID} />}
          {tab==='custom'    && <CustomStrategy sessionId={SESSION_ID} openPayment={openPayment} />}
          {tab==='function'  && <FunctionStrategyFull sessionId={SESSION_ID} openPayment={openPayment} />}
        </div>
      </section>

      {/* ── C-SUITE PACKAGES ── */}
      <CSuitePackages openPayment={openPayment} />

      {/* ── WORKSHOPS ── */}
      <WorkshopsSection sTo={sTo} />

      {/* ── PRICING ── */}
      <PricingSection openPayment={openPayment} />

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FOOTER ── */}
      <footer className="py-14 border-t border-lead" style={{ background: 'rgba(7,9,13,.95)' }}>
        <div className="max-w-[1240px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-serif text-xl font-light">AI<span className="text-amber italic">in</span><span className="text-zinc">Box</span></div>
          <p className="text-xs text-zinc font-mono">© 2026 AI in a Box · hello@aiinbox.com · All prices in INR · Powered by Claude Opus</p>
        </div>
      </footer>

      {/* ── ARIA ── */}
      <ARIAChat sessionId={SESSION_ID} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  HERO SECTION — AI-themed animated
// ══════════════════════════════════════════════════════════
function HeroSection({ sTo }: { sTo: (id: string) => void }) {
  const [typed, setTyped] = useState('')
  const [typeIdx, setTypeIdx] = useState(0)
  const phrases = ['AI Transformation','Board-Ready Strategy','Competitive Advantage','Enterprise AI Leadership']

  useEffect(() => {
    const phrase = phrases[typeIdx % phrases.length]
    let i = 0
    setTyped('')
    const iv = setInterval(() => {
      i++; setTyped(phrase.slice(0, i))
      if (i >= phrase.length) {
        clearInterval(iv)
        setTimeout(() => setTypeIdx(n => n + 1), 2200)
      }
    }, 60)
    return () => clearInterval(iv)
  }, [typeIdx])

  return (
    <section id="hero" className="relative min-h-[calc(100vh-94px)] flex items-center py-20 overflow-hidden">
      {/* Animated orbs */}
      <div className="orb orb-amber" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
      <div className="orb orb-violet" style={{ width: 600, height: 600, bottom: '-20%', right: '-10%' }} />
      <div className="orb orb-cyan" style={{ width: 350, height: 350, top: '30%', right: '20%' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(33,38,45,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(33,38,45,.4) 1px,transparent 1px)', backgroundSize: '72px 72px', maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%,black,transparent 75%)' }} />

      {/* Scan line */}
      <div className="scan-line" />

      <div className="max-w-[1240px] mx-auto px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-7 px-3 py-1.5 rounded-full border border-jade/30" style={{ background: 'rgba(63,185,80,.05)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
              <span className="mono-label" style={{ color: '#3FB950' }}>Enterprise AI Transformation · Est. 2026</span>
            </div>

            <h1 className="font-serif font-light tracking-tight mb-4" style={{ fontSize: 'clamp(44px,6.5vw,96px)', lineHeight: .98 }}>
              The AI edge<br/>your competitors<br/>
              <span className="grad-amber italic">don't have yet.</span>
            </h1>

            {/* Typewriter */}
            <div className="flex items-center gap-2 mb-6 h-8">
              <span className="mono-label" style={{ color: 'var(--cyan)' }}>→</span>
              <span className="font-mono text-[14px] text-cyan">{typed}<span className="animate-blink">|</span></span>
            </div>

            <p className="text-silver text-[16px] leading-[1.8] max-w-[440px] mb-10 font-light">Board-ready strategy in 60 seconds. Executive design sprints. Full-scale deployment. Built for leaders the Big 4 are too expensive to serve.</p>

            <div className="flex gap-3 flex-wrap mb-4">
              <button onClick={() => sTo('#services')} className="btn-amber animate-glow">Build your strategy →</button>
              <button onClick={() => sTo('#csuite')} className="btn-outline">Explore packages</button>
            </div>
            <p className="mono-label flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse"/>Free · No card · PDF + PPTX download
            </p>
          </div>

          {/* Right — HUD panel */}
          <div className="hidden lg:block">
            <HUDPanel />
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-5 border border-lead rounded-xl overflow-hidden" style={{ background: 'rgba(13,17,23,.7)', backdropFilter: 'blur(12px)' }}>
          {[['$72.8B','Market 2030','amber'],['31.6%','Sector CAGR','cyan'],['86%','Buyers want AI','jade'],['6','Transformation stages','violet'],['95%','Pilots fail w/o guidance','rose']].map(([n,l,c]) => (
            <div key={l} className="px-6 py-5 border-r border-lead last:border-r-0 group cursor-default hover:bg-carbon/50 transition-colors">
              <div className={`font-serif text-[32px] font-light leading-none mb-1 text-${c} group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`}>{n}</div>
              <div className="mono-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── HUD Panel (hero right side) ───────────────────────────
function HUDPanel() {
  const [active, setActive] = useState(0)
  const metrics = [
    { label: 'Strategy Generated', value: 'HDFC Bank · Banking', status: 'complete', color: '#3FB950' },
    { label: 'Model', value: 'Claude Opus · Live Search', status: 'active', color: '#E6933A' },
    { label: 'Sections Built', value: '7 / 7', status: 'complete', color: '#58A6FF' },
    { label: 'Export Ready', value: 'PPTX · PDF · Slides', status: 'ready', color: '#BC8CFF' },
  ]
  useEffect(() => { const iv = setInterval(() => setActive(a => (a+1)%4), 2000); return () => clearInterval(iv) }, [])
  return (
    <div className="relative">
      <div className="glass-card p-6 animate-float-slow" style={{ border: '1px solid rgba(230,147,58,.2)', boxShadow: '0 0 60px rgba(230,147,58,.08)' }}>
        {/* HUD header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-jade animate-pulse" />
            <span className="mono-label" style={{ color: '#3FB950' }}>AI ENGINE · LIVE</span>
          </div>
          <div className="mono-label">v2.1.0</div>
        </div>

        {/* Progress ring */}
        <div className="flex justify-center mb-5">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(33,38,45,.8)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E6933A" strokeWidth="6"
                strokeDasharray="263.9" strokeDashoffset="66" strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-serif text-2xl font-light text-amber">75%</div>
              <div className="mono-label">complete</div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg transition-all"
              style={{ background: active === i ? 'rgba(230,147,58,.06)' : 'transparent', border: `1px solid ${active===i ? 'rgba(230,147,58,.15)' : 'transparent'}` }}>
              <div>
                <div className="mono-label mb-0.5">{m.label}</div>
                <div className="text-[12px] text-paper font-medium">{m.value}</div>
              </div>
              <span className="mono-label text-[8px] px-1.5 py-0.5 rounded" style={{ background: m.color + '20', color: m.color }}>{m.status}</span>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="mt-4 pt-4 border-t border-lead">
          <div className="mono-label mb-2">Strategies Generated Today</div>
          <div className="flex items-end gap-1 h-10">
            {[4,7,5,9,6,12,8,15,11,18,14,20].map((v,i) => (
              <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${v/20*100}%`, background: i===11 ? '#E6933A' : 'rgba(230,147,58,.25)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-3 -right-3 glass px-3 py-1.5 rounded-full border border-jade/30 animate-float" style={{ animationDelay: '1s' }}>
        <span className="mono-label" style={{ color: '#3FB950' }}>✓ Claude Opus</span>
      </div>
      <div className="absolute -bottom-3 -left-3 glass px-3 py-1.5 rounded-full border border-cyan/30 animate-float" style={{ animationDelay: '2.5s' }}>
        <span className="mono-label" style={{ color: '#58A6FF' }}>⚡ 60s Strategy</span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  INSTANT STRATEGY
// ══════════════════════════════════════════════════════════
function InstantStrategy({ sessionId }: { sessionId: string }) {
  const [co, setCo] = useState(''); const [ind, setInd] = useState(''); const [sz, setSz] = useState('')
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<string|null>(null)
  const [stratId, setStratId] = useState<string|undefined>(); const [error, setError] = useState<string|null>(null)
  const [genStep, setGenStep] = useState(0)
  const steps = ['Searching web for industry AI landscape…','Analysing competitor AI adoption…','Identifying proven use cases…','Claude Opus generating your strategy…','Preparing board-ready report…']
  const industries = ['Manufacturing','Banking & Financial Services','Healthcare & Pharma','Retail & E-commerce','Technology & SaaS','Energy & Utilities','Logistics & Supply Chain','Automotive','Real Estate & Construction','Education & Ed-tech','Consumer Goods & FMCG','Telecommunications']

  useEffect(() => {
    if (!loading) return; setGenStep(0)
    const iv = setInterval(() => setGenStep(s => Math.min(s+1, steps.length-1)), 900)
    return () => clearInterval(iv)
  }, [loading])

  const generate = async () => {
    if (!co.trim() || !ind) return
    setLoading(true); setResult(null); setError(null)
    await sbTrack('strategy_generations', { session_id: sessionId, company_name: co, industry: ind, strategy_type: 'instant', model_used: 'claude-opus-4-5', payment_status: 'free' })
    try {
      const res = await strategyApi.instant({ company_name: co, industry: ind, company_size: sz, session_id: sessionId })
      setResult(res.strategy); setStratId(res.id)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6 items-start">
      {/* Sidebar */}
      <div className="sticky top-20 glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-jade animate-pulse"/>
          <span className="mono-label" style={{ color: '#3FB950' }}>Free · No payment needed</span>
        </div>
        <p className="text-silver text-[13px] mb-5 leading-relaxed font-light">Enter your company and industry. We search the web live then generate a board-ready strategy in under 60 seconds.</p>
        <div className="mb-4">
          <div className="mono-label mb-1.5">Company Name *</div>
          <input value={co} onChange={e => setCo(e.target.value)} placeholder="e.g. Tata Steel, HDFC Bank…" className="ai-input" />
        </div>
        <div className="mb-4">
          <div className="mono-label mb-1.5">Industry *</div>
          <select value={ind} onChange={e => setInd(e.target.value)} className="ai-input appearance-none">
            <option value="">Select industry…</option>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <div className="mono-label mb-1.5">Company Size</div>
          <select value={sz} onChange={e => setSz(e.target.value)} className="ai-input appearance-none">
            <option value="">Optional…</option>
            {['Startup — under 100','SME — 100 to 500','Mid-market — 500 to 5,000','Enterprise — 5,000 to 50,000','Large Enterprise — 50,000+'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={!co.trim()||!ind||loading} className="btn-amber w-full justify-center">
          {loading ? <><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin-slow"/>Generating…</> : 'Generate strategy →'}
        </button>
        <p className="text-center mono-label mt-2">FREE · PDF + PPTX · NO CARD</p>
      </div>

      {/* Result area */}
      <div>
        {!loading && !result && !error && (
          <div className="glass-card flex flex-col items-center justify-center min-h-[380px] p-12 text-center">
            <div className="text-5xl mb-4 animate-float opacity-30">⚡</div>
            <div className="font-serif text-2xl font-light text-zinc mb-2">Your strategy appears here</div>
            <p className="text-zinc text-[13px] max-w-xs leading-relaxed">Enter your company and industry on the left and click Generate.</p>
          </div>
        )}
        {loading && (
          <div className="glass-card p-7 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="mono-label accent">Generating your strategy…</div>
              <CountdownTimer seconds={60} />
            </div>
            {steps.map((s,i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs mb-1.5 transition-all border"
                style={{ borderColor: i<genStep?'transparent':i===genStep?'rgba(88,166,255,.25)':'transparent', background: i===genStep?'rgba(88,166,255,.05)':'transparent', color: i<genStep?'#3FB950':i===genStep?'var(--paper)':'var(--zinc)' }}>
                <span className="w-4 text-center font-mono">{i<genStep?'✓':i===genStep?'→':'·'}</span>{s}
              </div>
            ))}
            <div className="h-px bg-lead mt-4 overflow-hidden rounded">
              <div className="h-full bg-gradient-to-r from-cyan to-violet transition-all duration-500 rounded" style={{ width: `${(genStep/steps.length)*88}%` }} />
            </div>
          </div>
        )}
        {error && (
          <div className="glass-card p-7 animate-fade-in border border-rose/20">
            <p className="text-rose text-sm font-medium mb-2">Generation failed</p>
            <p className="text-silver text-xs font-mono mb-2">{error}</p>
            <p className="text-zinc text-xs">Check that ANTHROPIC_API_KEY is set in Railway → Variables.</p>
          </div>
        )}
        {result && !loading && <SlideViewer text={result} company={co} industry={ind} type="instant" strategyId={stratId} />}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  CUSTOM STRATEGY
// ══════════════════════════════════════════════════════════
function CustomStrategy({ sessionId, openPayment }: { sessionId: string; openPayment: (p:string,pr:string,i:number,cb:()=>void)=>void }) {
  const [step, setStep] = useState(0); const [answers, setAnswers] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<string|null>(null)
  const [stratId, setStratId] = useState<string|undefined>(); const [error, setError] = useState<string|null>(null)
  const [genStep, setGenStep] = useState(0)

  const STEPS = [
    { label:'Organisation', fields:[{id:'co',label:'Company Name',type:'text',ph:'Your organisation name'},{id:'ind',label:'Industry',type:'select',opts:['Manufacturing','Banking & Financial Services','Healthcare & Pharma','Retail & E-commerce','Technology & SaaS','Energy & Utilities','Logistics & Supply Chain','Automotive','Consumer Goods & FMCG','Telecommunications']},{id:'role',label:'Your Role',type:'select',opts:['CEO / Founder','CFO','CIO / CTO','CHRO','COO','CMO','VP / Director','Manager','Consultant']}] },
    { label:'AI Maturity', qs:[{id:'ai_use',q:'What best describes your current AI usage?',opts:['No AI at all — starting from scratch','Experimenting with ChatGPT personally','Some AI pilots, not in production','AI actively used in one production system','AI is core across multiple areas']},{id:'data',q:'How would you describe your data infrastructure?',opts:['Siloed — fragmented, no integration','Basic — databases, limited analytics','Developing — data warehouse, some reporting','Strong — good platform, some ML','Advanced — real-time, ML in production']}] },
    { label:'Objectives', qs:[{id:'goal',q:'What is the PRIMARY driver for your AI strategy?',opts:['Cost reduction','Revenue growth','Competitive pressure','Operational efficiency','Customer experience','Risk & compliance']},{id:'fn',q:'Which function is your TOP priority for AI?',opts:['Operations / Manufacturing','Finance / Risk','Sales / Marketing / CX','HR / Talent','IT / Technology','All functions — enterprise-wide']}] },
    { label:'Constraints', qs:[{id:'budget',q:'What is your realistic annual AI investment budget?',opts:['Under ₹50 Lakhs','₹50L–₹2 Crore','₹2Cr–₹10 Crore','₹10Cr–₹50 Crore','Above ₹50 Crore']},{id:'barrier',q:'What is your biggest barrier to AI adoption?',opts:['Data quality & availability','Talent & skills gap','Leadership buy-in','Technology debt','Budget constraints','Culture resistance']}] },
  ]

  const set = (k: string, v: string) => { setAnswers(a => ({...a,[k]:v})); sbTrack('custom_strategy_answers', { question_key: k, answer_value: v, session_id: sessionId }) }

  useEffect(() => { if (!loading) return; setGenStep(0); const iv = setInterval(() => setGenStep(s => Math.min(s+1,4)), 900); return () => clearInterval(iv) }, [loading])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await strategyApi.custom({ answers, session_id: sessionId })
      setResult(res.strategy); setStratId(res.id)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) { setStep(s => s+1) }
    else { openPayment('Custom Strategy', INR(PRICES.custom), PRICES.custom, () => generate()) }
  }

  if (result) return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div className="glass-card p-6">
        <div className="mono-label mb-2" style={{ color: 'var(--violet)' }}>✓ Custom Strategy · Paid</div>
        <div className="font-serif text-xl font-light mb-1">{answers.co}</div>
        <div className="text-xs text-zinc">{answers.ind}</div>
      </div>
      <SlideViewer text={result} company={answers.co||'Your Organisation'} industry={answers.ind||''} type="custom" strategyId={stratId} />
    </div>
  )

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
      <div className="sticky top-20 glass-card p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber/20 mb-4" style={{ background: 'rgba(230,147,58,.08)', color: 'var(--amber)', fontSize: '9px', fontFamily: 'DM Mono', letterSpacing: '.15em' }}>🔒 PAID STRATEGY</div>
        <div className="font-serif text-lg font-light mb-2">Why Custom?</div>
        <p className="text-silver text-[12px] leading-relaxed mb-4">Built around <em className="text-paper not-italic">your specific organisation</em> — not a generic report.</p>
        {['50+ org-specific dimensions','Competitor benchmarking in your segment','Use cases ranked by your data readiness','Budget model tuned to your signals','30-min expert review call included'].map(f => (
          <div key={f} className="flex gap-2 items-start text-[12px] text-silver mb-2"><span className="text-jade font-mono mt-px">—</span>{f}</div>
        ))}
        <div className="h-px bg-lead my-4"/>
        <div className="font-serif text-3xl font-light text-paper mb-0.5">{INR(PRICES.custom)}</div>
        <div className="mono-label">ONE-TIME · PDF + PPTX + EXPERT CALL</div>
      </div>

      <div>
        {loading ? (
          <div className="glass-card p-7 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="mono-label accent">Generating your custom strategy…</div>
              <CountdownTimer seconds={90} />
            </div>
            {['Searching competitor AI landscape…','Analysing your maturity profile…','Building tailored use cases…','Claude Opus writing your strategy…','Compiling personalised report…'].map((s,i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs mb-1.5 transition-all border"
                style={{ borderColor: i<genStep?'transparent':i===genStep?'rgba(188,140,255,.25)':'transparent', background: i===genStep?'rgba(188,140,255,.05)':'transparent', color: i<genStep?'#3FB950':i===genStep?'var(--paper)':'var(--zinc)' }}>
                <span className="w-4 text-center font-mono">{i<genStep?'✓':i===genStep?'→':'·'}</span>{s}
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Step bar */}
            <div className="flex items-center mb-7">
              {STEPS.map((s,i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className="step-dot" style={{ background: i<step?'#3FB950':i===step?'#58A6FF':'rgba(13,17,23,.8)', border: `1px solid ${i<=step?'transparent':'var(--lead)'}`, color: i<=step?'var(--ink)':'var(--zinc)' }}>{i<step?'✓':i+1}</div>
                    <span className="mono-label text-[8px]" style={{ color: i===step?'var(--cyan)':i<step?'var(--jade)':'var(--zinc)' }}>{s.label}</span>
                  </div>
                  {i<STEPS.length-1 && <div className="flex-1 h-px mx-2 -mt-5 transition-all" style={{ background: i<step?'#3FB950':'var(--lead)' }}/>}
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <div className="mono-label accent mb-5">Step {step+1} of {STEPS.length} — {STEPS[step].label}</div>
              {'fields' in STEPS[step] && (STEPS[step] as any).fields.map((f: any) => (
                <div key={f.id} className="mb-4">
                  <div className="mono-label mb-1.5">{f.label}</div>
                  {f.type==='text'
                    ? <input value={answers[f.id]||''} onChange={e => set(f.id,e.target.value)} placeholder={f.ph} className="ai-input"/>
                    : <select value={answers[f.id]||''} onChange={e => set(f.id,e.target.value)} className="ai-input appearance-none">
                        <option value="">Select…</option>
                        {f.opts.map((o:string) => <option key={o}>{o}</option>)}
                      </select>
                  }
                </div>
              ))}
              {'qs' in STEPS[step] && (STEPS[step] as any).qs.map((q: any) => (
                <div key={q.id} className="mb-6">
                  <div className="font-serif text-[18px] font-light mb-3">{q.q}</div>
                  {q.opts.map((o: string, i: number) => (
                    <button key={o} onClick={() => set(q.id,o)} className="w-full text-left px-3.5 py-2.5 mb-2 rounded-lg border text-[12px] transition-all flex items-start gap-2.5"
                      style={{ borderColor: answers[q.id]===o?'var(--cyan)':'var(--lead)', background: answers[q.id]===o?'rgba(88,166,255,.07)':'transparent', color: answers[q.id]===o?'var(--paper)':'var(--silver)' }}>
                      <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] flex-shrink-0 mt-px"
                        style={{ background: answers[q.id]===o?'var(--cyan)':'rgba(88,166,255,.12)', color: answers[q.id]===o?'var(--ink)':'var(--cyan)' }}>{'ABCDE'[i]}</span>
                      {o}
                    </button>
                  ))}
                </div>
              ))}
              {error && <p className="text-rose text-xs mb-3 font-mono">{error}</p>}
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(s => s-1)} disabled={step===0} className="btn-outline py-2 px-4 text-[12px] disabled:opacity-0">← Back</button>
                <button onClick={handleNext} disabled={loading} className="btn-amber py-2 px-5 text-[12px]">
                  {step<STEPS.length-1?'Continue →':`Pay ${INR(PRICES.custom)} & Generate →`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  WORKSHOPS
// ══════════════════════════════════════════════════════════
function WorkshopsSection({ sTo }: { sTo: (id: string) => void }) {
  const workshops = [
    { icon:'⚡', name:'AI Accelerator Half-Day', meta:'4hr · Up to 15 execs', price:'₹3,52,800', color:'var(--amber)' },
    { icon:'🎯', name:'Board AI Briefing', meta:'2hr · Board & investors', price:'₹1,51,200', color:'var(--cyan)' },
    { icon:'🏆', name:'AI Design Sprint 2-Day', meta:'2 days · Up to 12 execs', price:'₹12,18,000', color:'var(--jade)' },
    { icon:'🏅', name:'AI Innovation Lab 5-Day', meta:'5 days · Cross-functional', price:'₹25,20,000', color:'var(--violet)' },
  ]
  return (
    <section id="workshops" className="py-28 border-t border-lead" style={{ background: 'rgba(13,17,23,.6)' }}>
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="mb-10">
          <div className="section-head"><div className="line"/><span className="mono-label accent">04 · Executive Workshops</span></div>
          <h2 className="font-serif font-light tracking-tight mb-3" style={{ fontSize: 'clamp(28px,3.5vw,50px)' }}>
            Where strategy<br/><em className="italic grad-amber">becomes action.</em>
          </h2>
        </div>
        <div className="grid grid-cols-4 border border-lead rounded-xl overflow-hidden">
          {workshops.map((w, i) => (
            <div key={i} className="p-7 border-r border-lead last:border-r-0 group hover:bg-carbon/50 transition-all">
              <div className="text-2xl mb-4 group-hover:scale-110 transition-transform inline-block">{w.icon}</div>
              <div className="font-serif text-[17px] font-light mb-2">{w.name}</div>
              <div className="text-xs text-zinc mb-3">{w.meta}</div>
              <div className="font-serif text-2xl font-light mb-4" style={{ color: w.color }}>{w.price}</div>
              <button onClick={() => sTo('#contact')} className="btn-outline w-full justify-center py-2 text-xs">Book →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════
//  PRICING
// ══════════════════════════════════════════════════════════
function PricingSection({ openPayment }: { openPayment: (p:string,pr:string,i:number,cb:()=>void)=>void }) {
  const [annual, setAnnual] = useState(false)
  const plans = [
    { name:'Starter', color:'#3FB950', inrM:0, inrA:0, hot:false, cta:'Get started free →',
      features:['3 instant strategies/month','Basic AI maturity assessment','Industry use case snapshot','PDF + PPTX download free','Community access'] },
    { name:'Professional', color:'#58A6FF', inrM:20900, inrA:199900, hot:true, cta:'Start 14-day free trial →',
      features:['Unlimited instant strategies','Custom strategy access','All 6 function modules','AI maturity assessment','Priority support'] },
    { name:'Enterprise', color:'#BC8CFF', inrM:67100, inrA:645000, hot:false, cta:'Book a demo →',
      features:['Everything in Professional','Dedicated AI consultant 8hr/mo','All executive dashboards','Custom agent development','SLA-backed support'] },
    { name:'Executive', color:'#E6933A', inrM:null, inrA:null, hot:false, cta:'Talk to us →',
      features:['Full transformation partnership','All C-suite AI packages','End-to-end deployment','Resident AI expert dedicated','Outcome-based success fees'] },
  ]
  return (
    <section id="pricing" className="py-28 border-t border-lead">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="text-center mb-12">
          <div className="section-head justify-center"><div className="line"/><span className="mono-label accent">05 · Pricing</span><div className="line"/></div>
          <h2 className="font-serif font-light tracking-tight mb-3" style={{ fontSize: 'clamp(28px,3.5vw,50px)' }}>
            Start free. <em className="italic grad-amber">Scale as you grow.</em>
          </h2>
          <p className="text-silver text-[15px] mb-6">All prices in Indian Rupees. No hidden fees.</p>
          <div className="inline-flex gap-1 border border-lead rounded-lg p-1" style={{ background: 'rgba(13,17,23,.8)' }}>
            {['Monthly','Annual'].map((l,i) => (
              <button key={l} onClick={() => setAnnual(i===1)} className="px-5 py-2 rounded text-[13px] transition-all"
                style={{ background: annual===(i===1)?'var(--carbon)':'transparent', border: annual===(i===1)?'1px solid var(--lead)':'1px solid transparent', color: annual===(i===1)?'var(--paper)':'var(--zinc)' }}>
                {l}{i===1&&<span className="ml-1.5 text-jade text-[11px] font-medium">–20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 border border-lead rounded-xl overflow-hidden bg-lead gap-px">
          {plans.map(p => {
            const inr = annual ? p.inrA : p.inrM
            return (
              <div key={p.name} className="glass-card rounded-none p-8 flex flex-col relative" style={{ background: p.hot ? 'rgba(13,17,23,.95)' : 'rgba(22,27,34,.7)', borderRadius: 0 }}>
                {p.hot && <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: 'var(--amber)' }}/>}
                <div className="mono-label mb-4">{p.name.toUpperCase()}</div>
                <div className="font-serif font-light leading-none mb-1" style={{ fontSize: 38, color: p.color }}>
                  {inr!==null?'₹'+inr.toLocaleString('en-IN'):'Custom'}<span className="text-sm text-zinc font-light">{inr!==null&&inr>0?'/mo':''}</span>
                </div>
                <div className="h-px bg-lead my-5"/>
                <div className="flex-1 flex flex-col gap-2.5 mb-6">
                  {p.features.map(f => <div key={f} className="text-[12px] text-silver flex gap-2.5"><span className="text-jade font-mono">—</span>{f}</div>)}
                </div>
                <button onClick={() => {
                  if (p.name==='Starter') { document.querySelector('#services')?.scrollIntoView({behavior:'smooth'}); return }
                  if (p.name==='Executive') { document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'}); return }
                  const amt = annual ? p.inrA! : p.inrM!
                  openPayment(`${p.name} Plan`, '₹'+amt.toLocaleString('en-IN')+(annual?'/yr':'/mo'), amt, () => {})
                }} className="w-full py-3 rounded-lg text-[13px] font-medium transition-all hover:-translate-y-px"
                  style={{ background: p.hot?'var(--paper)':p.name==='Executive'?'var(--amber)':'transparent', color: p.hot||p.name==='Executive'?'var(--ink)':'var(--paper)', border: p.hot||p.name==='Executive'?'none':'1px solid var(--lead)' }}>
                  {p.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════
//  CONTACT
// ══════════════════════════════════════════════════════════
function ContactSection() {
  const [form, setForm] = useState({name:'',email:'',company:'',phone:'',interest:'',message:''})
  const [loading, setLoading] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))
  const submit = async () => {
    if (!form.name||!form.email||!form.company){setError('Please fill required fields');return}
    setLoading(true); setError('')
    try { await contactApi.submit(form); setDone(true) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }
  return (
    <section id="contact" className="py-28 border-t border-lead" style={{ background: 'rgba(13,17,23,.7)' }}>
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <div className="section-head"><div className="line"/><span className="mono-label accent">06 · Contact</span></div>
            <h2 className="font-serif font-light tracking-tight mb-3" style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}>
              Let's talk<br/><em className="italic text-amber">transformation.</em>
            </h2>
            <p className="text-silver text-[15px] mb-8">Expert response within 24 hours. Enterprise enquiries same day.</p>
            {done ? (
              <div className="glass-card p-8 text-center border border-jade/20 animate-fade-scale">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-jade text-2xl animate-glow-cyan" style={{ background: 'rgba(63,185,80,.15)', border: '2px solid #3FB950' }}>✓</div>
                <div className="font-serif text-xl font-light mb-2">Message received.</div>
                <p className="text-silver text-sm">We'll have an expert reach out within 24 hours.</p>
              </div>
            ) : (
              <div className="glass-card p-7">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div><div className="mono-label mb-1.5">Your name *</div><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Rahul Sharma" className="ai-input"/></div>
                  <div><div className="mono-label mb-1.5">Company *</div><input value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Your company" className="ai-input"/></div>
                </div>
                <div className="mb-4"><div className="mono-label mb-1.5">Work email *</div><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="rahul@company.com" className="ai-input"/></div>
                <div className="mb-4"><div className="mono-label mb-1.5">Phone</div><input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91 98765 43210" className="ai-input"/></div>
                <div className="mb-4">
                  <div className="mono-label mb-1.5">I'm interested in</div>
                  <select value={form.interest} onChange={e=>set('interest',e.target.value)} className="ai-input appearance-none">
                    <option value="">Select…</option>
                    {['Free AI Strategy','Custom Strategy (₹2,09,000)','Function Strategy (₹4,18,000)','AI Design Sprint (₹12,18,000)','AI Accelerator Half-Day (₹3,52,800)','Board AI Briefing (₹1,51,200)','Executive Package','Full Enterprise Transformation'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mb-6"><div className="mono-label mb-1.5">Message</div><textarea value={form.message} onChange={e=>set('message',e.target.value)} rows={4} placeholder="Tell us about your AI transformation goals…" className="ai-input resize-y"/></div>
                {error && <p className="text-rose text-xs mb-3 font-mono">{error}</p>}
                <button onClick={submit} disabled={loading} className="btn-amber w-full justify-center">
                  {loading?<><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin-slow"/>Sending…</>:'Send message →'}
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4">
            {[['📧','Email','hello@aiinbox.com','Response within 24 hours'],['📞','Phone','+91 98765 43210','Mon–Fri 9am–7pm IST'],['📍','Location','Mumbai, India','Available globally, remote & in-person']].map(([icon,l,v,n])=>(
              <div key={l} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{icon}</span>
                  <div className="mono-label">{l}</div>
                </div>
                <div className="text-paper text-[15px] mb-1 font-medium">{v}</div>
                <div className="text-zinc text-xs">{n}</div>
              </div>
            ))}
            <div className="glass-card p-6 border border-amber/15" style={{ background: 'rgba(230,147,58,.03)' }}>
              <div className="mono-label accent mb-2">Anchor Client Programme</div>
              <div className="font-serif text-[15px] font-light mb-2">5 founding enterprises · ₹40.3L pilot · Co-create the product · 12 months free post-launch</div>
              <button onClick={() => set('interest','Anchor Client / Partnership')} className="text-amber text-xs font-mono hover:underline">Enquire →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════
//  ARIA CHAT
// ══════════════════════════════════════════════════════════
function ARIAChat({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false); const [msgs, setMsgs] = useState<{role:'user'|'bot';text:string}[]>([])
  const [input, setInput] = useState(''); const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null); const firstRef = useRef(false)

  useEffect(() => {
    if (open && !firstRef.current) {
      firstRef.current = true
      setTimeout(() => setMsgs([{role:'bot',text:"Hi! I'm ARIA, your AI in a Box assistant. Ask me about our strategies, packages, workshops, or any AI transformation question — I use Claude Opus for complex queries! 🤖"}]), 350)
    }
  }, [open])
  useEffect(() => { endRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs])

  const send = useCallback(async () => {
    const t = input.trim(); if (!t) return
    setInput(''); setMsgs(m => [...m,{role:'user',text:t}]); setTyping(true)
    try {
      const res = await ariaApi.chat(t, sessionId)
      setMsgs(m => [...m,{role:'bot',text:res.reply}])
    } catch { setMsgs(m => [...m,{role:'bot',text:"I'm having trouble connecting. Please try again."}]) }
    finally { setTyping(false) }
  }, [input, sessionId])

  return (
    <div className="fixed bottom-6 right-6 z-[8000] flex flex-col items-end gap-3">
      {open && (
        <div className="glass-card w-[340px] overflow-hidden animate-fade-scale" style={{ border: '1px solid rgba(230,147,58,.2)', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-lead" style={{ background: 'rgba(7,9,13,.8)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg animate-glow" style={{ background: 'rgba(230,147,58,.15)', border: '1px solid rgba(230,147,58,.3)' }}>🤖</div>
            <div>
              <div className="text-[13px] font-medium">ARIA — AI in a Box</div>
              <div className="mono-label flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse"/>Claude Opus · Live</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-zinc hover:text-paper text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-lead transition-all">×</button>
          </div>
          <div className="h-72 overflow-y-auto p-4 flex flex-col gap-2.5">
            {msgs.map((m,i) => (
              <div key={i} className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed ${m.role==='user'?'chat-bubble-user self-end':'chat-bubble-bot self-start'}`}>{m.text}</div>
            ))}
            {typing && (
              <div className="chat-bubble-bot self-start px-4 py-3">
                <div className="flex gap-1">{[0,.2,.4].map(d=><span key={d} className="w-1.5 h-1.5 rounded-full bg-zinc animate-pulse" style={{animationDelay:`${d}s`}}/>)}</div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          {/* Quick replies */}
          {msgs.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {['Pricing?','Custom vs Instant?','CHRO Package?','Workshop options?'].map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 0) }} className="px-2.5 py-1 rounded-full border border-lead text-[11px] text-zinc hover:text-paper hover:border-amber transition-all">{q}</button>
              ))}
            </div>
          )}
          <div className="flex gap-2 p-3 border-t border-lead">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask anything…" className="ai-input flex-1 py-2"/>
            <button onClick={send} className="btn-amber py-2 px-3 text-sm">➤</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o=>!o)} className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110 animate-glow"
        style={{ background: 'var(--amber)', color: 'var(--ink)' }}>🤖</button>
    </div>
  )
}
