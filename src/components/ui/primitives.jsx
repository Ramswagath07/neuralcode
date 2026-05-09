import React from 'react'
import clsx from 'clsx'

/* ── Card ── */
export function Card({ children, className = '', hover = false, style = {} }) {
  return (
    <div className={clsx('rounded-2xl p-4 transition-all', hover && 'hover-card cursor-pointer', className)}
      style={{ background:'var(--surface)', border:'1px solid var(--border2)', ...style }}>
      {children}
    </div>
  )
}

/* ── Section title ── */
export function SectionTitle({ children }) {
  return (
    <div className="text-[10px] font-bold tracking-widest uppercase mb-2.5"
      style={{ color:'var(--accent)' }}>
      {children}
    </div>
  )
}

/* ── Difficulty badge ── */
const DIFF_STYLES = {
  easy:   { bg:'rgba(16,185,129,0.12)', color:'#10B981' },
  medium: { bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
  hard:   { bg:'rgba(239,68,68,0.12)',  color:'#EF4444' },
}
export function DiffBadge({ difficulty }) {
  const s = DIFF_STYLES[difficulty] || DIFF_STYLES.medium
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize"
      style={{ background:s.bg, color:s.color }}>{difficulty}</span>
  )
}

/* ── Topic badge ── */
export function TopicBadge({ children, color = 'accent' }) {
  const colors = {
    accent:  { bg:'rgba(99,120,255,0.1)',  color:'var(--accent)'  },
    cyan:    { bg:'rgba(34,211,238,0.1)',   color:'var(--accent3)' },
    purple:  { bg:'rgba(168,85,247,0.1)',   color:'var(--accent2)' },
    green:   { bg:'rgba(16,185,129,0.1)',   color:'var(--green)'  },
  }
  const s = colors[color] || colors.accent
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background:s.bg, color:s.color }}>{children}</span>
  )
}

/* ── Button ── */
export function Btn({ children, onClick, variant = 'default', size = 'md', disabled = false, className = '' }) {
  const sizes = { sm:'px-3 py-1.5 text-xs', md:'px-4 py-2 text-sm', lg:'px-6 py-3 text-sm' }
  const variants = {
    default: 'bg-[var(--surface2)] border border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface3)]',
    primary: 'btn-gradient text-white border-0',
    ghost:   'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] border border-transparent',
    danger:  'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[var(--red)]',
    success: 'bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] text-[var(--green)]',
  }
  return (
    <button onClick={onClick} disabled={disabled}
      className={clsx(
        'rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5',
        sizes[size], variants[variant], className
      )}>
      {children}
    </button>
  )
}

/* ── Spinner ── */
export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <div className="spin rounded-full"
      style={{ width:size, height:size,
        border:`2px solid rgba(99,120,255,0.2)`,
        borderTopColor:color }} />
  )
}

/* ── Progress Ring (SVG) ── */
export function Ring({ pct = 0, size = 80, color = 'var(--accent)', label, sublabel }) {
  const r    = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} className="ring-track" />
          <circle cx={size/2} cy={size/2} r={r} className="ring-progress"
            stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-syne font-bold text-base" style={{ color }}>{pct}%</span>
        </div>
      </div>
      {label    && <div className="text-[10px] font-bold tracking-wider uppercase" style={{color:'var(--text3)'}}>{label}</div>}
      {sublabel && <div className="text-[11px]" style={{color:'var(--text3)'}}>{sublabel}</div>}
    </div>
  )
}

/* ── Shimmer placeholder ── */
export function Skeleton({ className = '', style = {} }) {
  return <div className={clsx('shimmer rounded-xl', className)} style={style} />
}

/* ── Code block ── */
export function CodeBlock({ children, lang = '' }) {
  return (
    <div className="rounded-xl overflow-hidden my-2"
      style={{ background:'rgba(0,0,0,0.45)', border:'1px solid var(--border2)' }}>
      {lang && (
        <div className="px-4 py-1.5 text-[10px] font-mono font-bold border-b"
          style={{ color:'var(--text3)', borderColor:'var(--border2)' }}>{lang}</div>
      )}
      <pre className="p-4 font-mono text-[12px] leading-6 overflow-x-auto"
        style={{ color:'#A5B4FC' }}>{children}</pre>
    </div>
  )
}
