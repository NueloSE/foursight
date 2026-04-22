import { Rocket, TrendingUp, AlertTriangle, AlertOctagon, Skull } from 'lucide-react'
import type { Badge } from '@/types'

const CONFIG: Record<Badge, { label: string; cls: string; Icon: React.ElementType }> = {
  'ALPHA DETECTED': { label: 'ALPHA DETECTED', cls: 'badge-alpha',    Icon: Rocket        },
  'BULLISH DEGEN':  { label: 'BULLISH DEGEN',  cls: 'badge-bullish',  Icon: TrendingUp    },
  'MODERATE RISK':  { label: 'MODERATE RISK',  cls: 'badge-moderate', Icon: AlertTriangle },
  'HIGH RISK':      { label: 'HIGH RISK',       cls: 'badge-high',     Icon: AlertOctagon  },
  'LIKELY RUG':     { label: 'LIKELY RUG',      cls: 'badge-rug',      Icon: Skull         },
}

interface BadgeChipProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
}

export default function BadgeChip({ badge, size = 'md' }: BadgeChipProps) {
  const { label, cls, Icon } = CONFIG[badge]

  const padding  = size === 'lg' ? '10px 20px' : size === 'sm' ? '4px 10px' : '7px 14px'
  const fontSize = size === 'lg' ? 16 : size === 'sm' ? 11 : 13
  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14

  return (
    <span
      className={cls}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding,
        fontSize,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        border: '1px solid currentColor',
        borderRadius: 6,
        textTransform: 'uppercase',
      }}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {label}
    </span>
  )
}
