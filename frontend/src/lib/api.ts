/// <reference types="vite/client" />

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
  return data as T
}

// ── Strategy API ───────────────────────────────────────────
export const strategyApi = {
  instant: (payload: { company_name: string; industry: string; company_size?: string; session_id?: string }) =>
    apiFetch<{ success: boolean; strategy: string; id: string; tokens: number; ms: number }>('/strategy/instant', {
      method: 'POST', body: JSON.stringify(payload)
    }),

  custom: (payload: { answers: Record<string, string>; session_id?: string }) =>
    apiFetch<{ success: boolean; strategy: string; id: string; tokens: number; ms: number }>('/strategy/custom', {
      method: 'POST', body: JSON.stringify(payload)
    }),

  function: (payload: { company_name: string; industry?: string; function_name: string; answers?: Record<string, string>; session_id?: string }) =>
    apiFetch<{ success: boolean; strategy: string; tokens: number; ms: number }>('/strategy/function', {
      method: 'POST', body: JSON.stringify(payload)
    }),
}

// ── Contact API ────────────────────────────────────────────
export const contactApi = {
  submit: (payload: { name: string; email: string; company: string; phone?: string; interest?: string; message?: string }) =>
    apiFetch<{ success: boolean; id: string }>('/contact', {
      method: 'POST', body: JSON.stringify(payload)
    }),
}

// ── Payment API ────────────────────────────────────────────
export const paymentApi = {
  createOrder: (payload: { plan_name: string; amount_inr: number; billing_cycle?: string; customer_name?: string; customer_email: string; customer_company?: string }) =>
    apiFetch<{ success: boolean; order_id: string; razorpay_order_id: string; amount_inr: number; key_id: string }>('/payments/create-order', {
      method: 'POST', body: JSON.stringify(payload)
    }),

  verify: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; order_id: string }) =>
    apiFetch<{ success: boolean; verified: boolean }>('/payments/verify', {
      method: 'POST', body: JSON.stringify(payload)
    }),
}

// ── ARIA API ───────────────────────────────────────────────
export const ariaApi = {
  chat: (message: string, session_id?: string) =>
    apiFetch<{ success: boolean; reply: string }>('/aria/chat', {
      method: 'POST', body: JSON.stringify({ message, session_id })
    }),
}

// ── Dashboard API (admin) ──────────────────────────────────
export const dashboardApi = {
  overview: (secret: string) =>
    apiFetch<{ overview: Record<string, number>; strategies_by_type: Record<string, number>; last_7_days: Record<string, number> }>('/dashboard/overview', {
      headers: { 'x-admin-secret': secret }
    }),

  leads: (secret: string, page = 1, status?: string) =>
    apiFetch<{ data: Lead[]; count: number }>(`/dashboard/leads?page=${page}${status ? `&status=${status}` : ''}`, {
      headers: { 'x-admin-secret': secret }
    }),

  updateLead: (secret: string, id: string, status: string) =>
    apiFetch<{ success: boolean; data: Lead }>(`/dashboard/leads/${id}`, {
      method: 'PATCH',
      headers: { 'x-admin-secret': secret },
      body: JSON.stringify({ status })
    }),

  strategies: (secret: string, page = 1, type?: string) =>
    apiFetch<{ data: Strategy[]; count: number }>(`/dashboard/strategies?page=${page}${type ? `&type=${type}` : ''}`, {
      headers: { 'x-admin-secret': secret }
    }),

  orders: (secret: string, page = 1, status?: string) =>
    apiFetch<{ data: Order[]; count: number }>(`/dashboard/orders?page=${page}${status ? `&status=${status}` : ''}`, {
      headers: { 'x-admin-secret': secret }
    }),

  chats: (secret: string, page = 1) =>
    apiFetch<{ data: AriaChat[]; count: number }>(`/dashboard/chats?page=${page}`, {
      headers: { 'x-admin-secret': secret }
    }),
}

// ── Types ──────────────────────────────────────────────────
export interface Lead {
  id: string; name: string; email: string; company: string
  phone?: string; interest?: string; message?: string
  status: string; source: string; created_at: string; updated_at: string
}
export interface Strategy {
  id: string; company_name: string; industry: string
  strategy_type: 'instant' | 'custom' | 'function'
  function_name?: string; model_used: string
  tokens_used?: number; generation_time_ms?: number
  downloaded_pdf: boolean; created_at: string
}
export interface Order {
  id: string; plan_name: string; plan_amount_usd?: number
  billing_cycle: string; customer_name?: string
  customer_email: string; customer_company?: string
  razorpay_payment_id?: string; payment_status: string
  currency: string; amount_inr?: number
  created_at: string; updated_at: string
}
export interface AriaChat {
  id: string; session_id?: string
  user_message: string; aria_response?: string
  is_claude_powered: boolean; created_at: string
}
