'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { AlertTriangle, FileText, CreditCard } from 'lucide-react'
import type { AnalysisResult } from '@/types'
import AuditReport from '@/components/AuditReport'
import ShareCard from '@/components/ShareCard'
import PortfolioView from '@/components/PortfolioView'

type Tab = 'report' | 'card'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const address = searchParams.get('address') || ''
  const mode    = searchParams.get('mode')    || 'token'

  const [tab, setTab] = useState<Tab>('report')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [portfolioData, setPortfolioData] = useState<null | {
    walletAddress: string
    tokens: AnalysisResult[]
    portfolioScore: number
    scanTimestamp: string
  }>(null)

  const runAnalysis = useCallback(async () => {
    setLoading(true)
    setError('')
    setData(null)
    setPortfolioData(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, mode }),
      })
      const json = await res.json()

      if (!json.success) {
        setError(json.error || 'Analysis failed. Please try again.')
        return
      }

      if (json.data.mode === 'wallet') {
        setPortfolioData(json.data)
      } else {
        setData(json.data)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [address, mode])

  useEffect(() => {
    if (!address) {
      router.replace('/')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runAnalysis()
  }, [address, mode, runAnalysis, router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,11,18,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Image src="/logo.png" alt="FourSight logo" width={28} height={28} style={{ borderRadius: 6 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: 'var(--cyan)' }}>
            FourSight
          </span>
        </button>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => router.push('/')}>
          ← New Scan
        </button>
      </nav>

      <main style={{ flex: 1, maxWidth: 720, margin: '0 auto', width: '100%', padding: '32px 20px' }}>

        {/* Address display */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Scanning
          </p>
          <p className="text-mono" style={{ fontSize: 13, color: 'var(--text-accent)', wordBreak: 'break-all' }}>
            {address}
          </p>
        </div>

        {/* Loading state */}
        {loading && <LoadingSkeleton />}

        {/* Error state */}
        {!loading && error && (
          <div className="card fade-up" style={{ padding: 40, textAlign: 'center' }}>
            <AlertTriangle size={32} color="var(--red)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ marginBottom: 10, color: 'var(--red)' }}>Analysis Failed</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error}</p>
            <button className="btn btn-outline" onClick={runAnalysis}>
              Try Again
            </button>
          </div>
        )}

        {/* Portfolio mode */}
        {!loading && !error && portfolioData && (
          <PortfolioView data={portfolioData} />
        )}

        {/* Token mode */}
        {!loading && !error && data && (
          <>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: 0,
              marginBottom: 24,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
            }}>
              <TabButton active={tab === 'report'} onClick={() => setTab('report')}>
                <FileText size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Audit Report
              </TabButton>
              <TabButton active={tab === 'card'} onClick={() => setTab('card')}>
                <CreditCard size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Score Card
              </TabButton>
            </div>

            {tab === 'report' && <AuditReport data={data} />}
            {tab === 'card'   && <ShareCard data={data} />}
          </>
        )}

      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 32px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Image src="/logo.png" alt="FourSight" width={14} height={14} style={{ borderRadius: 3 }} /> FourSight · Built for four.meme AI Sprint · BNB Chain
        </p>
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 16px',
        background: active ? 'var(--bg-card)' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid var(--cyan)' : '2px solid transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--cyan)', animation: 'pulse-red 1s infinite' }} />
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Running analysis pipeline…
        </p>
      </div>

      {/* Skeleton cards */}
      <div className="card" style={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '55%' }} />
      </div>

      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <div className="skeleton" style={{ height: 72, width: 100, margin: '0 auto 8px' }} />
        <div className="skeleton" style={{ height: 14, width: 60, margin: '0 auto' }} />
      </div>

      <div className="card" style={{ padding: 24 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div className="skeleton" style={{ height: 13, width: 100 }} />
              <div className="skeleton" style={{ height: 13, width: 40 }} />
            </div>
            <div className="skeleton" style={{ height: 8, width: '100%' }} />
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>Loading…</p>
    </div>}>
      <ResultsContent />
    </Suspense>
  )
}
