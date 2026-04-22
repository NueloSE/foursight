import { fetchGoPlus, buildFlags } from '@/lib/goplus'
import { fetchBscScan, fetchWalletTokens } from '@/lib/bscscan'
import { callLLM } from '@/lib/llm'
import { calculateSafetyScore, calculateHolderScore, calculateOverallScore } from '@/lib/scoring'

const BSC_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

// Cap LLM calls per wallet scan to control costs.
// Tokens beyond this limit still appear but use the static fallback score.
const MAX_WALLET_LLM_CALLS = 10

export async function POST(request: Request) {
  let body: { address?: string; mode?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }

  const { address, mode = 'token' } = body

  if (!address || !BSC_ADDRESS_RE.test(address)) {
    return Response.json(
      { success: false, error: 'Invalid BSC address format', code: 'INVALID_ADDRESS' },
      { status: 400 }
    )
  }

  // Portfolio / wallet mode
  if (mode === 'wallet') {
    return handleWalletMode(address)
  }

  // Token mode — auto-detect wallet if GoPlus returns no contract data
  try {
    return await handleTokenMode(address)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    if (message === 'WALLET_ADDRESS') {
      return handleWalletMode(address)
    }

    console.error('Token analysis error:', message)
    return Response.json(
      { success: false, error: 'Failed to analyse token. Please check the address and try again.', code: 'ANALYSIS_ERROR' },
      { status: 500 }
    )
  }
}

async function handleTokenMode(address: string) {
  // Fire GoPlus and BscScan in parallel
  const [goplusData, bscscanData] = await Promise.all([
    fetchGoPlus(address),
    fetchBscScan(address),
  ])

  // Prefer BscScan name/symbol if available (more reliable for display)
  const tokenName = bscscanData?.tokenName || goplusData.token_name || 'Unknown Token'
  const tokenSymbol = bscscanData?.symbol || goplusData.token_symbol || '???'
  const totalSupply = bscscanData?.totalSupply || goplusData.total_supply || '0'

  const safetyScore = calculateSafetyScore(goplusData)
  const holderScore = calculateHolderScore(
    parseInt(goplusData.holder_count || '0'),
    parseFloat(goplusData.top_10_holder_ratio || '0')
  )

  // Call LLM after scoring so we can pass enriched context
  const llmResult = await callLLM({
    tokenName,
    symbol: tokenSymbol,
    holders: goplusData.holder_count || '0',
    top10Ratio: (parseFloat(goplusData.top_10_holder_ratio || '0') * 100).toFixed(1),
    isHoneypot: goplusData.is_honeypot === '1' ? 'Yes' : 'No',
    sellTax: (parseFloat(goplusData.sell_tax || '0') * 100).toFixed(1),
    lpLocked: goplusData.lp_holders?.some(h => h.is_locked === 1) ? 'Yes' : 'No',
    ownerRenounced: !goplusData.owner_address || goplusData.owner_address === '' ? 'Yes' : 'No',
  })

  const overallScore = calculateOverallScore(
    safetyScore,
    holderScore,
    llmResult.narrativeScore,
    llmResult.degenScore
  )

  const flags = buildFlags(goplusData)

  return Response.json({
    success: true,
    data: {
      token: {
        name: tokenName,
        symbol: tokenSymbol,
        address,
        totalSupply,
        holders: goplusData.holder_count || '0',
      },
      scores: {
        safety: safetyScore,
        narrative: llmResult.narrativeScore,
        degen: llmResult.degenScore,
        holder: holderScore,
        overall: overallScore,
      },
      badge: llmResult.badge,
      flags,
      verdict: llmResult.verdict,
      scanTimestamp: new Date().toISOString(),
    },
  })
}

async function handleWalletMode(walletAddress: string) {
  try {
    const tokens = await fetchWalletTokens(walletAddress)

    if (tokens.length === 0) {
      return Response.json({
        success: true,
        data: {
          mode: 'wallet',
          walletAddress,
          tokens: [],
          portfolioScore: 0,
          scanTimestamp: new Date().toISOString(),
        },
      })
    }

    // Batch analyse each token (sequential to avoid rate limits)
    const results = []
    let llmCallCount = 0
    for (const token of tokens) {
      try {
        const [goplusData] = await Promise.all([fetchGoPlus(token.address)])

        const safetyScore = calculateSafetyScore(goplusData)
        const holderScore = calculateHolderScore(
          parseInt(goplusData.holder_count || '0'),
          parseFloat(goplusData.top_10_holder_ratio || '0')
        )

        const llmResult = llmCallCount < MAX_WALLET_LLM_CALLS
          ? await callLLM({
              tokenName: token.name || goplusData.token_name,
              symbol: token.symbol || goplusData.token_symbol,
              holders: goplusData.holder_count || '0',
              top10Ratio: (parseFloat(goplusData.top_10_holder_ratio || '0') * 100).toFixed(1),
              isHoneypot: goplusData.is_honeypot === '1' ? 'Yes' : 'No',
              sellTax: (parseFloat(goplusData.sell_tax || '0') * 100).toFixed(1),
              lpLocked: goplusData.lp_holders?.some(h => h.is_locked === 1) ? 'Yes' : 'No',
              ownerRenounced: !goplusData.owner_address ? 'Yes' : 'No',
            })
          : { narrativeScore: 50, degenScore: 50, verdict: 'AI analysis skipped to stay within scan limits. Check on-chain signals manually.', badge: 'MODERATE RISK' as const }
        llmCallCount++

        const overallScore = calculateOverallScore(safetyScore, holderScore, llmResult.narrativeScore, llmResult.degenScore)

        results.push({
          token: {
            name: token.name || goplusData.token_name,
            symbol: token.symbol || goplusData.token_symbol,
            address: token.address,
            totalSupply: goplusData.total_supply || '0',
            holders: goplusData.holder_count || '0',
          },
          scores: {
            safety: safetyScore,
            narrative: llmResult.narrativeScore,
            degen: llmResult.degenScore,
            holder: holderScore,
            overall: overallScore,
          },
          badge: llmResult.badge,
          flags: buildFlags(goplusData),
          verdict: llmResult.verdict,
          scanTimestamp: new Date().toISOString(),
        })
      } catch {
        // Skip tokens that fail analysis (e.g. not a real token contract)
      }
    }

    const portfolioScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.scores.overall, 0) / results.length)
      : 0

    return Response.json({
      success: true,
      data: {
        mode: 'wallet',
        walletAddress,
        tokens: results,
        portfolioScore,
        scanTimestamp: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error('Wallet mode error:', err)
    return Response.json(
      { success: false, error: 'Failed to scan wallet. Please check the address and try again.', code: 'WALLET_ERROR' },
      { status: 500 }
    )
  }
}
