export interface TokenData {
  name: string
  symbol: string
  address: string
  totalSupply: string
  holders: string
}

export interface Scores {
  safety: number
  narrative: number
  degen: number
  holder: number
  overall: number
}

export type FlagType = 'success' | 'warning' | 'danger'

export interface Flag {
  type: FlagType
  message: string
}

export type Badge =
  | 'ALPHA DETECTED'
  | 'BULLISH DEGEN'
  | 'MODERATE RISK'
  | 'HIGH RISK'
  | 'LIKELY RUG'

export interface AnalysisResult {
  token: TokenData
  scores: Scores
  badge: Badge
  flags: Flag[]
  verdict: string
  scanTimestamp: string
}

export interface ApiResponse {
  success: boolean
  data?: AnalysisResult
  error?: string
  code?: string
}

export interface GoPlusLPHolder {
  address: string
  is_locked: number
  tag: string
  percent: string
}

export interface GoPlusData {
  is_honeypot: '0' | '1'
  can_sell: '0' | '1'
  is_open_source: '0' | '1'
  lp_holders?: GoPlusLPHolder[]
  owner_address: string
  buy_tax: string
  sell_tax: string
  holder_count: string
  top_10_holder_ratio: string
  token_name: string
  token_symbol: string
  total_supply: string
}

export interface BscScanTokenInfo {
  contractAddress: string
  tokenName: string
  symbol: string
  divisor: string
  tokenType: string
  totalSupply: string
  blueCheckmark: string
  description: string
  website: string
  email: string
  blog: string
  reddit: string
  slack: string
  facebook: string
  twitter: string
  bitcointalk: string
  github: string
  telegram: string
  wechat: string
  linkedin: string
  discord: string
  whitepaper: string
  tokenPriceUSD: string
}

export interface LLMResult {
  narrativeScore: number
  degenScore: number
  verdict: string
  badge: Badge
}

export interface PortfolioToken {
  address: string
  name: string
  symbol: string
}
