import { useState } from 'react'
import { pptxApi } from '../lib/api'

interface Section { heading: string; body: string; bullets: string[] }

function parseSections(text: string): Section[] {
  return text.split(/\n(?=[1-9]\.|#{1,3}\s)/).filter(Boolean).map(sec => {
    const lines = sec.trim().split('\n')
    const heading = lines[0].replace(/^[#\d.\s]+/, '').trim()
    const body = lines.slice(1).join('\n').trim() || sec.trim()
    const bullets = body.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(l => l.replace(/^[-–•·*]\s+/, '').trim())
      .filter(l => l.length > 3)
    return { heading, body, bullets }
  })
}

const TYPE_ACCENT: Record<string, string> = {
  instant: '#E6933A',
  custom: '#BC8CFF',
  function: '#58A6FF',
}

interface Props {
  text: string
  company: string
  industry: string
  type: string
  strategyId?: string
}

export default function SlideViewer({ text, company, industry, type, strategyId }: Props) {
  const [view, setView] = useState<'slides' | 'text'>('slides')
  const [downloading, setDownloading] = useState(false)
  const [dlError, setDlError] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)

  const accent = TYPE_ACCENT[type] || '#E6933A'
  const sections = parseSections(text)
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  const typeLabel = type === 'instant' ? 'INSTANT AI STRATEGY'
    : type === 'custom' ? 'CUSTOM AI STRATEGY'
    : 'FUNCTION AI STRATEGY'

  // All virtual slides
  const slides = [
    { id: 'cover', type: 'cover' },
    { id: 'stats', type: 'stats' },
    { id: 'agenda', type: 'agenda' },
    ...sections.map((s, i) => ({ id: `sec-${i}`, type: 'section', index: i, section: s })),
    { id: 'roadmap', type: 'roadmap' },
    { id: 'closing', type: 'closing' },
  ]

  const downloadPPTX = async () => {
    setDownloading(true); setDlError('')
    try {
      const res = await pptxApi.generate({
        company_name: company,
        industry,
        type,
        strategy_text: text,
        strategy_id: strategyId
      })
      // Decode base64 and trigger download
      const binary = atob(res.base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = res.filename; a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setDlError(e.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="flex border border-lead rounded-lg overflow-hidden">
            <button onClick={() => setView('slides')} className={`px-4 py-2 text-[12px] transition-all ${view === 'slides' ? 'text-paper' : 'text-zinc hover:text-paper'}`}
              style={{ background: view === 'slides' ? accent + '20' : 'transparent', borderRight: '1px solid #21262D' }}>
              🖥 Slides
            </button>
            <button onClick={() => setView('text')} className={`px-4 py-2 text-[12px] transition-all ${view === 'text' ? 'text-paper' : 'text-zinc hover:text-paper'}`}
              style={{ background: view === 'text' ? accent + '20' : 'transparent' }}>
              📄 Report
            </button>
          </div>
          <div className="font-mono text-[10px] text-zinc">{slides.length} slides · {sections.length} sections</div>
        </div>
        <div className="flex items-center gap-2">
          {dlError && <p className="text-rose text-xs">{dlError}</p>}
          <button onClick={downloadPPTX} disabled={downloading}
            className="btn-amber disabled:opacity-60"
            style={{ background: accent }}>
            {downloading
              ? <><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />Generating…</>
              : <>📥 Download PPTX</>}
          </button>
          <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline">
            📞 Expert review
          </button>
        </div>
      </div>

      {/* SLIDE VIEW */}
      {view === 'slides' && (
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2 w-[120px] flex-shrink-0 max-h-[520px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin' }}>
            {slides.map((sl, i) => (
              <button key={sl.id} onClick={() => setActiveSlide(i)}
                className="relative rounded overflow-hidden border transition-all flex-shrink-0"
                style={{
                  aspectRatio: '16/9', width: '100%',
                  borderColor: activeSlide === i ? accent : '#21262D',
                  background: '#07090D'
                }}>
                <SlideThumbnail slide={sl} accent={accent} company={company} industry={industry} typeLabel={typeLabel} date={date} sections={sections} index={i} />
                <div className="absolute bottom-1 right-1 font-mono text-[7px] text-zinc/60">{i + 1}</div>
              </button>
            ))}
          </div>

          {/* Main slide */}
          <div className="flex-1">
            <div className="rounded-xl overflow-hidden border border-lead"
              style={{ aspectRatio: '16/9', background: '#07090D', position: 'relative' }}>
              <SlideContent
                slide={slides[activeSlide]}
                accent={accent}
                company={company}
                industry={industry}
                typeLabel={typeLabel}
                date={date}
                sections={sections}
                totalSlides={slides.length}
              />
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-between mt-3 px-1">
              <button onClick={() => setActiveSlide(s => Math.max(0, s - 1))} disabled={activeSlide === 0}
                className="px-4 py-1.5 border border-lead rounded text-[12px] text-zinc hover:text-paper disabled:opacity-30 transition-all">← Prev</button>
              <span className="font-mono text-[11px] text-zinc">{activeSlide + 1} / {slides.length}</span>
              <button onClick={() => setActiveSlide(s => Math.min(slides.length - 1, s + 1))} disabled={activeSlide === slides.length - 1}
                className="px-4 py-1.5 border border-lead rounded text-[12px] text-zinc hover:text-paper disabled:opacity-30 transition-all">Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* TEXT / REPORT VIEW */}
      {view === 'text' && (
        <div className="glass-card overflow-hidden">
          <div className="px-7 py-6 bg-onyx border-b border-lead">
            <div className="font-mono text-[9px] tracking-widest mb-2" style={{ color: accent }}>AI Strategy Report · {date}</div>
            <div className="font-serif text-2xl font-light mb-2">{company}</div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono" style={{ background: accent + '15', border: `1px solid ${accent}30`, color: accent }}>{industry}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-jade/10 border border-jade/20 text-jade">Claude Opus · Live Research</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-violet/10 border border-violet/20 text-violet">{sections.length} sections</span>
            </div>
          </div>
          <div className="px-7 divide-y divide-lead">
            {sections.map((sec, i) => (
              <div key={i} className="py-5 transition-all border-l-2 border-l-transparent hover:pl-3"
                onMouseEnter={e => (e.currentTarget.style.borderLeftColor = accent)}
                onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'transparent')}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: accent }}>{i + 1}. {sec.heading}</div>
                <p className="text-[12px] text-silver leading-relaxed whitespace-pre-line">{sec.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Slide thumbnail (small) ───────────────────────────────
function SlideThumbnail({ slide, accent, company }: any) {
  const bg = slide.type === 'stats' || slide.type === 'agenda' || slide.type === 'roadmap' ? '#0D1117' : '#07090D'
  return (
    <div className="absolute inset-0 p-1.5" style={{ background: bg }}>
      <div className="w-1 absolute left-0 top-0 bottom-0" style={{ background: accent }} />
      <div className="ml-1.5">
        <div className="font-mono text-[5px] tracking-wide mb-0.5" style={{ color: accent }}>
          {slide.type === 'cover' ? 'COVER' : slide.type === 'stats' ? 'STATS' : slide.type === 'agenda' ? 'AGENDA' : slide.type === 'roadmap' ? 'ROADMAP' : slide.type === 'closing' ? 'CLOSE' : `${(slide.index || 0) + 1}`}
        </div>
        <div className="text-[6px] text-gray-300 font-bold leading-tight truncate">
          {slide.type === 'cover' ? company : slide.type === 'section' && slide.section ? slide.section.heading : slide.type === 'roadmap' ? '18-Month Roadmap' : slide.type === 'closing' ? 'Next Steps' : 'AI in a Box'}
        </div>
        {slide.type === 'section' && slide.section?.bullets?.slice(0, 3).map((b: string, i: number) => (
          <div key={i} className="text-[5px] text-gray-500 truncate mt-0.5">· {b.slice(0, 30)}</div>
        ))}
      </div>
    </div>
  )
}

// ── Full slide content renderer ───────────────────────────
function SlideContent({ slide, accent, company, industry, typeLabel, date, sections }: any) {
  if (slide.type === 'cover') return <CoverSlide accent={accent} company={company} industry={industry} typeLabel={typeLabel} date={date} />
  if (slide.type === 'stats') return <StatsSlide accent={accent} />
  if (slide.type === 'agenda') return <AgendaSlide accent={accent} sections={sections} />
  if (slide.type === 'section') return <SectionSlide accent={accent} section={slide.section} index={slide.index + 1} totalSections={sections.length} />
  if (slide.type === 'roadmap') return <RoadmapSlide accent={accent} />
  if (slide.type === 'closing') return <ClosingSlide accent={accent} company={company} />
  return null
}

const S = {
  slide: { width: '100%', height: '100%', position: 'absolute' as const, inset: 0, fontFamily: 'Georgia, serif', overflow: 'hidden' },
  strip: (accent: string) => ({ position: 'absolute' as const, left: 0, top: 0, bottom: 0, width: '2.4%', background: accent }),
}

function CoverSlide({ accent, company, industry, typeLabel, date }: any) {
  return (
    <div style={{ ...S.slide, background: '#07090D' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', right: '3%', top: '4%', background: '#161B22', border: '1px solid #21262D', borderRadius: 4, padding: '3px 10px', fontFamily: 'Calibri, sans-serif', fontSize: '1.2%', letterSpacing: '0.15em', color: '#6E7681' }}>AI IN A BOX · CONFIDENTIAL</div>
      <div style={{ position: 'absolute', left: '5%', top: '4%', fontFamily: 'Georgia, serif', fontSize: '3.5%', color: '#F0F6FC', letterSpacing: '-0.01em' }}>
        <span style={{ fontWeight: 700 }}>AI</span><span style={{ color: accent, fontStyle: 'italic' }}>in</span><span style={{ color: '#8B949E' }}>Box</span>
      </div>
      <div style={{ position: 'absolute', left: '5%', top: '22%', fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', letterSpacing: '0.25em', color: accent }}>{typeLabel}</div>
      <div style={{ position: 'absolute', left: '5%', top: '28%', right: '5%', fontFamily: 'Georgia, serif', fontSize: '7.5%', fontWeight: 700, color: '#F0F6FC', lineHeight: 1.1 }}>{company.slice(0, 35)}</div>
      <div style={{ position: 'absolute', left: '5%', top: '56%', fontFamily: 'Georgia, serif', fontSize: '3.5%', color: '#8B949E', fontStyle: 'italic' }}>AI Transformation Strategy</div>
      {[{ l: 'Industry', v: industry.slice(0, 20) }, { l: 'Generated', v: date.split(' ').slice(0, 3).join(' ') }, { l: 'Model', v: 'Claude Opus' }, { l: 'By', v: 'AI in a Box' }].map((m, i) => (
        <div key={i} style={{ position: 'absolute', left: `${5 + i * 23.5}%`, top: '70%', width: '21%', background: '#161B22', border: '1px solid #21262D', borderRadius: 4, padding: '2% 3%' }}>
          <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.1%', letterSpacing: '0.15em', color: '#6E7681', marginBottom: '2%' }}>{m.l.toUpperCase()}</div>
          <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.8%', color: '#F0F6FC', fontWeight: 600 }}>{m.v}</div>
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: '2%', left: '5%', right: '5%', height: '1px', background: '#21262D' }} />
      <div style={{ position: 'absolute', bottom: '0.5%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Calibri, sans-serif', fontSize: '1.2%', color: '#6E7681' }}>hello@aiinbox.com · aiinbox.com · © 2026</div>
    </div>
  )
}

function StatsSlide({ accent }: any) {
  const stats = [
    { n: '$72.8B', l: 'AI consulting market by 2030', c: '#E6933A' },
    { n: '31.6%', l: 'Annual growth rate (CAGR)', c: '#58A6FF' },
    { n: '86%', l: 'Buyers now seek AI-enabled firms', c: '#3FB950' },
    { n: '95%', l: 'AI pilots fail without strategy', c: '#F85149' },
  ]
  return (
    <div style={{ ...S.slide, background: '#0D1117' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', left: '5%', top: '6%', fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', letterSpacing: '0.25em', color: accent }}>WHY AI. WHY NOW.</div>
      <div style={{ position: 'absolute', left: '5%', top: '13%', fontFamily: 'Georgia, serif', fontSize: '4.5%', color: '#F0F6FC', fontStyle: 'italic' }}>The AI opportunity in numbers</div>
      <div style={{ position: 'absolute', left: '5%', right: '5%', top: '30%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5%' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#161B22', border: '1px solid #21262D', borderLeft: `4px solid ${s.c}`, borderRadius: 6, padding: '4% 5%' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '6%', color: s.c, fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.8%', color: '#8B949E', marginTop: '4%' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaSlide({ accent, sections }: any) {
  const half = Math.ceil(sections.length / 2)
  const left = sections.slice(0, half)
  const right = sections.slice(half)
  return (
    <div style={{ ...S.slide, background: '#0D1117' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', left: '5%', top: '6%', fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', letterSpacing: '0.25em', color: accent }}>AGENDA</div>
      <div style={{ position: 'absolute', left: '5%', top: '13%', fontFamily: 'Georgia, serif', fontSize: '4.5%', color: '#F0F6FC', fontStyle: 'italic' }}>What we cover</div>
      <div style={{ position: 'absolute', left: '5%', right: '5%', top: '30%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2%' }}>
        {[left, right].map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '2%' }}>
            {col.map((sec: Section, ri: number) => {
              const globalIdx = ci === 0 ? ri + 1 : half + ri + 1
              return (
                <div key={ri} style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: 4, padding: '2.5% 3%', display: 'flex', alignItems: 'center', gap: '4%' }}>
                  <div style={{ width: '7%', aspectRatio: '1', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', color: '#07090D', fontWeight: 700, flexShrink: 0 }}>{globalIdx}</div>
                  <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.7%', color: '#F0F6FC', lineHeight: 1.3 }}>{sec.heading.slice(0, 45)}</div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionSlide({ accent, section, index, totalSections }: any) {
  const bullets = (section.bullets || []).slice(0, 8)
  const half = Math.ceil(bullets.length / 2)
  const left = bullets.slice(0, half)
  const right = bullets.slice(half)
  return (
    <div style={{ ...S.slide, background: '#07090D' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', right: '3%', top: '3%', fontFamily: 'Georgia, serif', fontSize: '13%', color: '#21262D', fontWeight: 700, lineHeight: 1 }}>{String(index).padStart(2, '0')}</div>
      <div style={{ position: 'absolute', left: '5%', top: '6%', right: '20%', fontFamily: 'Georgia, serif', fontSize: '4.8%', color: '#F0F6FC', fontWeight: 700, lineHeight: 1.15 }}>{section.heading.slice(0, 55)}</div>
      <div style={{ position: 'absolute', left: '5%', top: '25%', width: '22%', height: '0.8%', background: accent }} />
      <div style={{ position: 'absolute', left: '5%', right: '3%', top: '30%', bottom: '8%', display: 'grid', gridTemplateColumns: right.length > 0 ? '1fr 1px 1fr' : '1fr', gap: '3%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5%' }}>
          {left.map((b: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '3%', alignItems: 'flex-start' }}>
              <div style={{ width: '2.5%', height: '2.5%', borderRadius: '50%', background: accent, flexShrink: 0, marginTop: '0.5%' }} />
              <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '2%', color: '#8B949E', lineHeight: 1.4 }}>{b.slice(0, 80)}</div>
            </div>
          ))}
        </div>
        {right.length > 0 && (
          <>
            <div style={{ background: '#21262D' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5%' }}>
              {right.map((b: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '3%', alignItems: 'flex-start' }}>
                  <div style={{ width: '2.5%', height: '2.5%', borderRadius: '50%', background: accent, flexShrink: 0, marginTop: '0.5%' }} />
                  <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '2%', color: '#8B949E', lineHeight: 1.4 }}>{b.slice(0, 80)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: '0.5%', left: '5%', right: '5%', textAlign: 'center', fontFamily: 'Calibri, sans-serif', fontSize: '1.2%', color: '#6E7681' }}>
        AI in a Box · {section.heading.slice(0, 40).toUpperCase()} · {index} / {totalSections}
      </div>
    </div>
  )
}

function RoadmapSlide({ accent }: any) {
  const phases = [
    { title: 'PHASE 1', sub: 'Quick Wins', range: '0–6 months', color: '#3FB950', items: ['AI tool audit & baseline', 'Pilot 1–2 high-impact cases', 'Data quality foundation', 'Team AI literacy'] },
    { title: 'PHASE 2', sub: 'Core Build', range: '6–12 months', color: '#E6933A', items: ['Scale successful pilots', 'Build AI competency centre', 'Integrate into core processes', 'Measure & report ROI'] },
    { title: 'PHASE 3', sub: 'Scale & Lead', range: '12–18 months', color: '#58A6FF', items: ['Enterprise-wide deployment', 'AI-native products', 'Competitive advantage', 'Continuous improvement'] },
  ]
  return (
    <div style={{ ...S.slide, background: '#07090D' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', left: '5%', top: '6%', fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', letterSpacing: '0.25em', color: accent }}>18-MONTH ROADMAP</div>
      <div style={{ position: 'absolute', left: '5%', top: '13%', fontFamily: 'Georgia, serif', fontSize: '4.5%', color: '#F0F6FC', fontStyle: 'italic' }}>Your AI transformation journey</div>
      {/* Timeline line */}
      <div style={{ position: 'absolute', left: '5%', right: '5%', top: '35%', height: '1px', background: '#21262D' }} />
      {phases.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: `${5 + i * 31}%`, top: '28%', width: '29%' }}>
          {/* Node */}
          <div style={{ width: '6%', height: '11%', borderRadius: '50%', background: p.color, margin: '0 auto 3%', position: 'relative', zIndex: 1 }} />
          {/* Card */}
          <div style={{ background: '#161B22', border: '1px solid #21262D', borderTop: `3px solid ${p.color}`, borderRadius: 6, padding: '5% 6%' }}>
            <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.3%', letterSpacing: '0.2em', color: p.color, marginBottom: '2%' }}>{p.title}</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.5%', color: '#F0F6FC', fontWeight: 700, marginBottom: '1.5%' }}>{p.sub}</div>
            <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.5%', color: p.color, marginBottom: '4%' }}>{p.range}</div>
            {p.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', gap: '4%', marginBottom: '2%', alignItems: 'flex-start' }}>
                <div style={{ width: '4%', height: '4%', borderRadius: '50%', background: p.color, flexShrink: 0, marginTop: '0.5%' }} />
                <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '1.6%', color: '#8B949E' }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ClosingSlide({ accent, company }: any) {
  return (
    <div style={{ ...S.slide, background: '#07090D' }}>
      <div style={S.strip(accent)} />
      <div style={{ position: 'absolute', left: '4%', top: '5%', fontFamily: 'Georgia, serif', fontSize: '25%', color: '#21262D', lineHeight: 1 }}>"</div>
      <div style={{ position: 'absolute', left: '5%', top: '22%', right: '5%', fontFamily: 'Georgia, serif', fontSize: '5.5%', color: '#F0F6FC', fontStyle: 'italic', lineHeight: 1.3 }}>The window to lead is now.</div>
      <div style={{ position: 'absolute', left: '5%', top: '47%', right: '5%', fontFamily: 'Calibri, sans-serif', fontSize: '2.2%', color: '#8B949E', lineHeight: 1.6 }}>
        This AI transformation strategy for {company} was prepared exclusively by AI in a Box, powered by Claude Opus with live web research.
      </div>
      <div style={{ position: 'absolute', left: '5%', right: '5%', top: '64%', background: '#161B22', border: `1px solid ${accent}`, borderRadius: 8, padding: '3% 4%' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.8%', color: accent, fontWeight: 700, marginBottom: '2%' }}>Ready to take the next step?</div>
        <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: '2%', color: '#8B949E' }}>hello@aiinbox.com · aiinbox.com · Book your expert consultation today</div>
      </div>
      <div style={{ position: 'absolute', bottom: '0.5%', left: 0, right: 0, textAlign: 'center', fontFamily: 'Calibri, sans-serif', fontSize: '1.2%', color: '#6E7681' }}>© 2026 AI in a Box · Confidential · Not for redistribution</div>
    </div>
  )
}
