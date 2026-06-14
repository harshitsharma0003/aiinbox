/// <reference types="vite/client" />
import { useEffect, useRef, useState, useCallback } from 'react'
import { LANDING_HTML } from '../lib/landingHtml'
import { strategyApi, contactApi, ariaApi, paymentApi, pptxApi } from '../lib/api'

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

// USD prices in INR (1 USD ≈ ₹84)
const USD_TO_INR = 84
const usdToInr = (usd: number) => Math.round(usd * USD_TO_INR)

// Plan catalog
const PLANS = {
  starter:      { name: 'Starter',           monthly: 0,    annual: 0,     ccy: 'USD' },
  professional: { name: 'Professional',      monthly: 299,  annual: 2870,  ccy: 'USD' },
  enterprise:   { name: 'Enterprise',        monthly: 1500, annual: 14400, ccy: 'USD' },
  executive:    { name: 'Executive',         monthly: 4500, annual: 43200, ccy: 'USD' },
  custom:       { name: 'Custom Strategy',   monthly: 2500, annual: 2500,  ccy: 'USD' },
  function:     { name: 'Function Strategy', monthly: 5000, annual: 5000,  ccy: 'USD' },
  sprint:       { name: 'AI Design Sprint',          monthly: 14500, annual: 14500, ccy: 'USD' },
  accelerator:  { name: 'AI Accelerator',            monthly: 4200,  annual: 4200,  ccy: 'USD' },
  briefing:     { name: 'Board AI Briefing',         monthly: 1800,  annual: 1800,  ccy: 'USD' },
  lab:          { name: 'AI Innovation Lab',         monthly: 30000, annual: 30000, ccy: 'USD' },
}

// Razorpay loader
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

