import { useState, useEffect, useCallback } from 'react'
import { dashboardApi, type Lead, type Strategy, type Order, type AriaChat } from '../lib/api'

type Tab = 'overview' | 'leads' | 'strategies' | 'orders' | 'chats'

export default function AdminDashboard() {
  const [secret, setSecret] = useState(() => localStorage.getItem('admin_secret') || '')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [overview, setOverview] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [chats, setChats] = useState<AriaChat[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [leadFilter, setLeadFilter] = useState('')
  const [stratFilter, setStratFilter] = useState('')
  const [orderFilter, setOrderFilter] = useState('')

  const load = useCallback(async (t: Tab) => {
    setLoading(true); setError('')
    try {
      if (t === 'overview') {
        const d = await dashboardApi.overview(secret)
        setOverview(d)
      } else if (t === 'leads') {
        const d = await dashboardApi.leads(secret, 1, leadFilter || undefined)
        setLeads(d.data); setCounts(c => ({ ...c, leads: d.count }))
      } else if (t === 'strategies') {
        const d = await dashboardApi.strategies(secret, 1, stratFilter || undefined)
        setStrategies(d.data); setCounts(c => ({ ...c, strategies: d.count }))
      } else if (t === 'orders') {
        const d = await dashboardApi.orders(secret, 1, orderFilter || undefined)
        setOrders(d.data); setCounts(c => ({ ...c, orders: d.count }))
      } else if (t === 'chats') {
        const d = await dashboardApi.chats(secret)
        setChats(d.data); setCounts(c => ({ ...c, chats: d.count }))
      }
    } catch (e: any) {
      setError(e.message)
      if (e.message.includes('Unauthorized')) setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [secret, leadFilter, stratFilter, orderFilter])

  const auth = async () => {
    try {
      await dashboardApi.overview(secret)
      setAuthed(true)
      localStorage.setItem('admin_secret', secret)
      load('overview')
    } catch {
      setError('Invalid secret')
    }
  }

  useEffect(() => {
    if (authed) load(tab)
  }, [tab, authed, leadFilter, stratFilter, orderFilter])

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await dashboardApi.updateLead(secret, id, status)
      setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
    } catch (e: any) {
      alert('Failed to update: ' + e.message)
    }
  }

  if (!authed) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="w-full max-w-sm bg-carbon border border-lead rounded-xl p-8">
        <div className="font-serif text-3xl font-light text-paper mb-1">AI <span className="text-amber italic">in</span> Box</div>
        <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-8">Admin Dashboard</div>
        <label className="font-mono text-[9px] tracking-widest text-zinc uppercase block mb-2">Admin Secret</label>
        <input type="password" value={secret} onChange={e => setSecret(e.target.value)} onKeyDown={e => e.key === 'Enter' && auth()}
          placeholder="Your ADMIN_SECRET" className="w-full px-4 py-3 bg-onyx border border-lead rounded text-paper text-sm outline-none focus:border-amber mb-4 transition-all" />
        {error && <p className="text-rose text-xs mb-3">{error}</p>}
        <button onClick={auth} className="w-full py-3 bg-paper text-ink rounded font-medium text-sm hover:-translate-y-px transition-all">Sign in →</button>
      </div>
    </div>
  )

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'leads', label: 'Leads', icon: '👤' },
    { key: 'strategies', label: 'Strategies', icon: '🎯' },
    { key: 'orders', label: 'Orders', icon: '💰' },
    { key: 'chats', label: 'ARIA Chats', icon: '💬' },
  ]

  return (
    <div className="min-h-screen bg-ink text-paper flex">
      {/* Sidebar */}
      <div className="w-60 bg-onyx border-r border-lead flex flex-col">
        <div className="p-6 border-b border-lead">
          <div className="font-serif text-xl font-light">AI <span className="text-amber italic">in</span> Box</div>
          <div className="font-mono text-[9px] tracking-widest text-zinc mt-1">ADMIN DASHBOARD</div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] text-left transition-all ${tab === t.key ? 'bg-carbon text-paper border border-lead' : 'text-zinc hover:text-paper hover:bg-carbon/50'}`}>
              <span>{t.icon}</span>{t.label}
              {counts[t.key] != null && <span className="ml-auto font-mono text-[10px] text-zinc">{counts[t.key]}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-lead">
          <button onClick={() => { setAuthed(false); localStorage.removeItem('admin_secret') }} className="w-full py-2 text-xs text-zinc hover:text-rose transition-colors">Sign out</button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="border-b border-lead px-8 py-4 flex items-center justify-between bg-onyx/50">
          <h1 className="text-lg font-medium">{tabs.find(t => t.key === tab)?.label}</h1>
          <div className="flex items-center gap-3">
            {loading && <span className="font-mono text-[10px] text-zinc animate-pulse">Loading…</span>}
            <button onClick={() => load(tab)} className="px-3 py-1.5 border border-lead rounded text-xs text-zinc hover:text-paper transition-all">↻ Refresh</button>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-rose/10 border border-rose/30 rounded text-rose text-sm">{error}</div>}

          {/* OVERVIEW */}
          {tab === 'overview' && overview && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  ['Total Leads', overview.overview.total_leads, '#58A6FF', '👤'],
                  ['Strategies Generated', overview.overview.total_strategies, '#E6933A', '🎯'],
                  ['Paid Orders', overview.overview.paid_orders, '#3FB950', '💰'],
                  ['Revenue (INR)', `₹${(overview.overview.total_revenue_inr || 0).toLocaleString('en-IN')}`, '#BC8CFF', '📈'],
                ].map(([l, v, c, icon]) => (
                  <div key={String(l)} className="bg-carbon border border-lead rounded-xl p-6">
                    <div className="text-xl mb-3">{icon}</div>
                    <div className="font-serif text-3xl font-light mb-1" style={{ color: String(c) }}>{v}</div>
                    <div className="font-mono text-[9px] tracking-widest text-zinc uppercase">{l}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  ['ARIA Chats', overview.overview.aria_chats, '#E3B341'],
                  ['New Leads (7d)', overview.last_7_days.new_leads, '#58A6FF'],
                  ['New Strategies (7d)', overview.last_7_days.new_strategies, '#E6933A'],
                ].map(([l, v, c]) => (
                  <div key={String(l)} className="bg-carbon border border-lead rounded-xl p-6">
                    <div className="font-serif text-3xl font-light mb-1" style={{ color: String(c) }}>{v}</div>
                    <div className="font-mono text-[9px] tracking-widest text-zinc uppercase">{l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-carbon border border-lead rounded-xl p-6">
                <div className="font-mono text-[9px] tracking-widest text-zinc uppercase mb-4">Strategies by Type</div>
                <div className="flex gap-4">
                  {Object.entries(overview.strategies_by_type || {}).map(([type, count]) => (
                    <div key={type} className="flex-1 text-center p-4 bg-onyx rounded-lg border border-lead">
                      <div className="font-serif text-2xl font-light text-amber mb-1">{count as number}</div>
                      <div className="font-mono text-[9px] tracking-widest text-zinc capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEADS */}
          {tab === 'leads' && (
            <div>
              <div className="flex gap-3 mb-6">
                {['', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(s => (
                  <button key={s} onClick={() => setLeadFilter(s)} className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all ${leadFilter === s ? 'bg-amber text-ink' : 'border border-lead text-zinc hover:text-paper'}`}>{s || 'All'}</button>
                ))}
              </div>
              <div className="bg-carbon border border-lead rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-lead">
                    {['Name', 'Company', 'Email', 'Interest', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] tracking-widest text-zinc uppercase">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className="border-b border-lead hover:bg-onyx/50 transition-colors">
                        <td className="px-4 py-3 text-[13px] text-paper">{l.name}</td>
                        <td className="px-4 py-3 text-[13px] text-silver">{l.company}</td>
                        <td className="px-4 py-3 text-[12px] text-zinc font-mono">{l.email}</td>
                        <td className="px-4 py-3 text-[12px] text-zinc max-w-[160px] truncate">{l.interest}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] tracking-wider ${
                            l.status === 'converted' ? 'bg-jade/15 text-jade' :
                            l.status === 'qualified' ? 'bg-cyan/15 text-cyan' :
                            l.status === 'contacted' ? 'bg-amber/15 text-amber' :
                            l.status === 'lost' ? 'bg-rose/15 text-rose' : 'bg-lead text-zinc'
                          }`}>{l.status}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-zinc">{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <select value={l.status} onChange={e => updateLeadStatus(l.id, e.target.value)} className="bg-onyx border border-lead rounded px-2 py-1 text-[11px] text-zinc outline-none focus:border-amber">
                            {['new','contacted','qualified','converted','lost'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && !loading && <tr><td colSpan={7} className="px-4 py-12 text-center text-zinc text-sm">No leads yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STRATEGIES */}
          {tab === 'strategies' && (
            <div>
              <div className="flex gap-3 mb-6">
                {['', 'instant', 'custom', 'function'].map(s => (
                  <button key={s} onClick={() => setStratFilter(s)} className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all ${stratFilter === s ? 'bg-amber text-ink' : 'border border-lead text-zinc hover:text-paper'}`}>{s || 'All'}</button>
                ))}
              </div>
              <div className="bg-carbon border border-lead rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-lead">
                    {['Company', 'Industry', 'Type', 'Model', 'Tokens', 'Time', 'PDF', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] tracking-widest text-zinc uppercase">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {strategies.map(s => (
                      <tr key={s.id} className="border-b border-lead hover:bg-onyx/50 transition-colors">
                        <td className="px-4 py-3 text-[13px] text-paper font-medium">{s.company_name}</td>
                        <td className="px-4 py-3 text-[12px] text-silver">{s.industry}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] tracking-wider ${s.strategy_type === 'instant' ? 'bg-amber/15 text-amber' : s.strategy_type === 'custom' ? 'bg-violet/15 text-violet' : 'bg-cyan/15 text-cyan'}`}>{s.strategy_type}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-zinc">{s.model_used?.replace('claude-', '')}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc">{s.tokens_used?.toLocaleString() || '—'}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc">{s.generation_time_ms ? `${(s.generation_time_ms / 1000).toFixed(1)}s` : '—'}</td>
                        <td className="px-4 py-3 text-center">{s.downloaded_pdf ? <span className="text-jade">✓</span> : <span className="text-zinc">—</span>}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-zinc">{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {strategies.length === 0 && !loading && <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc text-sm">No strategies generated yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div>
              <div className="flex gap-3 mb-6">
                {['', 'pending', 'paid', 'failed', 'refunded'].map(s => (
                  <button key={s} onClick={() => setOrderFilter(s)} className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all ${orderFilter === s ? 'bg-amber text-ink' : 'border border-lead text-zinc hover:text-paper'}`}>{s || 'All'}</button>
                ))}
              </div>
              <div className="bg-carbon border border-lead rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-lead">
                    {['Plan', 'Customer', 'Email', 'Amount', 'Cycle', 'Razorpay ID', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[9px] tracking-widest text-zinc uppercase">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-lead hover:bg-onyx/50 transition-colors">
                        <td className="px-4 py-3 text-[13px] text-paper font-medium">{o.plan_name}</td>
                        <td className="px-4 py-3 text-[12px] text-silver">{o.customer_name || '—'}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc">{o.customer_email}</td>
                        <td className="px-4 py-3 font-mono text-[12px]">
                          {o.amount_inr ? <span className="text-jade">₹{Number(o.amount_inr).toLocaleString('en-IN')}</span> : <span className="text-zinc">—</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc capitalize">{o.billing_cycle}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-zinc truncate max-w-[120px]">{o.razorpay_payment_id || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] tracking-wider ${o.payment_status === 'paid' ? 'bg-jade/15 text-jade' : o.payment_status === 'failed' ? 'bg-rose/15 text-rose' : o.payment_status === 'refunded' ? 'bg-violet/15 text-violet' : 'bg-lead text-zinc'}`}>{o.payment_status}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-zinc">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && !loading && <tr><td colSpan={8} className="px-4 py-12 text-center text-zinc text-sm">No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ARIA CHATS */}
          {tab === 'chats' && (
            <div className="flex flex-col gap-3">
              {chats.map(c => (
                <div key={c.id} className="bg-carbon border border-lead rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] tracking-widest text-zinc">{c.session_id?.slice(0, 16) || 'anon'}</span>
                      {c.is_claude_powered && <span className="px-1.5 py-0.5 rounded bg-violet/15 text-violet font-mono text-[8px]">Claude Opus</span>}
                    </div>
                    <span className="font-mono text-[10px] text-zinc">{new Date(c.created_at).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-amber/10 rounded-lg px-4 py-2.5 text-[13px] text-paper self-end max-w-[80%]">{c.user_message}</div>
                    {c.aria_response && <div className="bg-onyx rounded-lg px-4 py-2.5 text-[13px] text-silver self-start max-w-[80%]">{c.aria_response}</div>}
                  </div>
                </div>
              ))}
              {chats.length === 0 && !loading && <div className="text-center py-16 text-zinc">No ARIA chats yet</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
