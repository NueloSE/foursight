import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import { Flame, Shield, Brain, Dices, Users, CreditCard, Wallet } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    title: 'Paste an address',
    desc: 'Drop any BNB Chain token contract or wallet address into the scanner.',
  },
  {
    num: '02',
    title: 'AI analyses it',
    desc: 'GoPlus scans the contract, BscScan pulls on-chain data, and our AI scores safety, narrative strength, and degen potential.',
  },
  {
    num: '03',
    title: 'Get your report',
    desc: 'Receive a full audit report and a shareable score card PNG in under 5 seconds.',
  },
]

const STATS = [
  { value: '100+', label: 'Tokens Scanned' },
  { value: 'BNB Chain', label: 'Native' },
  { value: 'AI Powered', label: 'by DGrid + Claude' },
  { value: '<5s', label: 'Analysis Time' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,11,18,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logo.png" alt="FourSight logo" width={28} height={28} style={{ borderRadius: 6 }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--cyan)',
            letterSpacing: '0.05em',
          }}>
            FourSight
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '4px 12px',
          }}>
            BSC Chain
          </span>
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--green)',
            background: '#00ff8811',
            border: '1px solid #00ff8833',
            borderRadius: 20,
            padding: '4px 12px',
          }}>
            ● Live
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow orb behind hero */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, #00d4ff08 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-up">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '6px 16px',
            marginBottom: 28,
            fontSize: 12,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}>
            <Flame size={13} color="var(--orange)" />
            Built for the four.meme AI Sprint on BNB Chain
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 800,
          }}>
            Scan Any Meme Coin.{' '}
            <span className="glow-cyan">Know Before</span>{' '}
            You Ape.
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--text-secondary)',
            maxWidth: 540,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            AI-powered audit reports and shareable score cards for every BNB Chain token.
            Safety analysis, narrative scoring, and degen potential — in under 5 seconds.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SearchBar />
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            Paste a token contract address or a wallet address to scan your portfolio
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '20px 24px',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--cyan)',
                lineHeight: 1,
              }}>
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12, fontSize: 28 }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
          Three steps. Five seconds. Full picture.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {STEPS.map(step => (
            <div key={step.num} className="card" style={{ padding: 28 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--cyan)',
                letterSpacing: '0.15em',
                marginBottom: 14,
                opacity: 0.7,
              }}>
                STEP {step.num}
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '60px 24px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: 24 }}>
            What You Get in Every Scan
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: Shield,      label: 'Safety Score',    desc: 'Honeypot, sell tax, LP lock, and ownership checks' },
              { icon: Brain,       label: 'Narrative Score',  desc: 'How original and viral is the meme concept?' },
              { icon: Dices,       label: 'Degen Potential',  desc: 'Would a crypto degen ape into this?' },
              { icon: Users,       label: 'Holder Score',     desc: 'Distribution health and whale concentration' },
              { icon: CreditCard,  label: 'Share Card PNG',   desc: 'Download and share your score on X/Twitter' },
              { icon: Wallet,      label: 'Portfolio Scan',   desc: 'Batch-audit every meme token in your wallet' },
            ].map(f => (
              <div key={f.label} className="card-inner" style={{ padding: 20 }}>
                <div style={{ marginBottom: 10, color: 'var(--cyan)' }}><f.icon size={22} strokeWidth={1.75} /></div>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--text-primary)' }}>{f.label}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Image src="/logo.png" alt="FourSight" width={16} height={16} style={{ borderRadius: 3 }} />
          <span style={{ color: 'var(--cyan)' }}>FourSight</span> © 2026
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Built for the{' '}
          <span style={{ color: 'var(--orange)' }}>four.meme AI Sprint</span>
          {' '}· BNB Chain · Powered by DGrid AI
        </p>
      </footer>

    </div>
  )
}
