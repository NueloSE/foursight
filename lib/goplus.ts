import type { GoPlusData } from '@/types'

const GOPLUS_BASE = 'https://api.gopluslabs.io/api/v1'
const BSC_CHAIN_ID = '56'

export async function fetchGoPlus(address: string): Promise<GoPlusData> {
  const url = `${GOPLUS_BASE}/token_security/${BSC_CHAIN_ID}?contract_addresses=${address.toLowerCase()}`

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(8_000),
  })

  if (!res.ok) {
    throw new Error(`GoPlus API error: ${res.status}`)
  }

  const json = await res.json()

  if (json.code !== 1) {
    throw new Error(`GoPlus returned error code: ${json.code} — ${json.message}`)
  }

  const data = json.result?.[address.toLowerCase()]

  if (!data || Object.keys(data).length === 0) {
    throw new Error('WALLET_ADDRESS')
  }

  return data as GoPlusData
}

export function buildFlags(goplus: GoPlusData) {
  const flags = []

  if (goplus.is_honeypot === '1') {
    flags.push({ type: 'danger' as const, message: 'Honeypot detected — you cannot sell this token' })
  } else {
    flags.push({ type: 'success' as const, message: 'No honeypot detected' })
  }

  if (goplus.can_sell === '0') {
    flags.push({ type: 'danger' as const, message: 'Sell restrictions exist on this contract' })
  } else {
    flags.push({ type: 'success' as const, message: 'No sell restrictions found' })
  }

  if (goplus.is_open_source === '0') {
    flags.push({ type: 'warning' as const, message: 'Contract source code is not verified' })
  } else {
    flags.push({ type: 'success' as const, message: 'Contract is open source and verified' })
  }

  const lpLocked = goplus.lp_holders?.some(h => h.is_locked === 1)
  if (!lpLocked) {
    flags.push({ type: 'warning' as const, message: 'Liquidity is not locked' })
  } else {
    flags.push({ type: 'success' as const, message: 'Liquidity is locked' })
  }

  if (goplus.owner_address && goplus.owner_address !== '') {
    flags.push({ type: 'warning' as const, message: 'Owner address has not been renounced' })
  } else {
    flags.push({ type: 'success' as const, message: 'Owner address renounced' })
  }

  const sellTax = parseFloat(goplus.sell_tax || '0') * 100
  if (sellTax > 10) {
    flags.push({ type: 'danger' as const, message: `High sell tax: ${sellTax.toFixed(1)}%` })
  } else if (sellTax > 5) {
    flags.push({ type: 'warning' as const, message: `Elevated sell tax: ${sellTax.toFixed(1)}%` })
  } else {
    flags.push({ type: 'success' as const, message: `Sell tax is low: ${sellTax.toFixed(1)}%` })
  }

  const top10 = parseFloat(goplus.top_10_holder_ratio || '0') * 100
  if (top10 > 70) {
    flags.push({ type: 'danger' as const, message: `Top 10 wallets hold ${top10.toFixed(1)}% of supply` })
  } else if (top10 > 50) {
    flags.push({ type: 'warning' as const, message: `Top 10 wallets hold ${top10.toFixed(1)}% of supply` })
  } else {
    flags.push({ type: 'success' as const, message: `Healthy distribution — top 10 hold ${top10.toFixed(1)}%` })
  }

  return flags
}
