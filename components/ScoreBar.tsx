'use client'

import { useEffect, useRef, useState } from 'react'

interface ScoreBarProps {
  label: string
  value: number
  colorClass: string
  delay?: number
}

export default function ScoreBar({ label, value, colorClass, delay = 0 }: ScoreBarProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay + 100)
    return () => clearTimeout(timer)
  }, [value, delay])

  const color =
    value >= 70 ? 'var(--green)' :
    value >= 50 ? 'var(--yellow)' :
    'var(--red)'

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600 }}>
          {value}<span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>/100</span>
        </span>
      </div>
      <div
        ref={ref}
        style={{
          height: 8,
          background: 'var(--bg-card)',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className={colorClass}
          style={{
            height: '100%',
            width: `${width}%`,
            borderRadius: 4,
            transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      </div>
    </div>
  )
}
