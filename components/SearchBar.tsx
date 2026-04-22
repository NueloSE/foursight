'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Zap, Wallet, Coins } from 'lucide-react'

const BSC_RE = /^0x[a-fA-F0-9]{40}$/

type Mode = 'token' | 'wallet'

export default function SearchBar() {
  const [value, setValue]   = useState('')
  const [error, setError]   = useState('')
  const [mode, setMode]     = useState<Mode>('token')
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const addr = value.trim()

    if (!addr) {
      setError('Paste a BSC token or wallet address to scan.')
      return
    }
    if (!BSC_RE.test(addr)) {
      setError('Invalid address. Must be a 42-character BSC address starting with 0x.')
      return
    }

    setError('')
    router.push(`/results?address=${addr}&mode=${mode}`)
  }

  const activeTabStyle = (m: Mode): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: mode === m ? 600 : 400,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    border: 'none',
    borderRadius: 6,
    transition: 'all 0.15s',
    background: mode === m ? 'var(--bg-card)' : 'transparent',
    color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
    boxShadow: mode === m ? '0 1px 4px #00000044' : 'none',
  })

  const placeholder = mode === 'token'
    ? 'Paste a token contract address...  0x1234...'
    : 'Paste a wallet address to scan portfolio...  0xABCD...'

  const hint = mode === 'token'
    ? 'Get a full safety audit + AI score card for any meme token'
    : 'Batch-audit every meme token held in a wallet'

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 640 }}>

      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 4,
        marginBottom: 10,
        gap: 2,
      }}>
        <button type="button" onClick={() => { setMode('token'); setError('') }} style={activeTabStyle('token')}>
          <Coins size={14} strokeWidth={2} />
          Token Audit
        </button>
        <button type="button" onClick={() => { setMode('wallet'); setError('') }} style={activeTabStyle('wallet')}>
          <Wallet size={14} strokeWidth={2} />
          Portfolio Scan
        </button>
      </div>

      {/* Input row */}
      <div style={{
        display: 'flex',
        gap: 0,
        background: 'var(--bg-secondary)',
        border: `1px solid ${error ? 'var(--red)' : mode === 'wallet' ? 'var(--cyan)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: error
          ? '0 0 12px #ff386033'
          : mode === 'wallet'
          ? '0 0 12px #00d4ff18'
          : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, color: 'var(--text-secondary)' }}>
          {mode === 'wallet' ? <Wallet size={16} color="var(--cyan)" /> : <Search size={16} />}
        </div>
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError('') }}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '14px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ borderRadius: 0, padding: '14px 28px', fontSize: 14, gap: 8 }}
        >
          <Zap size={15} strokeWidth={2.5} />
          {mode === 'wallet' ? 'Scan Wallet' : 'Scan'}
        </button>
      </div>

      {/* Hint / error */}
      <p style={{ marginTop: 8, fontSize: 12, color: error ? 'var(--red)' : 'var(--text-secondary)' }}>
        {error || hint}
      </p>
    </form>
  )
}
