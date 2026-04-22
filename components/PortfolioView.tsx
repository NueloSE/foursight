'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalysisResult } from '@/types'
import BadgeChip from './BadgeChip'

import { AlertTriangle, Search, ChevronRight } from 'lucide-react'

interface PortfolioData {
  walletAddress: string
  tokens: AnalysisResult[]
  portfolioScore: number
  scanTimestamp: string
}

interface PortfolioViewProps {
  data: PortfolioData
}

type FilterTab = 'all' | 'safe' | 'atrisk'
type SortKey  = 'score-asc' | 'score-desc' | 'name'

export default function PortfolioView({ data }: PortfolioViewProps) {
  const { walletAddress, tokens, portfolioScore, scanTimestamp } = data
  const [filter, setFilter] = useState<FilterTab>('all')
  const [sort, setSort]     = useState<SortKey>('score-asc')
  const router = useRouter()

  const safe     = tokens.filter(t => t.scores.overall >= 70).length
  const moderate = tokens.filter(t => t.scores.overall >= 40 && t.scores.overall < 70).length
  const high     = tokens.filter(t => t.scores.overall < 40).length
  const riskiest = tokens.length > 0
    ? tokens.reduce((a, b) => a.scores.overall < b.scores.overall ? a : b)
    : null

  const healthColor =
    portfolioScore >= 70 ? 'var(--green)'  :
    portfolioScore >= 50 ? 'var(--yellow)' :
    'var(--red)'

  const healthLabel =
    portfolioScore >= 70 ? 'HEALTHY'  :
    portfolioScore >= 50 ? 'MODERATE' :
    'AT RISK'

  const avgScore = tokens.length > 0
    ? Math.round(tokens.reduce((s, t) => s + t.scores.overall, 0) / tokens.length)
    : 0

  const safeP     = tokens.length > 0 ? (safe     / tokens.length) * 100 : 0
  const moderateP = tokens.length > 0 ? (moderate / tokens.length) * 100 : 0
  const highP     = tokens.length > 0 ? (high     / tokens.length) * 100 : 0

  const filtered = tokens
    .filter(t => {
      if (filter === 'safe')   return t.scores.overall >= 70
      if (filter === 'atrisk') return t.scores.overall < 55
      return true
    })
    .sort((a, b) => {
      if (sort === 'score-asc')  return a.scores.overall - b.scores.overall
      if (sort === 'score-desc') return b.scores.overall - a.scores.overall
      return a.token.name.localeCompare(b.token.name)
    })

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Portfolio Header ── */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>

          {/* Wallet info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Portfolio Scanner
            </p>
            <p className="text-mono text-sm" style={{ color: 'var(--text-accent)', wordBreak: 'break-all' }}>
              {walletAddress}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
              Scanned {new Date(scanTimestamp).toLocaleString()} · {tokens.length} token{tokens.length !== 1 ? 's' : ''} analysed
            </p>
          </div>

          {/* Score badge */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 800,
              color: healthColor, lineHeight: 1,
              textShadow: `0 0 30px ${healthColor}66`,
            }}>
              {portfolioScore}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '2px 0 8px' }}>/100</p>
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: healthColor, letterSpacing: '0.12em',
              background: `${healthColor}18`, border: `1px solid ${healthColor}44`,
              borderRadius: 20, padding: '4px 12px',
            }}>
              {healthLabel}
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 16, marginBottom: 20 }}>
          <PStat label="Tokens"   value={String(tokens.length)} />
          <PStat label="Avg Score" value={String(avgScore)} />
          <PStat label="Safe"     value={String(safe)}     color="var(--green)"  />
          <PStat label="Moderate" value={String(moderate)} color="var(--yellow)" />
          <PStat label="High Risk" value={String(high)}    color="var(--red)"    />
        </div>

        {/* Risk distribution bar */}
        {tokens.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Risk Distribution
            </p>
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--bg-card)', gap: 2 }}>
              {safeP     > 0 && <div style={{ flex: safeP,     background: 'var(--green)',  borderRadius: 4, transition: 'flex 0.6s ease' }} />}
              {moderateP > 0 && <div style={{ flex: moderateP, background: 'var(--yellow)', borderRadius: 4, transition: 'flex 0.6s ease' }} />}
              {highP     > 0 && <div style={{ flex: highP,     background: 'var(--red)',    borderRadius: 4, transition: 'flex 0.6s ease' }} />}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <Dot color="var(--green)"  label={`${safe} Safe`}     />
              <Dot color="var(--yellow)" label={`${moderate} Moderate`} />
              <Dot color="var(--red)"    label={`${high} High Risk`} />
            </div>
          </div>
        )}
      </div>

      {/* ── Riskiest Position Alert ── */}
      {riskiest && riskiest.scores.overall < 55 && (
        <div className="card" style={{ padding: 20, borderColor: 'var(--red)', boxShadow: '0 0 20px #ff386022' }}>
          <p style={{ fontSize: 11, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={12} /> Riskiest Holding — Score {riskiest.scores.overall}/100
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span style={{ fontWeight: 600 }}>{riskiest.token.name}</span>
              <span className="text-mono" style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>
                ${riskiest.token.symbol}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <BadgeChip badge={riskiest.badge} size="sm" />
              <button
                onClick={() => router.push(`/results?address=${riskiest.token.address}`)}
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '6px 12px', gap: 4 }}
              >
                Full Audit <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {tokens.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Search size={40} color="var(--border)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>No meme tokens found</p>
          <p style={{ fontSize: 14 }}>No token transactions were detected for this wallet on BNB Chain.</p>
        </div>

      ) : (
        <>
          {/* ── Filter + Sort Bar ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>

            {/* Filter tabs */}
            <div style={{
              display: 'flex', background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
            }}>
              {([
                { key: 'all'    as const, label: `All (${tokens.length})` },
                { key: 'safe'   as const, label: `Safe (${safe})` },
                { key: 'atrisk' as const, label: `At Risk (${high})` },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: '8px 16px', border: 'none', fontSize: 13, cursor: 'pointer',
                    background: filter === tab.key ? 'var(--bg-card)' : 'transparent',
                    color: filter === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderBottom: filter === tab.key ? '2px solid var(--cyan)' : '2px solid transparent',
                    fontFamily: 'var(--font-sans)', fontWeight: filter === tab.key ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
                fontSize: 13, padding: '8px 12px', cursor: 'pointer', outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="score-asc">Riskiest First</option>
              <option value="score-desc">Safest First</option>
              <option value="name">A → Z</option>
            </select>
          </div>

          {/* ── Token Grid ── */}
          {filtered.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <p>No tokens match this filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {filtered.map((result, i) => (
                <TokenCard
                  key={result.token.address}
                  result={result}
                  index={i}
                  onClick={() => router.push(`/results?address=${result.token.address}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ── Token Card ── */
function TokenCard({ result, index, onClick }: { result: AnalysisResult; index: number; onClick: () => void }) {
  const { token, scores, badge, flags, verdict } = result

  const overallColor =
    scores.overall >= 70 ? 'var(--green)'  :
    scores.overall >= 50 ? 'var(--yellow)' :
    'var(--red)'

  const danger  = flags.filter(f => f.type === 'danger').length
  const warning = flags.filter(f => f.type === 'warning').length
  const pass    = flags.filter(f => f.type === 'success').length

  return (
    <div
      className="card fade-up"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{ padding: 20, animationDelay: `${index * 60}ms`, cursor: 'pointer' }}
    >
      {/* Token name + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
            {token.name}
          </p>
          <p className="text-mono" style={{ fontSize: 12, color: 'var(--cyan)' }}>${token.symbol}</p>
        </div>
        <BadgeChip badge={badge} size="sm" />
      </div>

      {/* Score + mini bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800,
          color: overallColor, lineHeight: 1, flexShrink: 0,
          textShadow: `0 0 18px ${overallColor}55`,
        }}>
          {scores.overall}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 5 }}>Overall Score</p>
          <div style={{ height: 6, background: 'var(--bg-card)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{
              height: '100%', width: `${scores.overall}%`, borderRadius: 3,
              background: `linear-gradient(90deg, ${overallColor}, ${overallColor}88)`,
              transition: 'width 600ms ease-out',
            }} />
          </div>
        </div>
      </div>

      {/* 4 sub-scores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        <MiniStat label="Safety"    value={scores.safety}    />
        <MiniStat label="Narrative" value={scores.narrative} />
        <MiniStat label="Degen"     value={scores.degen}     />
        <MiniStat label="Holders"   value={scores.holder}    />
      </div>

      {/* Verdict snippet */}
      <p style={{
        fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      } as React.CSSProperties}>
        {verdict}
      </p>

      {/* Footer: flag chips + CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {danger  > 0 && <FlagChip count={danger}  type="danger"  />}
          {warning > 0 && <FlagChip count={warning} type="warning" />}
          {pass    > 0 && <FlagChip count={pass}    type="pass"    />}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          Full audit <ChevronRight size={11} />
        </span>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function PStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: color || 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? 'var(--green)' : value >= 50 ? 'var(--yellow)' : 'var(--red)'
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 6, padding: '6px 10px', border: '1px solid var(--border)' }}>
      <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color }}>{value}</p>
    </div>
  )
}

function FlagChip({ count, type }: { count: number; type: 'danger' | 'warning' | 'pass' }) {
  const map = {
    danger:  { color: 'var(--red)',    bg: '#ff386011', border: '#ff386033', label: 'danger'  },
    warning: { color: 'var(--yellow)', bg: '#ffd70011', border: '#ffd70033', label: 'warn'    },
    pass:    { color: 'var(--green)',  bg: '#00ff8811', border: '#00ff8833', label: 'pass'    },
  }
  const s = map[type]
  return (
    <span style={{ fontSize: 11, color: s.color, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 4, padding: '2px 6px' }}>
      {count} {s.label}
    </span>
  )
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}


