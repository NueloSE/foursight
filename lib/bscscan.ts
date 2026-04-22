import type { BscScanTokenInfo, PortfolioToken } from '@/types'

// ── Token info (BscScan — still works for contract lookups) ──────────────────

const BSCSCAN_BASE = 'https://api.bscscan.com/api'

function getBscScanKey(): string {
  const key = process.env.BSCSCAN_API_KEY
  if (!key) throw new Error('BSCSCAN_API_KEY is not set')
  return key
}

export async function fetchBscScan(contractAddress: string): Promise<BscScanTokenInfo | null> {
  const apiKey = getBscScanKey()
  const url = `${BSCSCAN_BASE}?module=token&action=tokeninfo&contractaddress=${contractAddress}&apikey=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 0 }, signal: AbortSignal.timeout(8_000) })

  if (!res.ok) return null

  const json = await res.json()

  if (json.status !== '1' || !json.result?.[0]) return null

  return json.result[0] as BscScanTokenInfo
}

// ── Wallet token history (Moralis — replaces deprecated BscScan V1 tokentx) ──

const MORALIS_BASE = 'https://deep-index.moralis.io/api/v2.2'

function getMoralisKey(): string {
  const key = process.env.MORALIS_API_KEY
  if (!key) throw new Error('MORALIS_API_KEY is not set')
  return key
}

export async function fetchWalletTokens(walletAddress: string): Promise<PortfolioToken[]> {
  const apiKey = getMoralisKey()

  // Fetch the wallet's current ERC-20 token balances on BSC
  const url = `${MORALIS_BASE}/${walletAddress}/erc20?chain=bsc&limit=20`

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    console.warn('[Moralis] Fetch failed:', err)
    return []
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.warn(`[Moralis] HTTP ${res.status} for wallet ${walletAddress}:`, body.slice(0, 200))
    return []
  }

  const json = await res.json()

  // Moralis returns { result: [...] } for balances
  const items: Array<{
    token_address: string
    name: string
    symbol: string
    balance: string
  }> = json.result ?? json ?? []

  if (!Array.isArray(items) || items.length === 0) {
    console.warn('[Moralis] Empty token list for wallet:', walletAddress)
    return []
  }

  // Filter out zero-balance tokens and map to PortfolioToken
  const tokens: PortfolioToken[] = items
    .filter(t => t.token_address && parseInt(t.balance || '0') > 0)
    .map(t => ({
      address: t.token_address,
      name: t.name || 'Unknown Token',
      symbol: t.symbol || '???',
    }))

  // Limit to 10 to keep scan time reasonable
  return tokens.slice(0, 10)
}
