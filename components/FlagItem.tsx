import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { Flag } from '@/types'

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger:  XCircle,
}

const COLORS = {
  success: 'var(--green)',
  warning: 'var(--yellow)',
  danger:  'var(--red)',
}

export default function FlagItem({ type, message }: Flag) {
  const Icon = ICONS[type]
  const color = COLORS[type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 8,
      }}
    >
      <Icon size={16} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
      <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
        {message}
      </span>
    </div>
  )
}
