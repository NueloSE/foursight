import Anthropic from '@anthropic-ai/sdk'
import type { LLMResult, Badge } from '@/types'

const SYSTEM_PROMPT = `You are FourSight, an AI analyst specializing in meme coin intelligence on BNB Chain.
You evaluate meme tokens based on their concept, name, and on-chain data.
You always respond with valid JSON only. No markdown, no explanation outside the JSON.
Be direct, a little edgy, and speak the language of crypto culture.`

interface LLMInput {
  tokenName: string
  symbol: string
  holders: string
  top10Ratio: string
  isHoneypot: string
  sellTax: string
  lpLocked: string
  ownerRenounced: string
}

function buildUserPrompt(input: LLMInput): string {
  return `Analyze this BNB Chain meme token and return scores and a verdict.

Token Name: ${input.tokenName}
Token Symbol: ${input.symbol}
Holder Count: ${input.holders}
Top 10 Holder Ratio: ${input.top10Ratio}%
Honeypot Detected: ${input.isHoneypot}
Sell Tax: ${input.sellTax}%
Liquidity Locked: ${input.lpLocked}
Owner Renounced: ${input.ownerRenounced}

Return a JSON object with exactly these fields:
{
  "narrativeScore": <integer 0-100>,
  "degenScore": <integer 0-100>,
  "verdict": "<2 sentence max plain English assessment, crypto-native tone>",
  "badge": "<one of: ALPHA DETECTED | BULLISH DEGEN | MODERATE RISK | HIGH RISK | LIKELY RUG>"
}

Scoring guidance:
- narrativeScore: How original, memorable, and viral is this meme concept? Score low for generic names.
- degenScore: How much would a crypto degen be excited by this? Consider risk appetite, hype, and culture fit.
- verdict: Be honest. Mention the biggest strength and biggest risk. Max 2 sentences, keep it tight.
- badge: Choose based on the overall picture, not just one signal.`
}

const FALLBACK_RESULT: LLMResult = {
  narrativeScore: 50,
  degenScore: 50,
  verdict: 'AI analysis unavailable. Review the on-chain signals manually before making any decisions.',
  badge: 'MODERATE RISK',
}

function parseLLMResponse(text: string): LLMResult {
  const parsed = JSON.parse(text)
  const validBadges: Badge[] = ['ALPHA DETECTED', 'BULLISH DEGEN', 'MODERATE RISK', 'HIGH RISK', 'LIKELY RUG']

  return {
    narrativeScore: Math.min(100, Math.max(0, parseInt(parsed.narrativeScore) || 50)),
    degenScore: Math.min(100, Math.max(0, parseInt(parsed.degenScore) || 50)),
    verdict: parsed.verdict || FALLBACK_RESULT.verdict,
    badge: validBadges.includes(parsed.badge) ? parsed.badge : 'MODERATE RISK',
  }
}

async function callDGrid(input: LLMInput): Promise<LLMResult> {
  const baseUrl = process.env.DGRID_BASE_URL
  const apiKey = process.env.DGRID_API_KEY

  if (!baseUrl || !apiKey) throw new Error('DGrid credentials not configured')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    }),
  })
  clearTimeout(timeout)

  if (!res.ok) throw new Error(`DGrid API error: ${res.status}`)

  const json = await res.json()
  const content = json.choices?.[0]?.message?.content
  if (!content) throw new Error('DGrid returned empty content')

  return parseLLMResponse(content)
}

async function callAnthropic(input: LLMInput): Promise<LLMResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 150,   // JSON output is never > ~100 tokens; keep cost minimal
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildUserPrompt(input) },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected Anthropic response type')

  // Strip any markdown code fences if present
  const text = content.text.replace(/```json\n?|\n?```/g, '').trim()
  return parseLLMResponse(text)
}

export async function callLLM(input: LLMInput): Promise<LLMResult> {
  try {
    return await callDGrid(input)
  } catch (dgridError) {
    console.warn('DGrid failed, falling back to Anthropic:', dgridError)
    try {
      return await callAnthropic(input)
    } catch (anthropicError) {
      console.warn('Anthropic fallback failed:', anthropicError)
      return FALLBACK_RESULT
    }
  }
}
