'use client'

import type { AnalysisResult } from '@/types'
import ScoreBar from './ScoreBar'
import FlagItem from './FlagItem'
import BadgeChip from './BadgeChip'

interface AuditReportProps {
  data: AnalysisResult
}

export default function AuditReport({ data }: AuditReportProps) {
  const { token, scores, badge, flags, verdict, scanTimestamp } = data

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Token header */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{token.name}</h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--text-accent)',
                  background: '#00d4ff11',
                  border: '1px solid #00d4ff33',
                  borderRadius: 6,
                  padding: '2px 10px',
                }}
              >
                ${token.symbol}
              </span>
            </div>
            <p
              className="text-mono text-sm"
              style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}
            >
              {token.address}
            </p>
          </div>
          <BadgeChip badge={badge} size="md" />
        </div>

        <hr className="divider" style={{ margin: '16px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
          <Stat label="Holders" value={parseInt(token.holders).toLocaleString()} />
          <Stat label="Total Supply" value={formatSupply(token.totalSupply)} />
          <Stat label="Scanned" value={formatTime(scanTimestamp)} />
          <Stat label="Chain" value="BNB Chain" accent />
        </div>
      </div>

      {/* Overall score */}
      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Overall Score
        </p>
        <div
          className="glow-cyan"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 700, lineHeight: 1 }}
        >
          {scores.overall}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>/100</p>
      </div>

      {/* Score breakdown */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 20, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Score Breakdown
        </h3>
        <ScoreBar label="Safety"           value={scores.safety}    colorClass="score-fill-safety"    delay={0}   />
        <ScoreBar label="Narrative Strength" value={scores.narrative} colorClass="score-fill-narrative" delay={100} />
        <ScoreBar label="Degen Potential"  value={scores.degen}     colorClass="score-fill-degen"     delay={200} />
        <ScoreBar label="Holder Score"     value={scores.holder}    colorClass="score-fill-holder"    delay={300} />
      </div>

      {/* AI verdict */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          AI Verdict
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.8 }}>{verdict}</p>
      </div>

      {/* Risk flags */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Risk Flags
        </h3>
        {flags.map((flag, i) => (
          <FlagItem key={i} {...flag} />
        ))}
      </div>

    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: accent ? 'var(--cyan)' : 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

function formatSupply(supply: string): string {
  const n = parseFloat(supply)
  if (isNaN(n)) return supply
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T'
  if (n >= 1e9)  return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6)  return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3)  return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(0)
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
