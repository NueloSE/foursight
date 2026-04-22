'use client'

import type { AnalysisResult } from '@/types'
import BadgeChip from './BadgeChip'
import ScoreBar from './ScoreBar'
import { AlertTriangle, Search } from 'lucide-react'

interface PortfolioData {
  walletAddress: string
  tokens: AnalysisResult[]
  portfolioScore: number
  scanTimestamp: string
}

interface PortfolioViewProps {
  data: PortfolioData
}

export default function PortfolioView({ data }: PortfolioViewProps) {
  const { walletAddress, tokens, portfolioScore } = data

  const safe     = tokens.filter(t => t.scores.overall >= 70).length
  const moderate = tokens.filter(t => t.scores.overall >= 40 && t.scores.overall < 70).length
  const high     = tokens.filter(t => t.scores.overall < 40).length
  const riskiest = tokens.length > 0
    ? tokens.reduce((a, b) => a.scores.overall < b.scores.overall ? a : b)
    : null

  const healthColor =
    portfolioScore >= 70 ? 'var(--green)' :
    portfolioScore >= 50 ? 'var(--yellow)' :
    'var(--red)'

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Wallet header */}
      <div className="card" style={{ padding: 24 }}>
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Portfolio Scanner
        </p>
        <p className="text-mono text-sm" style={{ color: 'var(--text-accent)', wordBreak: 'break-all', marginBottom: 16 }}>
          {walletAddress}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
          <PortfolioStat label="Portfolio Score" value={`${portfolioScore}/100`} color={healthColor} />
          <PortfolioStat label="Tokens Scanned" value={String(tokens.length)} />
          <PortfolioStat label="Safe" value={String(safe)} color="var(--green)" />
          <PortfolioStat label="Moderate" value={String(moderate)} color="var(--yellow)" />
          <PortfolioStat label="High Risk" value={String(high)} color="var(--red)" />
        </div>
      </div>

      {/* Riskiest holding */}
      {riskiest && riskiest.scores.overall < 55 && (
        <div className="card" style={{ padding: 20, borderColor: 'var(--red)', boxShadow: '0 0 16px #ff386022' }}>
          <p style={{ fontSize: 12, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={12} /> Riskiest Position
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{riskiest.token.name}</span>
              <span className="text-mono" style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>
                ${riskiest.token.symbol}
              </span>
            </div>
            <BadgeChip badge={riskiest.badge} size="sm" />
          </div>
        </div>
      )}

      {tokens.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Search size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No meme token transactions found for this wallet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {tokens.map((token, i) => (
            <TokenCard key={token.token.address} result={token} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function TokenCard({ result, index }: { result: AnalysisResult; index: number }) {
  const { token, scores, badge } = result

  return (
    <div
      className="card fade-up"
      style={{ padding: 20, animationDelay: `${index * 80}ms` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: 15 }}>{token.name}</p>
          <p className="text-mono" style={{ fontSize: 12, color: 'var(--cyan)' }}>${token.symbol}</p>
        </div>
        <BadgeChip badge={badge} size="sm" />
      </div>

      <ScoreBar label="Overall" value={scores.overall} colorClass="score-fill-overall" delay={index * 50} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <MiniStat label="Safety"    value={scores.safety} />
        <MiniStat label="Narrative" value={scores.narrative} />
        <MiniStat label="Degen"     value={scores.degen} />
        <MiniStat label="Holders"   value={scores.holder} />
      </div>
    </div>
  )
}

function PortfolioStat({ label, value, color }: { label: string; value: string; color?: string }) {
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
