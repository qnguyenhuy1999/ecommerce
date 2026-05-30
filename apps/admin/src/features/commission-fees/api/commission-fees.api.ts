import { api } from '@/lib/api'

export interface CommissionRuleApiItem {
  id: string
  scope: 'GLOBAL' | 'CATEGORY' | 'VENDOR'
  label: string
  targetId?: string | null
  commissionPct: number
  paymentFeePct: number
  effectiveFrom: string
  createdAt: string
  updatedAt: string
}

export interface CommissionRulesListResponse {
  data: CommissionRuleApiItem[]
}

export interface CreateCommissionRuleResponse {
  data: CommissionRuleApiItem
}

export interface UpdateCommissionRuleResponse {
  data: CommissionRuleApiItem
}

export interface CreateCommissionRulePayload {
  scope: string
  label: string
  targetId?: string
  commissionPct: number
  paymentFeePct: number
  effectiveFrom: string
}

export interface UpdateCommissionRulePayload {
  label?: string
  commissionPct?: number
  paymentFeePct?: number
  effectiveFrom?: string
}

export async function getCommissionRules() {
  return api<CommissionRulesListResponse>('/admin/commission-fees')
}

export async function createCommissionRule(payload: CreateCommissionRulePayload) {
  return api<CreateCommissionRuleResponse>('/admin/commission-fees', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateCommissionRule(id: string, payload: UpdateCommissionRulePayload) {
  return api<UpdateCommissionRuleResponse>(`/admin/commission-fees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
