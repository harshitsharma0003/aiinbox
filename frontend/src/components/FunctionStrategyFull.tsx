import SlideViewer from './SlideViewer'
import { useState, useEffect } from 'react'
import { strategyApi } from '../lib/api'

const SUPABASE_URL = 'https://pvagktgspxyizzcdglsm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2YWdrdGdzcHh5aXp6Y2RnbHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzkyNzAsImV4cCI6MjA5NjMxNTI3MH0.jlZcM40xNX5jnedCaKU6M7ou4OCiRZeISPKJC_wbCQ4'
async function sbTrack(table: string, data: Record<string, unknown>) {
  try { await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:'POST', headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`}, body:JSON.stringify(data) }) } catch { }
}

type Q = { id: string; q: string; type?: string; ph?: string; opts?: string[] }
type FnId = 'Finance' | 'People & HR' | 'Operations' | 'Sales & Marketing' | 'IT & Technology' | 'Customer Experience'

const FN_Q: Record<FnId, Q[]> = {
  'Finance': [
    {id:'co',q:'Company name and industry?',type:'text',ph:'e.g. Mahindra Finance, NBFC'},
    {id:'data',q:'How would you describe your financial data infrastructure?',opts:['Manual spreadsheets — no integrated system','Basic ERP (Tally, SAP Basic)','Mid-range ERP with data warehouse','Enterprise ERP with real-time dashboards','Advanced — data lake, real-time intelligence']},
    {id:'close',q:'How long does your month-end close take?',opts:['More than 15 working days','10–15 working days','5–10 working days','3–5 working days','Under 3 working days']},
    {id:'pain',q:'What is your biggest Finance AI opportunity?',opts:['Revenue forecasting is inaccurate','Fraud detection is reactive','Financial close is too slow and manual','Cost overruns — cannot predict or control','Regulatory reporting is too manual']},
    {id:'stack',q:'What financial tools do you use?',opts:['Tally / QuickBooks','SAP S4/HANA or Oracle EBS','Workday / NetSuite / Sage','Microsoft Dynamics 365 Finance','Custom-built ERP']},
    {id:'budget',q:'What is your Finance AI investment appetite?',opts:['Under ₹25 Lakhs','₹25L–₹1 Crore','₹1Cr–₹5 Crore','Above ₹5 Crore']},
  ],
  'People & HR': [
    {id:'co',q:'Company name and industry?',type:'text',ph:'e.g. TCS, Tata Steel'},
    {id:'size',q:'How many employees does your organisation have?',opts:['Under 500','500–2,000','2,000–10,000','10,000–50,000','50,000+']},
    {id:'pain',q:'What is your biggest HR challenge?',opts:['Hiring is too slow and expensive','High attrition — cannot retain talent','L&D is generic, not personalised','Performance management is subjective','HR operations are too manual']},
    {id:'hris',q:'What HR systems do you use?',opts:['Excel and basic HR software','SAP HCM or Oracle HCM','Workday / SuccessFactors / Darwinbox','BambooHR / HROne / Keka','Primarily manual — no integrated HRIS']},
    {id:'culture',q:'How ready is your organisation for AI in HR?',opts:['High resistance — people worry about job loss','Cautious — some openness but anxiety','Neutral — will follow where leadership leads','Open — most people are curious about AI','Enthusiastic — already using AI personally']},
    {id:'priority',q:'Which HR AI use case would create most value?',opts:['AI recruitment — faster, smarter hiring','AI learning paths — personalised reskilling','AI retention — predict who is about to leave','AI culture — hackathons, innovation labs','AI HR operations — automate forms, queries']},
  ],
  'Operations': [
    {id:'co',q:'Company name and sector?',type:'text',ph:'e.g. Tata Steel, automotive manufacturer'},
    {id:'type',q:'What type of operations do you run?',opts:['Discrete manufacturing (machines, parts, assemblies)','Process manufacturing (chemicals, food, pharma)','Service operations (logistics, distribution)','Mixed manufacturing and distribution','Non-manufacturing (construction, hospitality)']},
    {id:'pain',q:'What is your biggest operational pain point?',opts:['Unplanned machine breakdowns — too much downtime','Quality defects and returns are too high','Supply chain visibility is poor','Production scheduling is inefficient','Inventory too high yet we still get stockouts']},
    {id:'iot',q:'Do you have sensor or IoT data from machines?',opts:['No sensors — fully manual monitoring','Some sensors but not used analytically','Sensors feeding basic dashboards','Good sensor data with some analytics','Advanced IoT platform with real-time monitoring']},
    {id:'oee',q:'What is your current OEE approximately?',opts:['Below 50% — significant opportunity','50–65% — below world class','65–75% — approaching world class','75–85% — world class','Above 85% — excellent']},
    {id:'budget',q:'Operations AI investment appetite?',opts:['Quick wins — under ₹50 Lakhs','Medium programme — ₹50L–₹2 Crore','Full transformation — ₹2Cr–₹10 Crore','Major capital programme — above ₹10 Crore']},
  ],
  'Sales & Marketing': [
    {id:'co',q:'Company name and industry?',type:'text',ph:'e.g. Asian Paints, Bajaj Finserv'},
    {id:'model',q:'What is your primary business model?',opts:['B2C — selling directly to consumers','B2B — selling to other businesses','B2B2C — through business partners to consumers','D2C — directly online to consumers','Marketplace or platform model']},
    {id:'crm',q:'What CRM and marketing tools do you use?',opts:['No CRM — spreadsheets and email','Basic CRM (Zoho, HubSpot free)','Salesforce / HubSpot Professional','SAP CX / Oracle CX / MS Dynamics','Custom-built CRM']},
    {id:'pain',q:'What is your biggest Sales & Marketing challenge?',opts:['Lead quality is poor — too many unqualified leads','Conversion rates are low','Customer retention is weak — high churn','Campaign ROI is unclear','Personalisation is not happening']},
    {id:'data',q:'How good is your customer data?',opts:['Very limited — names and emails only','Basic — transaction history only','Moderate — some customer analytics','Good — 360° view with behavioural signals','Excellent — real-time customer intelligence']},
    {id:'goal',q:'What would Sales AI success look like?',opts:['Increase conversion by 20%+','Reduce acquisition cost by 25%+','Improve retention by 30%+','Double personalisation at scale','Improve attribution — know what drives revenue']},
  ],
  'IT & Technology': [
    {id:'co',q:'Company name and industry?',type:'text',ph:'e.g. Infosys BPO, HDB Financial'},
    {id:'arch',q:'How would you describe your tech architecture?',opts:['Legacy on-premise — old systems, heavy debt','Hybrid — mix of on-premise and some cloud','Mostly cloud — AWS/Azure/GCP','Cloud-native — microservices, containers, DevOps','Multi-cloud advanced — edge, real-time streaming']},
    {id:'data',q:'What is the state of your data platform?',opts:['No data platform — data is trapped in apps','Basic data warehouse (Redshift, BigQuery)','Mature warehouse with BI tools','Data lake or lakehouse (Databricks, Delta Lake)','Real-time streaming platform (Kafka, Flink)']},
    {id:'pain',q:'What is your biggest IT challenge?',opts:['Security threats increasing, under-resourced','Technical debt blocking us from moving fast','Cannot attract or retain AI/data talent','Data is siloed — teams cannot access it','AI model development and deployment too slow']},
    {id:'ai',q:'What AI/ML capability does your team have?',opts:['No internal AI capability — zero','1–2 data scientists doing some modelling','Small data science team with production models','Strong data science team with MLOps','Advanced AI engineering, real-time ML in production']},
    {id:'priority',q:'Which IT AI use case would create most value?',opts:['AI security — threat detection, anomaly monitoring','AI code generation — accelerate developer productivity','AI data engineering — automate pipelines','AI infrastructure — predictive scaling, cost optimisation','AI-powered IT service desk automation']},
  ],
  'Customer Experience': [
    {id:'co',q:'Company name and industry?',type:'text',ph:'e.g. Swiggy, Bajaj Allianz, Myntra'},
    {id:'vol',q:'What is your customer service volume?',opts:['Under 1,000 interactions per month','1,000–10,000 per month','10,000–100,000 per month','100,000 to 1 million per month','Above 1 million per month']},
    {id:'ch',q:'What are your primary service channels?',opts:['Phone and email only','Phone, email and chat','Omnichannel — phone, email, chat, social, app','Mostly digital — app and chat-first','In-person or field service']},
    {id:'pain',q:'What is your biggest CX challenge?',opts:['Response time — customers wait too long','Consistency — quality varies between agents','Resolution rate — too many escalations','Cost — service operations cost too much','Personalisation — treating all customers the same']},
    {id:'nps',q:'What is your current NPS approximately?',opts:['Below 0 — more detractors than promoters','0–20 — average','20–40 — good','40–60 — excellent','Above 60 — world class']},
    {id:'goal',q:'What would CX AI success look like?',opts:['Deflect 40%+ of queries to AI','Reduce average handle time by 30%+','Increase CSAT/NPS by 15+ points','Personalise every interaction at scale','Predict issues before customers complain']},
  ],
}

const FN_LIST = [
  {id:'Finance' as FnId,icon:'💰',role:'CFO · FP&A · Treasury'},
  {id:'People & HR' as FnId,icon:'👥',role:'CHRO · Talent · L&D'},
  {id:'Operations' as FnId,icon:'⚙️',role:'COO · Supply Chain · Quality'},
  {id:'Sales & Marketing' as FnId,icon:'📣',role:'CMO · Revenue · CX'},
  {id:'IT & Technology' as FnId,icon:'🏗️',role:'CIO · CTO · Data'},
  {id:'Customer Experience' as FnId,icon:'⭐',role:'Service · Support · NPS'},
]

const FN_COLORS: Record<string, string> = {
  'Finance':'#3FB950','People & HR':'#BC8CFF','Operations':'#E3B341',
  'Sales & Marketing':'#F85149','IT & Technology':'#58A6FF','Customer Experience':'#06B6D4'
}

const PRICE_INR = 418000
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

interface Props {
  sessionId: string
  openPayment: (plan: string, price: string, inr: number, onPaid: () => void) => void
}

export default function FunctionStrategyFull({ sessionId, openPayment }: Props) {
  const [fn, setFn] = useState<FnId | ''>('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [genStep, setGenStep] = useState(0)

  const color = fn ? (FN_COLORS[fn] || '#58A6FF') : '#58A6FF'
  const questions: Q[] = fn ? FN_Q[fn] : []
  const totalSteps = questions.length
  const currentQ = questions[step]

  useEffect(() => {
    if (!loading) return
    setGenStep(0)
    const iv = setInterval(() => setGenStep(s => Math.min(s + 1, 4)), 900)
    return () => clearInterval(iv)
  }, [loading])

  const setAns = (k: string, v: string) => {
    setAnswers(a => ({ ...a, [k]: v }))
    sbTrack('custom_strategy_answers', { question_key: `fn_${fn}_${k}`, answer_value: v, session_id: sessionId })
  }

  const handlePick = (fnId: FnId) => { setFn(fnId); setStep(0); setAnswers({}); setResult(null); setError(null) }

  const handleNext = () => {
    // validate
    if (!answers[currentQ.id] || !answers[currentQ.id].trim()) return
    if (step < totalSteps - 1) { setStep(s => s + 1) }
    else {
      // last question — trigger payment then generate
      openPayment(
        `Function Strategy — ${fn}`,
        fmt(PRICE_INR),
        PRICE_INR,
        () => generate()
      )
    }
  }

  const generate = async () => {
    setLoading(true); setError(null)
    sbTrack('strategy_generations', {
      session_id: sessionId, company_name: answers.co || 'Unknown',
      industry: String(fn), strategy_type: 'function', function_name: String(fn),
      payment_status: 'paid', model_used: 'claude-opus-4-5'
    })
    try {
      const res = await strategyApi.function({
        company_name: answers.co || 'Company',
        function_name: String(fn),
        industry: String(fn),
        answers,
        session_id: sessionId
      })
      setResult(res.strategy)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  // Result view
  if (result && fn) return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <div className="bg-carbon border border-lead rounded-lg p-7">
        <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{color}}>✓ {fn} Strategy · Paid</div>
        <div className="font-serif text-xl font-light mb-1">{answers.co}</div>
        <div className="text-xs text-zinc mb-3">{fn}</div>
        <div className="flex items-center gap-2 text-jade text-xs"><span>✓</span><span>Payment confirmed · Strategy generated</span></div>
      </div>
      <SlideViewer text={result} company={answers.co || 'Company'} industry={String(fn)} type="function"/>
    </div>
  )

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
      {/* Sidebar */}
      <div className="sticky top-20 glass-card p-7">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber/20 bg-amber/10 text-amber font-mono text-[9px] tracking-widest mb-4">🔒 PAID · {fmt(PRICE_INR)}</div>
        <div className="font-serif text-lg font-light mb-2">Function-specific.<br/>Deeply tailored.</div>
        <p className="text-[12px] text-silver leading-relaxed mb-4">6 targeted questions build a strategy specific to how your function operates today — not a generic report.</p>
        {['6 function-specific questions','200+ use cases filtered to your context','Ranked by data readiness + effort + ROI','Vendor shortlist for your current stack','12-month implementation roadmap','Expert review call included'].map(f => (
          <div key={f} className="flex gap-2 items-start text-[12px] text-silver mb-2"><span className="text-jade font-mono mt-px">—</span>{f}</div>
        ))}
        <div className="h-px bg-lead my-4"/>
        {fn && (
          <div>
            <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-2">Progress</div>
            <div className="flex gap-1 flex-wrap mb-2">
              {questions.map((_, i) => (
                <div key={i} className="h-1.5 flex-1 rounded-full transition-all" style={{background: i < step ? color : i === step ? color + '60' : '#21262D'}}/>
              ))}
            </div>
            <div className="font-mono text-[10px] text-zinc">Question {step + 1} of {totalSteps}</div>
          </div>
        )}
      </div>

      {/* Main */}
      <div>
        {/* Function picker */}
        {!fn && (
          <>
            <p className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-4">Select your function to begin</p>
            <div className="grid grid-cols-3 gap-3">
              {FN_LIST.map(f => (
                <button key={f.id} onClick={() => handlePick(f.id)}
                  className="p-5 rounded-xl border border-lead bg-onyx hover:border-graph hover:bg-carbon text-left transition-all group">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <div className="text-[13px] font-medium text-paper mb-1">{f.id}</div>
                  <div className="font-mono text-[9px] tracking-wider text-zinc">{f.role}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Questions */}
        {fn && !loading && (
          <div className="animate-[fadeIn_.3s_ease]">
            {/* Step dots */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {questions.map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] transition-all"
                    style={{
                      background: i < step ? color : i === step ? color : '#0D1117',
                      border: `1px solid ${i <= step ? color : '#21262D'}`,
                      color: i <= step ? '#07090D' : '#6E7681'
                    }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < questions.length - 1 && <div className="h-px w-6 transition-all" style={{background: i < step ? color : '#21262D'}}/>}
                </div>
              ))}
              <button onClick={() => { setFn(''); setStep(0); setAnswers({}) }} className="ml-auto font-mono text-[10px] text-zinc hover:text-rose transition-colors">← Change function</button>
            </div>

            <div className="bg-carbon border border-lead rounded-xl p-7">
              <div className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{color}}>{String(fn)} · Question {step + 1}</div>
              <div className="font-serif text-[20px] font-light text-paper mb-5">{currentQ.q}</div>

              {currentQ.type === 'text' ? (
                <input
                  value={answers[currentQ.id] || ''}
                  onChange={e => setAns(currentQ.id, e.target.value)}
                  placeholder={currentQ.ph}
                  className="ai-input mb-4"
                />
              ) : (
                <div className="flex flex-col gap-2 mb-4">
                  {currentQ.opts?.map((opt, i) => (
                    <button key={opt} onClick={() => setAns(currentQ.id, opt)}
                      className="w-full text-left px-4 py-3 rounded-lg border text-[13px] transition-all flex items-start gap-3"
                      style={{
                        borderColor: answers[currentQ.id] === opt ? color : '#21262D',
                        background: answers[currentQ.id] === opt ? color + '10' : '#0D1117',
                        color: answers[currentQ.id] === opt ? '#F0F6FC' : '#8B949E'
                      }}>
                      <span className="w-6 h-6 rounded flex items-center justify-center font-mono text-[9px] flex-shrink-0 mt-px transition-all"
                        style={{
                          background: answers[currentQ.id] === opt ? color : color + '20',
                          color: answers[currentQ.id] === opt ? '#07090D' : color
                        }}>
                        {'ABCDE'[i]}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {error && <p className="text-rose text-xs mb-3">{error}</p>}

              <div className="flex justify-between mt-2">
                <button onClick={() => step > 0 ? setStep(s => s - 1) : setFn('')}
                  className="px-4 py-2 border border-lead rounded text-[12px] text-zinc hover:text-paper transition-all">
                  ← {step === 0 ? 'Change function' : 'Back'}
                </button>
                <button onClick={handleNext}
                  disabled={!answers[currentQ.id] || !answers[currentQ.id].trim()}
                  className="px-6 py-2.5 text-ink text-[13px] font-semibold rounded-lg hover:-translate-y-px transition-all disabled:opacity-40"
                  style={{background: color}}>
                  {step < totalSteps - 1 ? 'Next →' : `Pay ${fmt(PRICE_INR)} & Generate →`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="border border-lead rounded-xl p-7 animate-[fadeIn_.3s_ease]">
            <div className="flex items-center justify-between mb-6">
              <div className="font-mono text-[9px] tracking-widest uppercase" style={{color}}>Generating {fn} strategy…</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{borderColor:color+'30',borderTopColor:color}}/>
                <span className="font-mono text-[11px] text-zinc">Claude Opus working…</span>
              </div>
            </div>
            {['Searching competitor AI landscape for your sector…','Analysing your specific answers…','Building tailored use cases for your function…','Claude Opus generating your pointed strategy…','Compiling personalised report…'].map((s,i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded text-xs mb-1.5 transition-all border"
                style={{
                  borderColor: i < genStep ? 'transparent' : i === genStep ? color + '30' : 'transparent',
                  background: i === genStep ? color + '08' : 'transparent',
                  color: i < genStep ? '#3FB950' : i === genStep ? '#F0F6FC' : '#6E7681'
                }}>
                <span className="w-4 text-center font-mono">{i < genStep ? '✓' : i === genStep ? '→' : '·'}</span>{s}
              </div>
            ))}
            <div className="h-px bg-lead mt-4 overflow-hidden rounded">
              <div className="h-full transition-all duration-500 rounded" style={{width:`${(genStep / 5) * 88}%`,background:`linear-gradient(90deg,${color},${color}99)`}}/>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
