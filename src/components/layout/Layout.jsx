import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import clsx from 'clsx'

const NAV = [
  { path:'/generate',    icon:'⚡', label:'Generate'    },
  { path:'/analytics',   icon:'📊', label:'Analytics'   },
  { path:'/mentor',      icon:'🤖', label:'AI Mentor'   },
  { path:'/leaderboard', icon:'🏆', label:'Leaderboard' },
]

export default function Layout({ children }) {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  const { user, theme, toggleTheme } = useStore()

  const isActive = (p) => pathname === p

  return (
    <div className="flex flex-col h-full">
      {/* ── TopNav ── */}
      <header className="glass flex items-center gap-3 px-5 py-2.5 shrink-0"
        style={{ borderBottom:'1px solid var(--border2)' }}>

        {/* Logo */}
        <button onClick={() => navigate('/')}
          className="font-syne text-lg font-extrabold gradient-text tracking-tight select-none shrink-0">
          NeuralCode
          <span className="inline-block w-1.5 h-1.5 rounded-full ml-0.5 mb-0.5 align-middle pulse-dot"
            style={{ background:'var(--accent)' }} />
        </button>

        {/* Tabs */}
        <nav className="flex gap-1 ml-2">
          {NAV.map(({ path, icon, label }) => (
            <button key={path} onClick={() => navigate(path)}
              className={clsx(
                'relative px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap',
                isActive(path)
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              )}
              style={isActive(path) ? { background:'rgba(99,120,255,0.13)' } : {}}>
              {icon} {label}
              {isActive(path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full"
                  style={{ background:'var(--accent)' }} />
              )}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2.5">
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text)]"
            title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
            style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.22)', color:'var(--accent4)' }}>
            ⚡ {user.xp.toLocaleString()} XP
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
            style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.22)', color:'var(--red)' }}>
            🔥 {user.streak}d
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer select-none"
            style={{ background:'linear-gradient(135deg,#6378FF,#A855F7)' }}>
            {user.initials}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar pathname={pathname} navigate={navigate} />
        {/* Page */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}

function Sidebar({ pathname, navigate }) {
  const isActive = (p) => pathname === p

  return (
    <aside className="w-52 shrink-0 flex flex-col gap-1 p-3 overflow-y-auto"
      style={{ background:'var(--surface)', borderRight:'1px solid var(--border2)' }}>

      <SideSection label="Quick Access">
        {NAV.map(({ path, icon, label }) => (
          <SideItem key={path} icon={icon} label={label} active={isActive(path)} onClick={() => navigate(path)} />
        ))}
        <SideItem icon="🎯" label="Daily Challenge" />
        <SideItem icon="⏱️" label="Mock Interview" />
      </SideSection>

      <SideSection label="Weak Topics">
        <div className="flex flex-wrap gap-1.5 px-1">
          {[['⚠','DP','weak'],['⚠','Graphs','weak'],['~','Heaps','med'],['~','Tries','med'],['✓','Arrays','ok']].map(([ic,lb,tp]) => (
            <span key={lb} className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                background: tp==='weak'?'rgba(239,68,68,0.12)':tp==='med'?'rgba(245,158,11,0.12)':'rgba(16,185,129,0.12)',
                color:      tp==='weak'?'var(--red)':tp==='med'?'var(--accent4)':'var(--green)',
                border:`1px solid ${tp==='weak'?'rgba(239,68,68,0.2)':tp==='med'?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)'}`,
              }}>
              {ic} {lb}
            </span>
          ))}
        </div>
      </SideSection>

      <SideSection label="Recent">
        {[['✓','Two Sum','var(--green)'],['~','LRU Cache','var(--orange)'],['✗','Word Ladder','var(--red)']].map(([ic,t,c])=>(
          <div key={t} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[var(--surface2)] transition-colors text-[12px]">
            <span style={{color:c}}>{ic}</span>
            <span style={{color:'var(--text2)'}}>{t}</span>
          </div>
        ))}
      </SideSection>
    </aside>
  )
}

function SideSection({ label, children }) {
  return (
    <div className="mt-3">
      <div className="text-[10px] font-bold tracking-widest uppercase px-2 mb-2" style={{color:'var(--text3)'}}>{label}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function SideItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={clsx(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] w-full text-left transition-all border',
        active
          ? 'border-[rgba(99,120,255,0.25)] text-[var(--accent)]'
          : 'border-transparent text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]'
      )}
      style={active ? {background:'rgba(99,120,255,0.11)'} : {}}>
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
