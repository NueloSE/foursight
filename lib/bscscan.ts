import type { BscScanTokenInfo, PortfolioToken } from '@/types'

const BSCSCAN_BASE = 'https://api.bscscan.com/api'

function getApiKey(): string {
  const key = process.env.BSCSCAN_API_KEY
  if (!key) throw new Error('BSCSCAN_API_KEY is not set')
  return key
}

export async function fetchBscScan(contractAddress: string): Promise<BscScanTokenInfo | null> {
  const apiKey = getApiKey()
  const url = `${BSCSCAN_BASE}?module=token&action=tokeninfo&contractaddress=${contractAddress}&apikey=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 0 } })

  if (!res.ok) return null

  const json = await res.json()

  if (json.status !== '1' || !json.result?.[0]) return null

  return json.result[0] as BscScanTokenInfo
}

export async function fetchWalletTokens(walletAddress: string): Promise<PortfolioToken[]> {
  const apiKey = getApiKey()
  const url = `${BSCSCAN_BASE}?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 0 } })

  if (!res.ok) return []

  const json = await res.json()

  if (json.status !== '1' || !Array.isArray(json.result)) return []

  // Deduplicate by contract address, keep only unique tokens
  const seen = new Set<string>()
  const tokens: PortfolioToken[] = []

  for (const tx of json.result) {
    const addr = tx.contractAddress?.toLowerCase()
    if (addr && !seen.has(addr)) {
      seen.add(addr)
      tokens.push({
        address: tx.contractAddress,
        name: tx.tokenName,
        symbol: tx.tokenSymbol,
      })
    }
  }

  // Limit to 10 tokens to avoid rate limits and long load times
  return tokens.slice(0, 10)
}
