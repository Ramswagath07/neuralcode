import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Card, SectionTitle } from '../components/ui/primitives'
import clsx from 'clsx'

export default function LeaderboardPage() {
  const { leaderboard, user, achievements } = useStore()
  const [filter, setFilter] = useState('all')
  const top3  = leaderboard.slice(0,3)
  const rest  = leaderboard.slice(3)

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-syne text-2xl font-bold flex items-center gap-2">
              🏆 Global Leaderboard
            </h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text3)'}}>
              Top coders · Updated in real-time via WebSocket
            </p>
          </div>
          <div className="flex gap-2">
            {['all','weekly','monthly'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold capitalize border transition-all"
                style={{
                  background:   filter===f?'rgba(99,120,255,0.15)':'transparent',
                  borderColor:  filter===f?'rgba(99,120,255,0.35)':'var(--border2)',
                  color:        filter===f?'var(--accent)':'var(--text2)',
                }}>
                {f==='all'?'All Time':f==='weekly'?'This Week':'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Your rank card */}
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{background:'rgba(99,120,255,0.07)', border:'1px solid rgba(99,120,255,0.2)'}}>
          <div className="font-syne text-4xl font-black" style={{color:'var(--accent)'}}>#{user.rank}</div>
          <div>
            <div className="font-bold">Your Global Rank</div>
            <div className="text-[12px]" style={{color:'var(--text3)'}}>
              {user.xp.toLocaleString()} XP · {user.solved} solved · 🔥 {user.streak} day streak
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[12px]" style={{color:'var(--text3)'}}>Next rank in</div>
            <div className="font-bold" style={{color:'var(--accent4)'}}>
              {(leaderboard[user.rank-2]?.xp - user.xp).toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-3 gap-3">
          {/* 2nd */}
          <PodiumCard entry={top3[1]} place={2} />
          {/* 1st */}
          <PodiumCard entry={top3[0]} place={1} />
          {/* 3rd */}
          <PodiumCard entry={top3[2]} place={3} />
        </div>

        {/* Full table */}
        <Card className="p-0 overflow-hidden">
          {/* Table header */}
          <div className="grid gap-4 px-5 py-3 text-[10px] font-bold tracking-widest uppercase"
            style={{
              gridTemplateColumns:'48px 1fr 90px 90px 70px',
              borderBottom:'1px solid var(--border2)',
              color:'var(--text3)',
              background:'var(--surface2)',
            }}>
            <div>Rank</div><div>User</div><div>XP</div><div>Solved</div><div>Streak</div>
          </div>

          {leaderboard.map(e => (
            <LeaderRow key={e.rank} entry={e} />
          ))}
        </Card>

        {/* Achievements section */}
        <div>
          <h2 className="font-syne text-lg font-bold mb-3">🏅 Platform Achievements</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {achievements.map(a => (
              <AchCard key={a.id} {...a} />
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon:'👥', label:'Active Users',     val:'12,847' },
            { icon:'💬', label:'Problems Solved',  val:'2.4M'   },
            { icon:'🌍', label:'Countries',        val:'89'     },
            { icon:'⭐', label:'Avg Rating',       val:'4.9'    },
          ].map(({ icon, label, val }) => (
            <div key={label} className="rounded-2xl p-4 text-center hover-card"
              style={{ background:'var(--surface2)', border:'1px solid var(--border2)' }}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-syne text-xl font-bold gradient-text">{val}</div>
              <div className="text-[11px]" style={{color:'var(--text3)'}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PodiumCard({ entry, place }) {
  if (!entry) return null
  const medals = { 1:'👑', 2:'🥈', 3:'🥉' }
  const height  = place===1 ? 'order-first -translate-y-2 pt-2' : ''
  const borderC = place===1 ? 'rgba(245,158,11,0.35)' : place===2 ? 'rgba(148,163,184,0.25)' : 'rgba(180,83,9,0.25)'
  const bgC     = place===1 ? 'rgba(245,158,11,0.06)' : 'var(--surface)'

  return (
    <div className={clsx('rounded-2xl p-4 text-center transition-all hover-card border', height)}
      style={{ background:bgC, borderColor:borderC }}>
      <div className="text-3xl mb-2">{medals[place]}</div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold mx-auto mb-2"
        style={{ background:`linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]})` }}>
        {entry.initials}
      </div>
      <div className="font-bold text-[13px]" style={{color: entry.isMe?'var(--accent)':'var(--text)'}}>{entry.name}</div>
      <div className="text-[11px]" style={{color:'var(--text3)'}}>📍 {entry.location}</div>
      <div className="mt-2 font-mono font-bold text-[13px]" style={{color:'var(--accent4)'}}>
        {entry.xp.toLocaleString()} XP
      </div>
      <div className="text-[11px]" style={{color:'var(--text3)'}}>{entry.solved} solved · 🔥{entry.streak}</div>
    </div>
  )
}

function LeaderRow({ entry }) {
  const rankColor = entry.rank===1?'#F59E0B':entry.rank===2?'#94A3B8':entry.rank===3?'#B45309':'var(--text3)'
  const rankLabel = entry.rank<=3?['','👑','🥈','🥉'][entry.rank]:entry.rank

  return (
    <div className={clsx(
      'grid gap-4 px-5 py-3 items-center transition-colors hover:bg-[var(--surface2)] border-b',
      entry.isMe && 'border-l-2 border-l-[var(--accent)]'
    )}
      style={{
        gridTemplateColumns:'48px 1fr 90px 90px 70px',
        borderColor:'var(--border2)',
        background: entry.isMe?'rgba(99,120,255,0.06)':'transparent',
      }}>
      <div className="font-syne font-bold text-base" style={{color:rankColor}}>{rankLabel}</div>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0"
          style={{background:`linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]})`}}>
          {entry.initials}
        </div>
        <div>
          <div className="text-[13px] font-medium" style={{color:entry.isMe?'var(--accent)':'var(--text)'}}>{entry.name}</div>
          <div className="text-[11px]" style={{color:'var(--text3)'}}>📍 {entry.location}</div>
        </div>
      </div>
      <div className="font-mono font-bold text-[13px]" style={{color:'var(--accent4)'}}>{entry.xp.toLocaleString()}</div>
      <div className="font-mono font-bold text-[13px]" style={{color:'var(--green)'}}>{entry.solved}</div>
      <div className="text-[12px] flex items-center gap-1" style={{color:'var(--red)'}}>🔥 {entry.streak}</div>
    </div>
  )
}

function AchCard({ icon, name, desc, unlocked }) {
  return (
    <div className="rounded-xl p-3 text-center hover-card flex flex-col items-center gap-1.5"
      style={{
        background: unlocked?'var(--surface2)':'var(--surface)',
        border:`1px solid ${unlocked?'var(--border)':'var(--border2)'}`,
        opacity: unlocked?1:0.45,
      }}>
      <span className="text-2xl">{icon}</span>
      <div className="text-[11px] font-bold leading-tight">{name}</div>
      {unlocked && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{background:'rgba(16,185,129,0.15)',color:'var(--green)'}}>✓ EARNED</span>
      )}
    </div>
  )
}
