import type { GoPlusData, Badge } from '@/types'

export function calculateSafetyScore(goplus: GoPlusData): number {
  let score = 100

  if (goplus.is_honeypot === '1') score -= 50
  if (goplus.can_sell === '0') score -= 30

  const lpLocked = goplus.lp_holders?.some(h => h.is_locked === 1)
  if (!lpLocked) score -= 15

  if (goplus.owner_address && goplus.owner_address !== '') score -= 10

  const sellTax = parseFloat(goplus.sell_tax || '0') * 100
  if (sellTax > 10) score -= 10
  else if (sellTax > 5) score -= 5

  const top10 = parseFloat(goplus.top_10_holder_ratio || '0') * 100
  if (top10 > 70) score -= 15
  else if (top10 > 50) score -= 8

  return Math.max(0, score)
}

export function calculateHolderScore(holderCount: number, top10Ratio: number): number {
  let score = 0

  if (holderCount < 100) score = 20
  else if (holderCount < 500) score = 50
  else if (holderCount < 2000) score = 75
  else score = 100

  if (top10Ratio > 0.6) score = Math.max(0, score - 15)

  return score
}

export function calculateOverallScore(
  safetyScore: number,
  holderScore: number,
  narrativeScore: number,
  degenScore: number
): number {
  return Math.round(
    safetyScore * 0.35 +
    holderScore * 0.20 +
    narrativeScore * 0.25 +
    degenScore * 0.20
  )
}

export function scoreToBadge(overallScore: number): Badge {
  if (overallScore >= 85) return 'ALPHA DETECTED'
  if (overallScore >= 70) return 'BULLISH DEGEN'
  if (overallScore >= 55) return 'MODERATE RISK'
  if (overallScore >= 40) return 'HIGH RISK'
  return 'LIKELY RUG'
}