// ── Strategy text parser (for inline rendering) ──
// ── Strip markdown from text so professional output is clean ──
function stripMd(s: string): string {
  if (!s) return ''
  return s
    // Bold **text** or __text__ → text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Italic *text* or _text_ → text (single, not part of bold)
    .replace(/(^|[^\*])\*([^\*\n]+?)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, '$1$2')
    // Inline code `text` → text
    .replace(/`([^`]+)`/g, '$1')
    // Headings  ###  → strip leading #
    .replace(/^#{1,6}\s+/gm, '')
    // Links [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

// ── Convert markdown table block into plain bullet rows ──
function tablesToBullets(text: string): string {
  // Detect a markdown table (lines starting with `|` and containing `|---|` separator)
  const lines = text.split('\n')
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // Detect table start: pipe at start AND next line is a separator row
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])) {
      // Parse header
      const header = line.split('|').map(c => c.trim()).filter(Boolean)
      i += 2 // skip separator
      // Parse data rows
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length > 0) {
          // First cell becomes the lead, rest become "Key: Value" inline
          const parts: string[] = []
          cells.forEach((c, idx) => {
            const h = header[idx] || ''
            if (h && cells[idx]) parts.push(`${h}: ${c}`)
            else if (cells[idx]) parts.push(c)
          })
          out.push(parts.join(' · '))
        }
        i++
      }
    } else {
      out.push(line)
      i++
    }
  }
  return out.join('\n')
}

function parseStrategySections(text: string) {
  // Pre-process: strip markdown noise and flatten tables
  const cleaned = stripMd(tablesToBullets(text))
  const secs = cleaned.split(/\n(?=\d+\.\s+[A-Z])/)
  return secs
    .map(sec => {
      const trimmed = sec.trim()
      if (!trimmed) return null
      const lines = trimmed.split('\n')
      const heading = stripMd(lines[0]).replace(/^[\d.\s]+/, '').trim().substring(0, 80)
      const body = lines.slice(1).join('\n').trim() || trimmed
      return { heading: heading.toUpperCase(), body }
    })
    .filter(Boolean) as { heading: string; body: string }[]
}

// ── Custom strategy questionnaire ──
const CB_STEPS = [
  { step: 0, title: 'Organisation', fields: [
    { id: 'co',  lbl: 'Company Name',  type: 'text', ph: 'Your organisation name' },
    { id: 'ind', lbl: 'Industry',      type: 'sel',  opts: ['Manufacturing','Banking & Financial Services','Healthcare & Pharma','Retail & E-commerce','Agriculture & Agri-tech','Technology & SaaS','Energy & Utilities','Logistics & Supply Chain','Automotive','Consumer Goods & FMCG','Real Estate','Education','Hospitality','Media & Entertainment','Telecommunications'] },
    { id: 'rev', lbl: 'Annual Revenue', type: 'sel', opts: ['Under ₹100 Crore','₹100–500 Crore','₹500Cr–₹2,000 Crore','₹2,000Cr–₹10,000 Crore','Above ₹10,000 Crore'] },
    { id: 'emp', lbl: 'Employees',     type: 'sel',  opts: ['Under 100','100–500','500–5,000','5,000–50,000','50,000+'] },
    { id: 'role',lbl: 'Your Role',     type: 'sel',  opts: ['CEO / Founder','CFO','CIO / CTO','CHRO','COO','CMO','VP / Director','Manager'] },
  ]},
  { step: 1, title: 'AI Maturity', qs: [
    { q: 'Current AI usage at your company?',     id: 'ai_use',  opts: ['No AI at all','Pilot experiments','Some functions live','Multiple deployments','AI-native organisation'] },
    { q: 'Data maturity level?',                  id: 'data',    opts: ['Basic — spreadsheets, silos','Some integration','Centralised data warehouse','Modern data platform','Real-time data lakehouse'] },
    { q: 'Technical AI talent?',                  id: 'talent',  opts: ['None','1-2 people','Small team (3-10)','Dedicated team (10-30)','Large org (30+)'] },
  ]},
  { step: 2, title: 'Objectives', qs: [
    { q: 'Primary business driver?',              id: 'goal',    opts: ['Cost reduction','Revenue growth','Customer experience','Operational efficiency','Innovation / new products','Competitive defence'] },
    { q: 'Which function to prioritise?',         id: 'fn',      opts: ['Finance','Operations','Sales & Marketing','HR / People','Customer Service','IT / Technology','Cross-functional'] },
    { q: 'Time horizon for first impact?',        id: 'horizon', opts: ['3 months','6 months','12 months','18+ months'] },
  ]},
  { step: 3, title: 'Constraints', qs: [
    { q: 'AI investment budget (12 months)?',     id: 'budget',  opts: ['Under ₹50 Lakhs','₹50L–₹2 Crore','₹2–10 Crore','₹10–50 Crore','Above ₹50 Crore'] },
    { q: 'Biggest concern?',                      id: 'concern', opts: ['Data privacy & security','Regulatory compliance','Change management','ROI uncertainty','Technical complexity','Talent gap'] },
    { q: 'Decision-maker buy-in?',                id: 'buyin',   opts: ['Full board support','CEO supportive','Mixed C-suite','Champion only','Need to build the case'] },
  ]},
]

// Function strategy questions per function
const FN_QS: Record<string, string[]> = {
  Finance: [
    'Top 3 finance pain points today?',
    'Current month-end close cycle (days)?',
    'How is forecasting done today?',
    'Major fraud or compliance concerns?',
    'Existing finance tech stack (ERP, FP&A, etc)?',
    'Budget envelope for finance AI?',
  ],
  HR: [
    'Current employee headcount and attrition rate?',
    'Top HR challenges (hiring, retention, L&D)?',
    'HRMS / payroll systems in use?',
    'Workforce composition (white/blue collar mix)?',
    'AI literacy of HR team today?',
    'Budget envelope for HR AI?',
  ],
  Operations: [
    'Manufacturing or services operations?',
    'Top 3 operational pain points?',
    'Existing ERP / MES / SCADA systems?',
    'Quality issues — current defect rate?',
    'Supply chain visibility today (%)?',
    'Budget envelope for ops AI?',
  ],
  'Sales & Marketing': [
    'Current sales cycle length and conversion rates?',
    'CRM / marketing automation in use?',
    'Lead volume vs sales capacity?',
    'Customer churn rate today?',
    'Digital marketing maturity?',
    'Budget envelope for sales/marketing AI?',
  ],
  'IT & Technology': [
    'Current tech stack and key platforms?',
    'Data architecture maturity?',
    'Security incidents and SOC capability?',
    'DevOps / cloud maturity?',
    'AI/ML talent in IT?',
    'Budget envelope for AI infrastructure?',
  ],
  'Customer Experience': [
    'Channels handled (voice, chat, email, social)?',
    'Current NPS / CSAT scores?',
    'Average handle time and FCR?',
    'CRM / ticketing systems in use?',
    'Self-service deflection rate today?',
    'Budget envelope for CX AI?',
  ],
}

// ───────────────────────────────────────────────────────────
//  COMPONENT
// ───────────────────────────────────────────────────────────
export default function NewLanding() {
  const rootRef = useRef<HTMLDivElement>(null)
  

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // Strategy / tier state
  const [, setTier] = useState<'a' | 'b' | 'c'>('a')

  // Instant strategy state
  const [iaCompany, setIaCompany] = useState('')
  const [iaIndustry, setIaIndustry] = useState('')
  const [iaSize, setIaSize] = useState('')
  const [, setIaLoading] = useState(false)
  const [, setIaResult] = useState<string | null>(null)
  const [, setIaError] = useState<string | null>(null)
  const [, setIaProgress] = useState(0)
  const [, setIaStrategyId] = useState<string | null>(null)

  // Custom strategy state
  const [cbStep, setCbStep] = useState(0)
  const [cbAns, setCbAns] = useState<Record<string, string>>({})
  const [cbLoading, setCbLoading] = useState(false)
  const [cbResult, setCbResult] = useState<string | null>(null)
  const [cbError, setCbError] = useState<string | null>(null)
  const [cbPaid, setCbPaid] = useState(false)
  const [cbStrategyId, setCbStrategyId] = useState<string | null>(null)

  // Function strategy state
  const [fnSelected, setFnSelected] = useState<string | null>(null)
  const [fnAnswers, setFnAnswers] = useState<Record<string, string>>({})
  const [, setFnLoading] = useState(false)
  const [fnResult, setFnResult] = useState<string | null>(null)
  const [, setFnError] = useState<string | null>(null)
  const [, setFnPaid] = useState(false)
  const [fnStrategyId] = useState<string | null>(null)

  // C-Suite package tab state
  const [, setActivePkg] = useState<string>('chro')

  // Pricing billing toggle
  const [annual, setAnnual] = useState(false)

  // Contact form state
  const [cfName, setCfName] = useState('')
  const [cfEmail, setCfEmail] = useState('')
  const [cfCompany, setCfCompany] = useState('')
  const [cfInterest, setCfInterest] = useState('')
  const [cfMessage, setCfMessage] = useState('')
  const [, setCfSent] = useState(false)

  // ARIA chat
  const [, setChatOpen] = useState(false)
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'aria'; text: string }[]>([
    { role: 'aria', text: "Hi! I'm ARIA. Ask me about our strategies, workshops, or packages." }
  ])
  const [chatInput, setChatInput] = useState('')
  const [, setChatLoading] = useState(false)

  // Payment modal
  const [modal, setModal] = useState<{ open: boolean; plan: string; planLabel: string; amountUsd: number; amountInr: number; purpose: 'custom' | 'function' | 'plan' | 'workshop'; }>({
    open: false, plan: '', planLabel: '', amountUsd: 0, amountInr: 0, purpose: 'plan'
  })
  const [, setModalStepState] = useState<1 | 2 | 3>(1)
  const [coFn, setCoFn] = useState('')
  const [, setCoLn] = useState('')
  const [coEm, setCoEm] = useState('')
  const [coCo, setCoCo] = useState('')

  // (SlideViewer removed — in-browser preview was unreliable; users get the .pptx download instead)

  // ─── 1. INJECT MARKUP ON MOUNT ─────────────────────────
  useEffect(() => {
    if (!rootRef.current) return
    rootRef.current.innerHTML = LANDING_HTML
    // Trigger reveal animations on next tick
    requestAnimationFrame(() => {
      rootRef.current?.querySelectorAll('.r').forEach(el => el.classList.add('in'))
    })
  }, [])

  // ─── 2. SCROLL HELPER (sTo) ────────────────────────────
  const sTo = useCallback((target: string | number) => {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }
    const el = document.querySelector(target)
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // ─── 3. NAV SCROLL EFFECT ──────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('nav')
      const prog = document.getElementById('prog')
      if (nav) nav.classList.toggle('up', window.scrollY > 12)
      if (prog) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0
        prog.style.width = pct + '%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ─── 4. EVENT DELEGATION FOR data-onclick HANDLERS ───
  // We map all the original `onclick="..."` calls to React state changes.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-onclick]') as HTMLElement | null
      if (!target) return
      const handler = target.getAttribute('data-onclick') || ''
      e.preventDefault()

      // sTo('#xxx') or sTo(0)
      const sToMatch = handler.match(/^sTo\(['"]?([^'"]+)['"]?\)$/)
      if (sToMatch) {
        const arg = sToMatch[1]
        sTo(isNaN(Number(arg)) ? arg : Number(arg))
        return
      }
      // sTo(...);showTier('x')
      const combo = handler.match(/^sTo\(['"]?([^'"]+)['"]?\);showTier\(['"]([abc])['"]\)$/)
      if (combo) {
        sTo(combo[1])
        setTier(combo[2] as 'a' | 'b' | 'c')
        // Update tier UI
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('on'))
        document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('on'))
        document.getElementById('tt-' + combo[2])?.classList.add('on')
        document.getElementById('tier-' + combo[2])?.classList.add('on')
        return
      }
      // showTier
      const tierMatch = handler.match(/^showTier\(['"]([abc])['"]\)$/)
      if (tierMatch) {
        const t = tierMatch[1] as 'a' | 'b' | 'c'
        setTier(t)
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('on'))
        document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('on'))
        document.getElementById('tt-' + t)?.classList.add('on')
        document.getElementById('tier-' + t)?.classList.add('on')
        return
      }
      // runInstant()
      if (handler === 'runInstant()') {
        runInstant()
        return
      }
      // showPkg(this,'xxx')
      const pkgMatch = handler.match(/^showPkg\(this,['"](\w+)['"]\)$/)
      if (pkgMatch) {
        const pkg = pkgMatch[1]
        setActivePkg(pkg)
        document.querySelectorAll('.pkg-tab').forEach(t => {
          const el = t as HTMLElement
          el.classList.remove('on')
          el.style.background = 'transparent'
          el.style.color = 'var(--mist)'
          el.style.borderColor = 'var(--lead)'
        })
        target.classList.add('on')
        ;(target as HTMLElement).style.background = 'rgba(157,110,255,.1)'
        ;(target as HTMLElement).style.color = 'var(--violet)'
        ;(target as HTMLElement).style.borderColor = 'rgba(157,110,255,.35)'
        document.querySelectorAll('.pkg-detail').forEach(p => p.classList.remove('on'))
        document.getElementById('pkg-' + pkg)?.classList.add('on')
        return
      }
      // pickFn(this,'X')
      const fnMatch = handler.match(/^pickFn\(this,['"]([^'"]+)['"]\)$/)
      if (fnMatch) {
        const fn = fnMatch[1].replace('&amp;', '&')
        pickFn(fn)
        return
      }
      // bookWorkshop('x')
      const wsMatch = handler.match(/^bookWorkshop\(['"](\w+)['"]\)$/)
      if (wsMatch) {
        bookWorkshop(wsMatch[1])
        return
      }
      // submitCF()
      if (handler === 'submitCF()') {
        submitCF()
        return
      }
      // toggleChat()
      if (handler === 'toggleChat()') {
        setChatOpen(o => !o)
        const av = document.getElementById('av-chat')
        if (av) av.style.display = av.style.display === 'flex' ? 'none' : 'flex'
        return
      }
      // avSend()
      if (handler === 'avSend()') {
        avSend()
        return
      }
      // avSendQ('...')
      const qMatch = handler.match(/^avSendQ\(['"]([^'"]+)['"]\)$/)
      if (qMatch) {
        avSendQ(qMatch[1])
        return
      }
      // toggleBill()
      if (handler === 'toggleBill()') {
        setAnnual(a => !a)
        document.getElementById('bill-toggle')?.classList.toggle('on')
        return
      }
      // closeModal()
      if (handler === 'closeModal()') {
        setModal(m => ({ ...m, open: false }))
        const m = document.getElementById('modal')
        if (m) m.style.display = 'none'
        setModalStepState(1)
        return
      }
      // modalStep2()
      if (handler === 'modalStep2()') {
        modalStep2()
        return
      }
      // processPayment()
      if (handler === 'processPayment()') {
        processPayment()
        return
      }
      // Generic eval-fallback for unknown handlers (no-op)
    }

    const onInput = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.id) return
      const v = (target as HTMLInputElement).value
      switch (target.id) {
        case 'ia-co': setIaCompany(v); break
        case 'ia-ind': setIaIndustry(v); break
        case 'ia-sz': setIaSize(v); break
        case 'cf-nm': setCfName(v); break
        case 'cf-em': setCfEmail(v); break
        case 'cf-co': setCfCompany(v); break
        case 'cf-in': setCfInterest(v); break
        case 'cf-ms': setCfMessage(v); break
        case 'av-in': setChatInput(v); break
        case 'co-fn': setCoFn(v); break
        case 'co-ln': setCoLn(v); break
        case 'co-em': setCoEm(v); break
        case 'co-co': setCoCo(v); break
      }
      // Custom strategy fields
      if (target.id.startsWith('cb-q-')) {
        const fieldId = target.id.slice(5)
        setCbAns(a => ({ ...a, [fieldId]: v }))
        sbTrack('custom_strategy_answers', { question_key: fieldId, answer_value: v, session_id: SESSION_ID })
      }
      if (target.id.startsWith('fc-q-')) {
        const idx = target.id.slice(5)
        setFnAnswers(a => ({ ...a, [idx]: v }))
      }
      // Enable instant button when both required filled
      iaCheck()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.id === 'av-in' && e.key === 'Enter') {
        e.preventDefault()
        avSend()
      }
    }

    root.addEventListener('click', onClick)
    root.addEventListener('input', onInput)
    root.addEventListener('change', onInput)
    root.addEventListener('keydown', onKeyDown)
    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('input', onInput)
      root.removeEventListener('change', onInput)
      root.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Enable/disable instant generate button based on inputs
  const iaCheck = useCallback(() => {
    const btn = document.getElementById('ia-btn') as HTMLButtonElement | null
    if (!btn) return
    const co = (document.getElementById('ia-co') as HTMLInputElement)?.value?.trim()
    const ind = (document.getElementById('ia-ind') as HTMLSelectElement)?.value?.trim()
    if (co && ind) {
      btn.style.opacity = '1'
      btn.style.pointerEvents = 'auto'
      btn.disabled = false
    } else {
      btn.style.opacity = '.4'
      btn.style.pointerEvents = 'none'
      btn.disabled = true
    }
  }, [])

  // ─── 5. INSTANT STRATEGY GENERATION ──────────────────
  const runInstant = useCallback(async () => {
    const co = (document.getElementById('ia-co') as HTMLInputElement)?.value?.trim() || iaCompany
    const ind = (document.getElementById('ia-ind') as HTMLSelectElement)?.value || iaIndustry
    const sz = (document.getElementById('ia-sz') as HTMLSelectElement)?.value || iaSize
    if (!co || !ind) {
      showToast('Please fill company and industry', false)
      return
    }
    setIaLoading(true)
    setIaError(null)
    setIaResult(null)
    setIaProgress(10)

    // Show loading UI
    const empty = document.getElementById('ia-empty')
    const loading = document.getElementById('ia-loading')
    const result = document.getElementById('ia-result')
    if (empty) empty.style.display = 'none'
    if (loading) loading.style.display = 'block'
    if (result) result.innerHTML = ''

    // Animate progress
    const steps = ['Classifying organisation...', 'Researching sector...', 'Analysing AI landscape...', 'Generating strategy...']
    let stepIdx = 0
    const stepEl = document.getElementById('ia-steps')
    if (stepEl) stepEl.textContent = steps[0]
    const bar = document.getElementById('ia-bar')
    const interval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1)
      if (stepEl) stepEl.textContent = steps[stepIdx]
      setIaProgress(p => {
        const next = Math.min(p + 12, 90)
        if (bar) bar.style.width = next + '%'
        return next
      })
    }, 1500)

    try {
      await sbTrack('strategy_generations', { session_id: SESSION_ID, company_name: co, industry: ind, strategy_type: 'instant', model_used: 'claude-opus-4-5', payment_status: 'free' })
      const res = await strategyApi.instant({ company_name: co, industry: ind, company_size: sz, session_id: SESSION_ID })
      clearInterval(interval)
      if (bar) bar.style.width = '100%'
      setIaResult(res.strategy)
      setIaStrategyId(res.id)
      if (loading) loading.style.display = 'none'
      renderInstantResult(co, ind, sz, res.strategy, res.id)
      showToast('Strategy ready!')
    } catch (err: any) {
      clearInterval(interval)
      setIaError(err.message || 'Generation failed')
      if (loading) loading.style.display = 'none'
      if (result) {
        result.innerHTML = `<div style="border:1px solid rgba(248,81,73,.3);border-radius:8px;padding:28px;background:rgba(248,81,73,.04)">
          <p style="color:var(--rose);font-size:13px;margin-bottom:8px;font-weight:500">⚠ ${err.message || 'Generation failed'}</p>
          <p style="font-size:12px;color:var(--silver);line-height:1.7">Please try again or contact us at hello@aiinbox.com</p></div>`
      }
      showToast('Failed: ' + err.message, false)
    } finally {
      setIaLoading(false)
    }
  }, [iaCompany, iaIndustry, iaSize, showToast])

  // Render instant strategy result into DOM
  const renderInstantResult = useCallback((co: string, ind: string, sz: string, text: string, id: string) => {
    const el = document.getElementById('ia-result')
    if (!el) return
    const dt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    const secs = parseStrategySections(text)
    let html = `<div class="res-wrap"><div class="res-head">
      <div class="label" style="color:var(--amber);margin-bottom:10px">AI STRATEGY REPORT · ${dt}</div>
      <div class="h3 serif" style="margin-bottom:4px">${co}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <span class="tag tag-cyan">${ind}</span>
        ${sz ? `<span class="tag tag-violet">${sz.split(' — ')[0]}</span>` : ''}
        <span class="tag tag-jade">High-Level · Public Data</span>
      </div>
      <div style="padding:11px 14px;background:rgba(230,147,58,.06);border:1px solid rgba(230,147,58,.18);border-radius:5px;font-size:12px;color:var(--silver);line-height:1.65">
        <strong style="color:var(--amber)">Note:</strong> High-level strategy based on public information. <strong style="color:var(--white)">Custom Strategy ($2,500)</strong> provides a pointed plan built around your specific organisation.
      </div></div><div class="res-body">`
    secs.forEach(s => {
      html += `<div class="res-block"><div class="res-block-t">${s.heading}</div><div class="res-text">${s.body.replace(/</g,'&lt;').replace(/\n/g,'<br/>')}</div></div>`
    })
    html += `</div></div>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-a" data-act="pdf" style="flex:1;justify-content:center">📥 Download PDF</button>
        <button class="btn btn-w" data-act="pptx" style="flex:1;justify-content:center">📊 Download PPTX</button>
        <button class="btn btn-o" data-act="upgrade" style="flex:1;justify-content:center">🎯 Get Custom Strategy ($2,500)</button>
      </div>`
    el.innerHTML = html

    // Wire up action buttons
    el.querySelectorAll('[data-act]').forEach(b => {
      b.addEventListener('click', () => {
        const act = b.getAttribute('data-act')
        if (act === 'pdf') downloadPdf(co, ind, text)
        if (act === 'pptx') downloadPptxDirect(co, ind, 'instant', text, id)
        if (act === 'upgrade') {
          setTier('b')
          document.querySelectorAll('.tier-btn').forEach(t => t.classList.remove('on'))
          document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('on'))
          document.getElementById('tt-b')?.classList.add('on')
          document.getElementById('tier-b')?.classList.add('on')
          sTo('#services')
        }
      })
    })
  }, [sTo])

  // ─── 6. CUSTOM STRATEGY (Tier B) ──────────────────────
  // Render the questionnaire body whenever cbStep or answers change
  useEffect(() => {
    const body = document.getElementById('cb-body')
    if (!body) return
    if (cbResult) {
      // already-generated state handled separately
      return
    }
    if (cbLoading) {
      body.innerHTML = `<div style="padding:32px;border:1px solid var(--lead);border-radius:8px;text-align:center">
        <div class="label" style="margin-bottom:14px">Generating your custom strategy…</div>
        <div class="prog"><div class="prog-fill" style="width:80%"></div></div>
      </div>`
      return
    }
    if (cbStep < 4) {
      const stepData = CB_STEPS[cbStep]
      if (cbStep === 0) {
        let html = `<div style="border:1px solid var(--lead);border-radius:8px;padding:28px">
          <div class="h4 serif" style="margin-bottom:14px">${stepData.title}</div>`
        stepData.fields!.forEach(f => {
          const cur = cbAns[f.id] || ''
          html += `<div class="s-field"><label class="s-lbl">${f.lbl}</label>`
          if (f.type === 'text') {
            html += `<input id="cb-q-${f.id}" class="s-in" value="${cur}" placeholder="${(f as any).ph || ''}"/>`
          } else if (f.type === 'sel') {
            html += `<select id="cb-q-${f.id}" class="s-in"><option value="">Select…</option>`
            ;(f as any).opts.forEach((o: string) => {
              html += `<option ${cur === o ? 'selected' : ''}>${o}</option>`
            })
            html += `</select>`
          }
          html += `</div>`
        })
        html += `<button class="btn btn-a" data-act="cb-next" style="width:100%;justify-content:center;margin-top:8px">Continue <span class="btn-arrow">→</span></button></div>`
        body.innerHTML = html
      } else {
        let html = `<div style="border:1px solid var(--lead);border-radius:8px;padding:28px">
          <div class="h4 serif" style="margin-bottom:14px">${stepData.title}</div>`
        stepData.qs!.forEach(q => {
          const cur = cbAns[q.id] || ''
          html += `<div class="s-field"><label class="s-lbl">${q.q}</label>
            <select id="cb-q-${q.id}" class="s-in"><option value="">Select…</option>`
          q.opts.forEach(o => {
            html += `<option ${cur === o ? 'selected' : ''}>${o}</option>`
          })
          html += `</select></div>`
        })
        html += `<div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-o" data-act="cb-back" style="flex:1;justify-content:center">← Back</button>
          <button class="btn btn-a" data-act="cb-next" style="flex:1;justify-content:center">${cbStep === 3 ? 'Review & unlock' : 'Continue'} <span class="btn-arrow">→</span></button>
        </div></div>`
        body.innerHTML = html
      }
    } else if (cbStep === 4 && !cbPaid) {
      // Show review and payment button
      const co = cbAns.co || 'Your Organisation'
      body.innerHTML = `<div style="border:1px solid var(--amber);border-radius:8px;padding:28px;background:rgba(230,147,58,.04)">
        <div class="label" style="color:var(--amber);margin-bottom:10px">REVIEW & UNLOCK</div>
        <div class="h4 serif" style="margin-bottom:6px">${co}</div>
        <p class="body-sm" style="margin-bottom:18px">Pay $2,500 to unlock your custom strategy. Generated in 60 seconds. PDF + 30-min expert call included.</p>
        <button class="btn btn-a btn-lg" data-act="cb-pay" style="width:100%;justify-content:center">Pay $2,500 & unlock <span class="btn-arrow">→</span></button>
        <p class="label" style="text-align:center;margin-top:10px">Secure · Razorpay · 30-day guarantee</p>
      </div>`
    } else if (cbStep === 4 && cbPaid && !cbResult && !cbError) {
      body.innerHTML = `<div style="padding:32px;border:1px solid var(--lead);border-radius:8px;text-align:center">
        <div class="label" style="margin-bottom:14px">Generating your custom strategy…</div>
        <div class="prog"><div class="prog-fill" style="width:60%"></div></div>
      </div>`
    }

    // Wire delegated buttons
    const root = body
    const onClick = (e: Event) => {
      const t = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null
      if (!t) return
      const act = t.getAttribute('data-act')
      if (act === 'cb-next') {
        // Validate current step
        const required = cbStep === 0 ? CB_STEPS[0].fields!.map(f => f.id) : CB_STEPS[cbStep].qs!.map(q => q.id)
        const missing = required.filter(id => !cbAns[id])
        if (missing.length) {
          showToast('Please answer all questions', false)
          return
        }
        // Update step indicator
        for (let i = 0; i < 5; i++) {
          document.getElementById('cbs-' + i)?.classList.remove('active', 'done')
          document.getElementById('cbl-' + i)?.classList.remove('done')
        }
        for (let i = 0; i <= cbStep + 1 && i < 5; i++) {
          document.getElementById('cbs-' + i)?.classList.add(i === cbStep + 1 ? 'active' : 'done')
          if (i <= cbStep) document.getElementById('cbl-' + i)?.classList.add('done')
        }
        setCbStep(cbStep + 1)
      }
      if (act === 'cb-back') setCbStep(Math.max(0, cbStep - 1))
      if (act === 'cb-pay') {
        openPaymentModal({
          plan: 'custom',
          planLabel: 'Custom Strategy',
          amountUsd: 2500,
          amountInr: usdToInr(2500),
          purpose: 'custom',
        })
      }
    }
    root.addEventListener('click', onClick)
    return () => { root.removeEventListener('click', onClick) }
    // Intentionally do NOT include cbAns in deps — otherwise every keystroke
    // re-renders the form and the input loses focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cbStep, cbLoading, cbPaid, cbResult, cbError])

  // When Custom strategy is generated, render result inline
  useEffect(() => {
    if (!cbResult) return
    const body = document.getElementById('cb-body')
    if (!body) return
    const co = cbAns.co || 'Your Organisation'
    const ind = cbAns.ind || ''
    const dt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    const secs = parseStrategySections(cbResult)
    let html = `<div class="res-wrap"><div class="res-head">
      <div class="label" style="color:var(--violet);margin-bottom:10px">CUSTOM AI STRATEGY · ${dt}</div>
      <div class="h3 serif" style="margin-bottom:4px">${co}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <span class="tag tag-cyan">${ind}</span>
        <span class="tag tag-violet">Custom · $2,500</span>
      </div></div><div class="res-body">`
    secs.forEach(s => {
      html += `<div class="res-block"><div class="res-block-t">${s.heading}</div><div class="res-text">${s.body.replace(/</g,'&lt;').replace(/\n/g,'<br/>')}</div></div>`
    })
    html += `</div></div>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-a" data-act="cb-pdf" style="flex:1;justify-content:center">📥 Download PDF</button>
        <button class="btn btn-w" data-act="cb-pptx" style="flex:1;justify-content:center">📊 Download PPTX</button>
      </div>`
    body.innerHTML = html

    body.querySelectorAll('[data-act]').forEach(b => {
      b.addEventListener('click', () => {
        const act = b.getAttribute('data-act')
        if (act === 'cb-pdf') downloadPdf(co, ind, cbResult)
        if (act === 'cb-pptx') downloadPptxDirect(co, ind, 'custom', cbResult, cbStrategyId || undefined)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cbResult])

  // ─── 7. FUNCTION STRATEGY (Tier C) ────────────────────
  const pickFn = useCallback((fn: string) => {
    setFnSelected(fn)
    setFnAnswers({})
    const pick = document.getElementById('fc-pick')
    const qs = document.getElementById('fc-qs')
    if (pick) pick.style.display = 'none'
    if (qs) {
      const questions = FN_QS[fn] || []
      let html = `<div style="border:1px solid var(--lead);border-radius:8px;padding:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div class="h4 serif">${fn} — Deep dive</div>
          <button class="btn btn-o btn-sm" data-act="fc-back">← Change</button>
        </div>
        <p class="body-sm" style="margin-bottom:18px">Answer 6 function-specific questions. Pay $5,000 to unlock a deeply-tailored AI strategy for ${fn}.</p>`
      questions.forEach((q, i) => {
        html += `<div class="s-field"><label class="s-lbl">${q}</label>
          <input id="fc-q-${i}" class="s-in" placeholder="Your answer..."/></div>`
      })
      html += `<button class="btn btn-a btn-lg" data-act="fc-pay" style="width:100%;justify-content:center;margin-top:6px">Pay $5,000 & generate <span class="btn-arrow">→</span></button>
        <p class="label" style="text-align:center;margin-top:10px">Secure · PDF + expert review · 30-day guarantee</p>
      </div>`
      qs.innerHTML = html
      qs.querySelectorAll('[data-act]').forEach(b => {
        b.addEventListener('click', () => {
          const act = b.getAttribute('data-act')
          if (act === 'fc-back') {
            setFnSelected(null)
            qs.innerHTML = ''
            if (pick) pick.style.display = 'block'
          }
          if (act === 'fc-pay') {
            // Validate
            const ans: Record<string, string> = {}
            questions.forEach((_, i) => {
              const v = (document.getElementById('fc-q-' + i) as HTMLInputElement)?.value?.trim() || ''
              ans[String(i)] = v
            })
            if (Object.values(ans).filter(v => v).length < 3) {
              showToast('Please answer at least 3 questions', false)
              return
            }
            setFnAnswers(ans)
            openPaymentModal({
              plan: 'function',
              planLabel: 'Function Strategy — ' + fn,
              amountUsd: 5000,
              amountInr: usdToInr(5000),
              purpose: 'function',
            })
          }
        })
      })
    }
    // CTA rail
    const rail = document.getElementById('fc-cta-rail')
    if (rail) rail.textContent = 'Answer the questions to unlock your ' + fn + ' strategy'
  }, [showToast])

  // When function strategy completes
  useEffect(() => {
    if (!fnResult) return
    const qs = document.getElementById('fc-qs')
    if (!qs) return
    const co = 'Your Organisation'
    const fn = fnSelected || ''
    const dt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    const secs = parseStrategySections(fnResult)
    let html = `<div class="res-wrap"><div class="res-head">
      <div class="label" style="color:var(--cyan);margin-bottom:10px">FUNCTION STRATEGY · ${fn} · ${dt}</div>
      <div class="h3 serif" style="margin-bottom:4px">${fn} — AI Roadmap</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <span class="tag tag-cyan">${fn}</span>
        <span class="tag tag-amber">$5,000</span>
      </div></div><div class="res-body">`
    secs.forEach(s => {
      html += `<div class="res-block"><div class="res-block-t">${s.heading}</div><div class="res-text">${s.body.replace(/</g,'&lt;').replace(/\n/g,'<br/>')}</div></div>`
    })
    html += `</div></div>
      <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-a" data-act="fn-pdf" style="flex:1;justify-content:center">📥 Download PDF</button>
        <button class="btn btn-w" data-act="fn-pptx" style="flex:1;justify-content:center">📊 Download PPTX</button>
      </div>`
    qs.innerHTML = html
    qs.querySelectorAll('[data-act]').forEach(b => {
      b.addEventListener('click', () => {
        const act = b.getAttribute('data-act')
        if (act === 'fn-pdf') downloadPdf(co, fn, fnResult)
        if (act === 'fn-pptx') downloadPptxDirect(co, fn, 'function', fnResult, fnStrategyId || undefined)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fnResult])

  // ─── 8. WORKSHOPS ─────────────────────────────────────
  const bookWorkshop = useCallback((id: string) => {
    const plan = PLANS[id as keyof typeof PLANS]
    if (!plan) return sTo('#contact')
    openPaymentModal({
      plan: id,
      planLabel: plan.name,
      amountUsd: plan.monthly,
      amountInr: usdToInr(plan.monthly),
      purpose: 'workshop',
    })
  }, [sTo])

  // ─── 9. CONTACT FORM ──────────────────────────────────
  const submitCF = useCallback(async () => {
    const name = (document.getElementById('cf-nm') as HTMLInputElement)?.value?.trim() || cfName
    const email = (document.getElementById('cf-em') as HTMLInputElement)?.value?.trim() || cfEmail
    const company = (document.getElementById('cf-co') as HTMLInputElement)?.value?.trim() || cfCompany
    const interest = (document.getElementById('cf-in') as HTMLSelectElement)?.value || cfInterest
    const message = (document.getElementById('cf-ms') as HTMLTextAreaElement)?.value?.trim() || cfMessage
    if (!name || !email.includes('@') || !company) {
      showToast('Please fill name, valid email, and company', false)
      return
    }
    try {
      await contactApi.submit({ name, email, company, interest, message })
      sbTrack('contact_leads', { name, email, company, interest, message, source: 'website' })
      setCfSent(true)
      const frm = document.getElementById('cf-frm')
      const ok = document.getElementById('cf-ok')
      if (frm) frm.style.display = 'none'
      if (ok) ok.style.display = 'block'
      showToast('Message sent!')
    } catch (err: any) {
      showToast('Failed: ' + (err.message || 'unknown'), false)
    }
  }, [cfName, cfEmail, cfCompany, cfInterest, cfMessage, showToast])

  // ─── 10. ARIA CHAT ────────────────────────────────────
  const renderChat = useCallback((msgs: { role: 'user' | 'aria'; text: string }[]) => {
    const box = document.getElementById('av-msgs')
    if (!box) return
    box.innerHTML = msgs.map(m => {
      if (m.role === 'user') return `<div style="text-align:right;margin-bottom:8px"><div style="display:inline-block;background:var(--amber);color:var(--ink);padding:8px 12px;border-radius:10px;font-size:13px;max-width:80%">${m.text.replace(/</g,'&lt;')}</div></div>`
      return `<div style="margin-bottom:8px"><div style="display:inline-block;background:var(--carbon);border:1px solid var(--lead);padding:8px 12px;border-radius:10px;font-size:13px;max-width:80%;color:var(--paper)">${m.text.replace(/</g,'&lt;')}</div></div>`
    }).join('')
    box.scrollTop = box.scrollHeight
  }, [])

  useEffect(() => { renderChat(chatMsgs) }, [chatMsgs, renderChat])

  const avSend = useCallback(async () => {
    const inp = document.getElementById('av-in') as HTMLInputElement | null
    const msg = (inp?.value || chatInput).trim()
    if (!msg) return
    if (inp) inp.value = ''
    setChatInput('')
    const newMsgs = [...chatMsgs, { role: 'user' as const, text: msg }]
    setChatMsgs(newMsgs)
    setChatLoading(true)
    try {
      const res = await ariaApi.chat(msg, SESSION_ID)
      setChatMsgs([...newMsgs, { role: 'aria', text: res.reply || "I'm not sure how to help with that. Try asking about our strategies, workshops, or packages." }])
    } catch {
      setChatMsgs([...newMsgs, { role: 'aria', text: "I'm having trouble reaching the server right now. Please try again, or email hello@aiinbox.com." }])
    } finally {
      setChatLoading(false)
    }
  }, [chatInput, chatMsgs])

  const avSendQ = useCallback(async (q: string) => {
    const newMsgs = [...chatMsgs, { role: 'user' as const, text: q }]
    setChatMsgs(newMsgs)
    setChatLoading(true)
    try {
      const res = await ariaApi.chat(q, SESSION_ID)
      setChatMsgs([...newMsgs, { role: 'aria', text: res.reply || 'Let me know more about what you need.' }])
    } catch {
      setChatMsgs([...newMsgs, { role: 'aria', text: "I'm offline temporarily. Email hello@aiinbox.com." }])
    } finally {
      setChatLoading(false)
    }
  }, [chatMsgs])

  // ─── 11. PAYMENT MODAL ────────────────────────────────
  const openPaymentModal = useCallback((opts: { plan: string; planLabel: string; amountUsd: number; amountInr: number; purpose: 'custom' | 'function' | 'plan' | 'workshop' }) => {
    setModal({ open: true, ...opts })
    setModalStepState(1)
    const m = document.getElementById('modal')
    if (m) m.style.display = 'flex'
    const planNameEl = document.getElementById('ms-plan-name')
    const priceEl = document.getElementById('modal-price')
    const planNameEl2 = document.getElementById('ms-plan-name-2')
    const priceEl2 = document.getElementById('ms-plan-price-2')
    if (planNameEl) planNameEl.textContent = opts.planLabel
    if (planNameEl2) planNameEl2.textContent = opts.planLabel
    if (priceEl) priceEl.textContent = `$${opts.amountUsd.toLocaleString()}`
    const priceLabelEl = document.getElementById('ms-plan-price')
    if (priceLabelEl) priceLabelEl.textContent = `$${opts.amountUsd.toLocaleString()} · ${INR(opts.amountInr)}`
    if (priceEl2) priceEl2.textContent = `$${opts.amountUsd.toLocaleString()} · ${INR(opts.amountInr)}`
    // Reset step UI
    document.querySelectorAll('.m-step').forEach((s, i) => {
      ;(s as HTMLElement).style.display = i === 0 ? 'block' : 'none'
      s.classList.toggle('on', i === 0)
    })
    document.querySelectorAll('.modal-step-item').forEach((s, i) => {
      s.classList.toggle('active', i === 0)
      s.classList.remove('done')
    })
  }, [])

  const modalStep2 = useCallback(() => {
    const fn = (document.getElementById('co-fn') as HTMLInputElement)?.value?.trim() || coFn
    const em = (document.getElementById('co-em') as HTMLInputElement)?.value?.trim() || coEm
    const co = (document.getElementById('co-co') as HTMLInputElement)?.value?.trim() || coCo
    if (!fn || !em.includes('@') || !co) {
      showToast('Please fill all required fields', false)
      return
    }
    setModalStepState(2)
    document.querySelectorAll('.m-step').forEach((s, i) => {
      ;(s as HTMLElement).style.display = i === 1 ? 'block' : 'none'
      s.classList.toggle('on', i === 1)
    })
    document.querySelectorAll('.modal-step-item').forEach((s, i) => {
      s.classList.toggle('done', i === 0)
      s.classList.toggle('active', i === 1)
    })
  }, [coFn, coEm, coCo, showToast])

  const processPayment = useCallback(async () => {
    const fn = (document.getElementById('co-fn') as HTMLInputElement)?.value?.trim() || ''
    const ln = (document.getElementById('co-ln') as HTMLInputElement)?.value?.trim() || ''
    const em = (document.getElementById('co-em') as HTMLInputElement)?.value?.trim() || ''
    const co = (document.getElementById('co-co') as HTMLInputElement)?.value?.trim() || ''
    const name = (fn + ' ' + ln).trim()
    const { amountInr, planLabel, purpose } = modal

    await sbTrack('orders', { plan_name: planLabel, plan_amount_inr: amountInr, amount_inr: amountInr, billing_cycle: 'one-time', customer_name: name, customer_email: em, customer_company: co, payment_status: 'pending', currency: 'INR' })

    const loaded = await loadRazorpay()
    if (!loaded) {
      showToast('Could not load Razorpay (check internet connection)', false)
      return
    }

    let rzpOrderId = ''
    let dbOrderId = ''
    let rzpKeyFromBackend = ''
    try {
      const ord = await paymentApi.createOrder({ plan_name: planLabel, amount_inr: amountInr, customer_name: name, customer_email: em, customer_company: co })
      rzpOrderId = ord.razorpay_order_id
      dbOrderId = ord.order_id
      rzpKeyFromBackend = ord.key_id || ''
    } catch (err: any) {
      // Backend order creation failed — log but proceed with client-side checkout
      console.warn('[Razorpay] Backend order creation failed, proceeding without server order:', err.message)
    }

    // Resolve the key — backend takes priority over the build-time env
    const finalKey = (rzpKeyFromBackend && rzpKeyFromBackend.startsWith('rzp_'))
      ? rzpKeyFromBackend
      : RZP_KEY
    if (!finalKey || finalKey === 'rzp_test_placeholder' || !finalKey.startsWith('rzp_')) {
      const msg = 'Razorpay key not configured. Either set RAZORPAY_KEY_ID in backend/.env (recommended) or VITE_RAZORPAY_KEY_ID in frontend/.env.'
      console.error('[Razorpay]', msg, 'finalKey:', finalKey)
      showToast(msg, false)
      return
    }

    try {
      const rzp = new (window as any).Razorpay({
        key: finalKey,
        amount: amountInr * 100,  // amount in paise
        currency: 'INR',
        name: 'AI in a Box',
        description: planLabel,
        order_id: rzpOrderId || undefined,
        prefill: { name, email: em },
        theme: { color: '#E6933A' },
        handler: async (resp: any) => {
          await sbTrack('payment_attempts', { razorpay_order_id: resp.razorpay_order_id || rzpOrderId, razorpay_payment_id: resp.razorpay_payment_id, status: 'paid', amount_inr: amountInr })
          // Verify on backend if we have an order id
          if (rzpOrderId && resp.razorpay_payment_id && resp.razorpay_signature) {
            try {
              await paymentApi.verify({
                razorpay_order_id: resp.razorpay_order_id || rzpOrderId,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                order_id: dbOrderId,
              })
            } catch (err: any) {
              console.warn('[Razorpay] verify failed:', err.message)
            }
          }
          setModalStepState(3)
          document.querySelectorAll('.m-step').forEach((s, i) => {
            ;(s as HTMLElement).style.display = i === 2 ? 'block' : 'none'
            s.classList.toggle('on', i === 2)
          })
          document.querySelectorAll('.modal-step-item').forEach((s, i) => {
            s.classList.toggle('done', i < 2)
            s.classList.toggle('active', i === 2)
          })
          showToast('Payment successful!')
          setTimeout(() => {
            if (purpose === 'custom') runCustomStrategy()
            if (purpose === 'function') runFunctionStrategy()
          }, 600)
        },
        modal: {
          ondismiss: async () => {
            await sbTrack('payment_attempts', { razorpay_order_id: rzpOrderId, status: 'cancelled', amount_inr: amountInr })
            showToast('Payment cancelled', false)
          }
        }
      })
      rzp.on('payment.failed', async (resp: any) => {
        await sbTrack('payment_attempts', {
          razorpay_order_id: rzpOrderId,
          razorpay_payment_id: resp.error?.metadata?.payment_id,
          status: 'failed',
          error_code: resp.error?.code,
          error_description: resp.error?.description,
          amount_inr: amountInr
        })
        showToast('Payment failed: ' + (resp.error?.description || 'Unknown error'), false)
      })
      rzp.open()
    } catch (err: any) {
      console.error('[Razorpay] open() failed:', err)
      showToast('Could not open Razorpay: ' + (err.message || 'unknown'), false)
    }
  }, [modal, showToast])

  // ─── 12. CUSTOM STRATEGY GENERATION (POST PAYMENT) ────
  const runCustomStrategy = useCallback(async () => {
    setCbPaid(true)
    setCbLoading(true)
    setCbError(null)
    try {
      await sbTrack('strategy_generations', { session_id: SESSION_ID, company_name: cbAns.co || 'Your Organisation', industry: cbAns.ind || '', strategy_type: 'custom', model_used: 'claude-opus-4-5', payment_status: 'paid' })
      const res = await strategyApi.custom({ answers: cbAns, session_id: SESSION_ID })
      setCbResult(res.strategy)
      setCbStrategyId(res.id)
      showToast('Custom strategy ready!')
    } catch (err: any) {
      setCbError(err.message || 'Generation failed')
      showToast('Failed: ' + err.message, false)
    } finally {
      setCbLoading(false)
    }
  }, [cbAns, showToast])

  const runFunctionStrategy = useCallback(async () => {
    if (!fnSelected) return
    setFnPaid(true)
    setFnLoading(true)
    setFnError(null)
    try {
      await sbTrack('strategy_generations', { session_id: SESSION_ID, company_name: 'Your Organisation', industry: '', strategy_type: 'function', function_name: fnSelected, model_used: 'claude-opus-4-5', payment_status: 'paid' })
      const res = await strategyApi.function({ company_name: 'Your Organisation', function_name: fnSelected, answers: fnAnswers, session_id: SESSION_ID })
      setFnResult(res.strategy)
      showToast('Function strategy ready!')
    } catch (err: any) {
      setFnError(err.message || 'Generation failed')
      showToast('Failed: ' + err.message, false)
    } finally {
      setFnLoading(false)
    }
  }, [fnSelected, fnAnswers, showToast])

  // ─── 13. PDF DOWNLOAD (CLIENT-SIDE PRINT-FRIENDLY HTML) ─
  const downloadPdf = useCallback((co: string, ind: string, text: string) => {
    const w = window.open('', '_blank')
    if (!w) return
    const dt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    const secs = parseStrategySections(text)
    const slides = secs.map(s =>
      `<div class="page"><div class="ph"><div class="ph-l">AI<em>in</em>Box · ${co}</div><div class="ph-r">${dt}</div></div>
        <div class="sl">${s.heading}</div>
        <hr class="ar"/>
        <div class="sb"><div class="sb-b">${s.body.replace(/</g,'&lt;').replace(/\n/g,'<br/>')}</div></div>
        <footer><span>AI in a Box · Confidential</span><span>${co}</span></footer></div>`
    ).join('')
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${co} — AI Strategy</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet"/>
      <style>
        @page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;color:#111;background:#fff;-webkit-print-color-adjust:exact}
        .cover{background:#07090D;color:#F0F6FC;min-height:297mm;width:210mm;padding:52px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;position:relative}
        .cover-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(33,38,45,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(33,38,45,.5) 1px,transparent 1px);background-size:40px 40px;opacity:.6}
        .cover-logo{font-family:'Cormorant Garamond';font-size:18px;font-weight:300;letter-spacing:.3em;position:relative;z-index:1;margin-bottom:60px}
        .cover-logo span{color:#E6933A;font-style:italic}
        .cover-label{font-family:'DM Mono';font-size:8px;letter-spacing:.2em;color:#6E7681;text-transform:uppercase;margin-bottom:16px;position:relative;z-index:1}
        .cover-h1{font-family:'Cormorant Garamond';font-size:52px;font-weight:300;line-height:1;letter-spacing:-.02em;margin-bottom:16px;position:relative;z-index:1}
        .cover-h1 em{color:#E6933A;font-style:italic}
        .cover-sub{font-size:14px;color:#8B949E;line-height:1.75;font-weight:300;position:relative;z-index:1}
        .cover-bot{display:flex;justify-content:space-between;border-top:1px solid #21262D;padding-top:16px;position:relative;z-index:1}
        .cover-bot-l{font-family:'DM Mono';font-size:8px;letter-spacing:.08em;color:#6E7681}
        .cover-conf{font-family:'DM Mono';font-size:8px;letter-spacing:.12em;color:rgba(230,147,58,.6);border:1px solid rgba(230,147,58,.2);padding:3px 8px;border-radius:2px}
        .page{width:210mm;padding:44px 52px;min-height:297mm;page-break-after:always}
        .page:last-child{page-break-after:auto}
        .ph{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:2px solid #111;margin-bottom:28px}
        .ph-l{font-family:'DM Mono';font-size:9px;letter-spacing:.12em;color:#718096}
        .ph-l em{color:#E6933A;font-style:italic;font-family:'Cormorant Garamond';font-size:11px}
        .ph-r{font-family:'DM Mono';font-size:9px;letter-spacing:.1em;color:#999}
        .sl{font-family:'DM Mono';font-size:8px;letter-spacing:.2em;color:#E6933A;text-transform:uppercase}
        .ar{height:2px;background:linear-gradient(90deg,#E6933A,transparent);border:none;margin:16px 0}
        .sb{padding:16px 0;border-bottom:1px solid #eee}
        .sb-b{font-size:12px;color:#333;line-height:1.8;font-weight:300}
        footer{margin-top:28px;font-family:'DM Mono';font-size:8px;letter-spacing:.06em;color:#bbb;border-top:1px solid #eee;padding-top:14px;display:flex;justify-content:space-between}
      </style></head><body>
      <div class="cover"><div class="cover-bg"></div>
        <div><div class="cover-logo">AI<span>in</span>Box</div>
          <div class="cover-label">AI Strategy Report · High-Level</div>
          <div class="cover-h1">${co}<br/><em>strategy.</em></div>
          <div class="cover-sub">${ind} · Generated ${dt}<br/>Powered by AI in a Box — multimodal AI cascade.</div>
        </div>
        <div class="cover-bot"><span class="cover-bot-l">AI IN A BOX · ${dt}</span><span class="cover-conf">CONFIDENTIAL</span></div>
      </div>
      ${slides}
      </body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }, [])

  // ─── 14. PPTX DOWNLOAD ────────────────────────────────
  // Calls backend /api/pptx/generate to build a professional pptxgenjs deck,
  // then downloads it as a .pptx file.
  const downloadPptxDirect = useCallback(async (co: string, ind: string, type: 'instant' | 'custom' | 'function', text: string, id?: string) => {
    try {
      showToast('Generating professional deck…')
      const res = await pptxApi.generate({ company_name: co, industry: ind, type, strategy_text: text, strategy_id: id })
      // Decode base64 and trigger download
      const binary = atob(res.base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.filename || `AI-Strategy-${co}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('Deck downloaded!')
    } catch (err: any) {
      showToast('Could not generate deck: ' + (err.message || 'unknown'), false)
    }
  }, [showToast])

  // ─── 15. PRICING CARDS RENDER ─────────────────────────
  useEffect(() => {
    const grid = document.getElementById('price-grid')
    if (!grid) return
    const plans = [
      { id: 'starter', name: 'Starter', tagline: 'For first explorations', monthly: 0, annual: 0, features: ['3 free strategies / day','Basic PDF download','Email support (48hr)','Community access'], cta: 'Start free', color: 'var(--zinc)' },
      { id: 'professional', name: 'Professional', tagline: 'For growing teams', monthly: 299, annual: 2870, features: ['Unlimited instant strategies','1 Custom Strategy included','All Function strategies','Priority email support (24hr)','PPTX downloads'], cta: 'Subscribe', color: 'var(--amber)', popular: true },
      { id: 'enterprise', name: 'Enterprise', tagline: 'For mid-large enterprises', monthly: 1500, annual: 14400, features: ['Everything in Professional','1 Board AI Briefing','8hrs expert consulting / month','4-hour SLA support','Dedicated success manager'], cta: 'Talk to sales', color: 'var(--cyan)' },
      { id: 'executive', name: 'Executive', tagline: 'Full C-suite transformation', monthly: 4500, annual: 43200, features: ['Everything in Enterprise','AI Design Sprint included','Resident AI Expert','Same-day SLA support','Quarterly board reviews'], cta: 'Talk to sales', color: 'var(--violet)' },
    ]
    grid.innerHTML = plans.map(p => {
      const price = annual ? p.annual : p.monthly
      const period = price === 0 ? 'forever' : (annual ? '/ year' : '/ month')
      const monthlyEq = annual && p.monthly > 0 ? `(₹${Math.round(p.annual / 12 * USD_TO_INR / 1000) * 1000} / mo)` : ''
      return `<div class="price-card ${p.popular ? 'pop' : ''}">
        ${p.popular ? '<div class="price-pop">MOST POPULAR</div>' : ''}
        <div class="price-name" style="color:${p.color}">${p.name}</div>
        <div class="price-tag">${p.tagline}</div>
        <div class="price-amt">$${price.toLocaleString()}<span style="font-size:14px;color:var(--zinc);font-weight:300"> ${period}</span></div>
        <div class="price-eq">${monthlyEq}</div>
        <ul class="price-feats">${p.features.map(f => `<li>✓ ${f}</li>`).join('')}</ul>
        <button class="btn ${p.popular ? 'btn-a' : 'btn-o'}" data-plan="${p.id}" style="width:100%;justify-content:center;margin-top:10px">${p.cta}</button>
      </div>`
    }).join('')
    grid.querySelectorAll('[data-plan]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-plan') || ''
        const p = plans.find(x => x.id === id)
        if (!p) return
        if (p.monthly === 0) { sTo('#services'); return }
        if (id === 'enterprise' || id === 'executive') { sTo('#contact'); return }
        openPaymentModal({
          plan: id,
          planLabel: p.name + (annual ? ' (Annual)' : ' (Monthly)'),
          amountUsd: annual ? p.annual : p.monthly,
          amountInr: usdToInr(annual ? p.annual : p.monthly),
          purpose: 'plan',
        })
      })
    })
  }, [annual, openPaymentModal, sTo])

  // ─── 16. HERO 3D — THREE.JS NEURAL SPHERE ─────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | null = null
    const setupScene = async () => {
      // Load three.js dynamically
      if (!(window as any).THREE) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
          s.onload = () => resolve()
          s.onerror = () => reject()
          document.head.appendChild(s)
        }).catch(() => null)
      }
      const THREE = (window as any).THREE
      if (!THREE) return

      // Find the hero element to inject canvas behind content
      const heroEl = document.getElementById('hero')
      if (!heroEl) return

      // Create canvas
      let canvas = document.getElementById('hero-3d') as HTMLCanvasElement | null
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.id = 'hero-3d'
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.4s ease'
        heroEl.insertBefore(canvas, heroEl.firstChild)
      }

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0, 0, 13)

      const COLORS = [0xE6933A, 0x58A6FF, 0xBC8CFF, 0x3FB950, 0xC9963A]
      const NODE_COUNT = 90
      const RADIUS = 4.4
      const nodes: any[] = []
      const nodeGroup = new THREE.Group()

      // Fibonacci sphere
      const spherePts: any[] = []
      const phi = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < NODE_COUNT; i++) {
        const y = 1 - (i / (NODE_COUNT - 1)) * 2
        const radiusAtY = Math.sqrt(1 - y * y)
        const theta = phi * i
        spherePts.push(new THREE.Vector3(Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY))
      }
      const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8)
      spherePts.forEach((p, i) => {
        const jitter = 1 + (Math.random() - 0.5) * 0.12
        const pos = p.clone().multiplyScalar(RADIUS * jitter)
        const color = COLORS[i % COLORS.length]
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
        const mesh = new THREE.Mesh(nodeGeo, mat)
        mesh.position.copy(pos)
        nodeGroup.add(mesh)
        nodes.push({ mesh, basePos: pos.clone(), phase: Math.random() * Math.PI * 2 })
      })

      const lineMat = new THREE.LineBasicMaterial({ color: 0x8B949E, transparent: true, opacity: 0.12 })
      const linePos: number[] = []
      const MAX_DIST = 2.1
      for (let a = 0; a < nodes.length; a++) {
        let connections = 0
        for (let b = a + 1; b < nodes.length; b++) {
          if (connections >= 3) break
          const d = nodes[a].basePos.distanceTo(nodes[b].basePos)
          if (d < MAX_DIST) {
            linePos.push(nodes[a].basePos.x, nodes[a].basePos.y, nodes[a].basePos.z)
            linePos.push(nodes[b].basePos.x, nodes[b].basePos.y, nodes[b].basePos.z)
            connections++
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
      const lines = new THREE.LineSegments(lineGeo, lineMat)
      nodeGroup.add(lines)

      const shellGeo = new THREE.IcosahedronGeometry(RADIUS * 1.35, 1)
      const shellMat = new THREE.MeshBasicMaterial({ color: 0xE6933A, wireframe: true, transparent: true, opacity: 0.045 })
      const shell = new THREE.Mesh(shellGeo, shellMat)
      nodeGroup.add(shell)

      const PCOUNT = 160
      const ppos = new Float32Array(PCOUNT * 3)
      for (let i = 0; i < PCOUNT; i++) {
        const r = RADIUS * (1.6 + Math.random() * 1.8)
        const t = Math.random() * Math.PI * 2
        const ph = Math.acos((Math.random() * 2) - 1)
        ppos[i*3] = r * Math.sin(ph) * Math.cos(t)
        ppos[i*3+1] = r * Math.sin(ph) * Math.sin(t)
        ppos[i*3+2] = r * Math.cos(ph)
      }
      const pgeo = new THREE.BufferGeometry()
      pgeo.setAttribute('position', new THREE.Float32BufferAttribute(ppos, 3))
      const pmat = new THREE.PointsMaterial({ color: 0xF0F6FC, size: 0.025, transparent: true, opacity: 0.35 })
      const particles = new THREE.Points(pgeo, pmat)

      scene.add(nodeGroup)
      scene.add(particles)

      let mouseX = 0, mouseY = 0, tRotX = 0, tRotY = 0
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1
        mouseY = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('mousemove', onMouseMove)

      const resize = () => {
        const rect = heroEl.getBoundingClientRect()
        renderer.setSize(rect.width || window.innerWidth, rect.height || window.innerHeight, false)
        camera.aspect = rect.width / rect.height
        camera.updateProjectionMatrix()
      }
      resize()
      window.addEventListener('resize', resize)

      const clock = new THREE.Clock()
      let rafId: number | null = null
      const animate = () => {
        rafId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        nodeGroup.rotation.y = t * 0.07
        nodeGroup.rotation.x = Math.sin(t * 0.05) * 0.12
        particles.rotation.y = -t * 0.015
        tRotY += (mouseX * 0.25 - tRotY) * 0.04
        tRotX += (mouseY * 0.18 - tRotX) * 0.04
        nodeGroup.rotation.y += tRotY
        nodeGroup.rotation.x += tRotX
        nodes.forEach(n => {
          const scale = 1 + Math.sin(t * 1.4 + n.phase) * 0.25
          n.mesh.scale.setScalar(scale)
        })
        renderer.render(scene, camera)
      }

      let isVisible = true
      const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
          if (isVisible && !rafId) animate()
          if (!isVisible && rafId) { cancelAnimationFrame(rafId); rafId = null }
        })
      }, { threshold: 0.05 }) : null
      io?.observe(heroEl)

      animate()
      requestAnimationFrame(() => { canvas!.style.opacity = '1' })

      cleanup = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', resize)
        io?.disconnect()
        if (rafId) cancelAnimationFrame(rafId)
        renderer.dispose()
      }
    }

    setupScene()
    return () => { if (cleanup) cleanup() }
  }, [])

  // ─── 17. RENDER ───────────────────────────────────────
  return (
    <>
      <div ref={rootRef} className="new-landing-root" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
          background: 'var(--carbon)',
          border: '1px solid ' + (toast.ok ? 'rgba(63,185,80,.4)' : 'rgba(248,81,73,.4)'),
          borderRadius: 8, padding: '12px 18px', color: 'var(--paper)',
          fontSize: 13, boxShadow: '0 12px 40px rgba(0,0,0,.6)',
          animation: 'fadeIn .2s'
        }}>
          {toast.msg}
        </div>
      )}
    </>
  )
}
