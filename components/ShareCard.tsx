'use client'

import { useRef, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import type { AnalysisResult } from '@/types'
import ScoreBar from './ScoreBar'
import BadgeChip from './BadgeChip'

interface ShareCardProps {
  data: AnalysisResult
}

export default function ShareCard({ data }: ShareCardProps) {
  const { token, scores, badge, verdict } = data
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080b12',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `foursight-${token.symbol}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foursight.vercel.app'
    const text = encodeURIComponent(
      `Just scanned $${token.symbol} on FourSight\n` +
      `Score: ${scores.overall}/100 — ${badge}\n` +
      `Check your meme coin:\n` +
      `${appUrl}\n` +
      `#fourmeme #BNBChain #FourSight`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="fade-up">
      {/* The exportable card */}
      <div
        id="score-card"
        ref={cardRef}
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 32,
          maxWidth: 520,
          margin: '0 auto',
          boxShadow: '0 0 40px #00d4ff18',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid decoration */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              FourSight — Meme Coin Intelligence
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700 }}>{token.name}</h2>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)',
                background: '#00d4ff11', border: '1px solid #00d4ff33',
                borderRadius: 6, padding: '2px 10px',
              }}>
                ${token.symbol}
              </span>
            </div>
          </div>
          <BadgeChip badge={badge} size="sm" />
        </div>

        {/* Overall score */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
          padding: '16px 20px', border: '1px solid var(--border)',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="glow-cyan" style={{ fontFamily: 'var(--font-mono)', fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
              {scores.overall}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>/100</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Overall Score</p>
            <div style={{
              height: 10, background: 'var(--bg-card)', borderRadius: 5,
              overflow: 'hidden', border: '1px solid var(--border)',
            }}>
              <div className="score-fill-overall" style={{
                height: '100%', width: `${scores.overall}%`,
                borderRadius: 5, transition: 'width 800ms ease-out',
              }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
              {parseInt(token.holders).toLocaleString()} holders · BNB Chain
            </p>
          </div>
        </div>

        {/* Score bars */}
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <ScoreBar label="Safety"             value={scores.safety}    colorClass="score-fill-safety"    delay={0}   />
          <ScoreBar label="Narrative Strength" value={scores.narrative} colorClass="score-fill-narrative" delay={100} />
          <ScoreBar label="Degen Potential"    value={scores.degen}     colorClass="score-fill-degen"     delay={200} />
          <ScoreBar label="Holder Score"       value={scores.holder}    colorClass="score-fill-holder"    delay={300} />
        </div>

        {/* Verdict */}
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
          padding: '14px 16px', border: '1px solid var(--border)',
          marginBottom: 20, position: 'relative',
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {verdict.length > 160 ? verdict.slice(0, 157) + '...' : verdict}
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            {(process.env.NEXT_PUBLIC_APP_URL || 'https://foursight-six.vercel.app').replace('https://', '')}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            #fourmeme #BNBChain
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
        <button onClick={handleDownload} disabled={downloading} className="btn btn-outline">
          <Download size={15} />
          {downloading ? 'Exporting...' : 'Download PNG'}
        </button>
        <button onClick={handleShare} className="btn btn-primary">
          <Share2 size={15} />
          Share on X
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
        Share your score card to earn community votes on DoraHacks
      </p>
    </div>
  )
}
