'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Zap } from 'lucide-react'

const BSC_RE = /^0x[a-fA-F0-9]{40}$/

export default function SearchBar() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
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
    router.push(`/results?address=${addr}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 640 }}>
      <div
        style={{
          display: 'flex',
          gap: 0,
          background: 'var(--bg-secondary)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: error ? '0 0 12px #ff386033' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 14, color: 'var(--text-secondary)' }}>
          <Search size={16} />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => { setValue(e.target.value); setError('') }}
          placeholder="Paste a token or wallet address...  0x1234..."
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
          Scan
        </button>
      </div>
      {error && (
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--red)' }}>{error}</p>
      )}
    </form>
  )
}
