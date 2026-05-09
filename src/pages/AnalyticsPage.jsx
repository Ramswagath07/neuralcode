import React, { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Card, Ring, SectionTitle } from '../components/ui/primitives'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer, Cell
} from 'recharts'

export default function AnalyticsPage() {
  const { user, topicMastery, difficultyStats, weeklyActivity, activityData, solvedHistory, achievements } = useStore()

  const weekData = weeklyActivity.map((v, i) => ({
    day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
    problems: v,
  }))

  const masteryData = Object.entries(topicMastery)
    .sort((a,b) => b[1]-a[1])
    .map(([topic, pct]) => ({ topic, pct }))

  const easy   = difficultyStats.easy
  const medium = difficultyStats.medium
  const hard   = difficultyStats.hard

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="font-syne text-2xl font-bold">Your Progress Dashboard</h1>
          <p className="text-sm mt-1" style={{color:'var(--text3)'}}>AI-powered insights personalized to your coding journey</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'Problems Solved', value:user.solved,    sub:'+12 this week',     color:'var(--green)',   icon:'✅' },
            { label:'Accuracy Rate',   value:`${user.accuracy}%`, sub:'↑ 3% from last week', color:'var(--accent)',  icon:'🎯' },
            { label:'Total XP',        value:user.xp.toLocaleString(), sub:`Level ${user.level} · Expert`, color:'var(--accent4)', icon:'⚡' },
            { label:'Avg Speed',       value:'23m',          sub:'Per problem',       color:'var(--accent2)', icon:'⏱️' },
          ].map(({ label, value, sub, color, icon }) => (
            <Card key={label} hover className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold tracking-wider uppercase" style={{color:'var(--text3)'}}>{label}</div>
                <span className="text-lg">{icon}</span>
              </div>
              <div className="font-syne text-3xl font-bold leading-none" style={{color}}>{value}</div>
              <div className="text-[11px]" style={{color:'var(--text3)'}}>{sub}</div>
            </Card>
          ))}
        </div>

        {/* Activity heatmap */}
        <Card>
          <SectionTitle>Activity Heatmap · Last 15 Weeks</SectionTitle>
          <Heatmap data={activityData} />
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px]" style={{color:'var(--text3)'}}>Less</span>
            {[0,1,2,3,4].map(l => (
              <div key={l} className="w-3 h-3 rounded-sm" style={{
                background: l===0?'var(--surface2)':
                  `rgba(99,120,255,${0.2+l*0.2})`
              }} />
            ))}
            <span className="text-[10px]" style={{color:'var(--text3)'}}>More</span>
          </div>
        </Card>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly activity bar */}
          <Card>
            <SectionTitle>Weekly Activity</SectionTitle>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weekData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,120,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, fontSize:12 }}
                  labelStyle={{ color:'var(--text)' }}
                  itemStyle={{ color:'var(--accent)' }}
                />
                <Bar dataKey="problems" radius={[6,6,0,0]}>
                  {weekData.map((_, i) => (
                    <Cell key={i} fill={i===new Date().getDay()-1?'var(--accent)':'rgba(99,120,255,0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Difficulty rings */}
          <Card>
            <SectionTitle>Difficulty Breakdown</SectionTitle>
            <div className="flex justify-around items-center pt-2">
              <Ring pct={Math.round(easy.solved/easy.total*100)}   size={90} color="var(--green)"   label="Easy"   sublabel={`${easy.solved} solved`}   />
              <Ring pct={Math.round(medium.solved/medium.total*100)} size={90} color="var(--accent4)" label="Medium" sublabel={`${medium.solved} solved`} />
              <Ring pct={Math.round(hard.solved/hard.total*100)}   size={90} color="var(--red)"    label="Hard"   sublabel={`${hard.solved} solved`}   />
            </div>
          </Card>
        </div>

        {/* Topic mastery */}
        <Card>
          <SectionTitle>Topic Mastery</SectionTitle>
          <div className="space-y-3 mt-1">
            {masteryData.map(({ topic, pct }) => (
              <TopicBar key={topic} topic={topic} pct={pct} />
            ))}
          </div>
        </Card>

        {/* Solved history + achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* History */}
          <Card>
            <SectionTitle>Recent Solutions</SectionTitle>
            <div className="space-y-2 mt-1">
              {useStore.getState().solvedHistory.map(h => (
                <HistoryRow key={h.id} {...h} />
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <SectionTitle>Achievements</SectionTitle>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {achievements.map(a => (
                <AchievementCard key={a.id} {...a} />
              ))}
            </div>
          </Card>
        </div>

        {/* AI Recommendation */}
        <AIRecommendation topicMastery={topicMastery} />
      </div>
    </div>
  )
}

/* ── Heatmap ── */
function Heatmap({ data }) {
  const heatColor = (c) =>
    c===0?'var(--surface2)':
    c===1?'rgba(99,120,255,0.2)':
    c===2?'rgba(99,120,255,0.4)':
    c===3?'rgba(99,120,255,0.65)':
    'rgba(99,120,255,0.88)'

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns:'repeat(15,1fr)' }}>
      {data.map((d,i) => (
        <div key={i}
          className="aspect-square rounded-sm transition-transform hover:scale-125 cursor-pointer"
          style={{ background: heatColor(d.count) }}
          title={`Day ${d.day}: ${d.count} problem${d.count!==1?'s':''}`}
        />
      ))}
    </div>
  )
}

/* ── Topic mastery bar ── */
function TopicBar({ topic, pct }) {
  const barRef = useRef(null)
  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`
    }, 100)
    return () => clearTimeout(t)
  }, [pct])

  const color = pct >= 70 ? 'linear-gradient(90deg,#10B981,#6EE7B7)'
              : pct >= 45 ? 'linear-gradient(90deg,#6378FF,#A855F7)'
              : pct >= 30 ? 'linear-gradient(90deg,#F97316,#FB923C)'
              :             'linear-gradient(90deg,#EF4444,#F87171)'

  return (
    <div className="flex items-center gap-3">
      <div className="text-[12px] text-right w-28 shrink-0" style={{color:'var(--text2)'}}>{topic}</div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:'var(--surface2)'}}>
        <div ref={barRef} className="h-full rounded-full bar-fill" style={{background:color, width:'0%'}} />
      </div>
      <div className="text-[11px] w-8 text-right font-mono font-bold" style={{color:'var(--text3)'}}>{pct}%</div>
    </div>
  )
}

/* ── History row ── */
function HistoryRow({ title, difficulty, topic, result, time, xp }) {
  const icon    = result==='accepted'?'✅':result==='attempted'?'⚠️':'❌'
  const xpColor = xp>0?'var(--green)':'var(--text3)'
  const diffC   = difficulty==='easy'?'var(--green)':difficulty==='medium'?'var(--accent4)':'var(--red)'
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--surface2)] cursor-pointer">
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{title}</div>
        <div className="text-[11px]" style={{color:'var(--text3)'}}>{topic} · {time}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[11px] font-bold capitalize" style={{color:diffC}}>{difficulty}</div>
        <div className="text-[11px] font-mono" style={{color:xpColor}}>{xp>0?`+${xp}XP`:'—'}</div>
      </div>
    </div>
  )
}

/* ── Achievement card ── */
function AchievementCard({ icon, name, desc, unlocked }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all hover-card"
      style={{
        background: unlocked?'var(--surface2)':'var(--surface)',
        border:`1px solid ${unlocked?'var(--border)':'var(--border2)'}`,
        opacity: unlocked?1:0.4,
      }}>
      <span className="text-2xl">{icon}</span>
      <div className="text-[11px] font-bold leading-tight">{name}</div>
      <div className="text-[10px]" style={{color:'var(--text3)'}}>{desc}</div>
      {unlocked && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:'rgba(16,185,129,0.15)',color:'var(--green)'}}>UNLOCKED</span>}
    </div>
  )
}

/* ── AI Recommendation block ── */
function AIRecommendation({ topicMastery }) {
  const weak = Object.entries(topicMastery).filter(([,v])=>v<40).map(([k])=>k).slice(0,3)
  return (
    <div className="rounded-2xl p-5" style={{background:'rgba(99,120,255,0.05)', border:'1px solid rgba(99,120,255,0.18)'}}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="font-syne font-bold text-base">AI Recommendation</h3>
        <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full" style={{background:'rgba(99,120,255,0.15)',color:'var(--accent)'}}>Personalized</span>
      </div>
      <p className="text-[13px] leading-6 mb-3" style={{color:'var(--text2)'}}>
        Based on your activity, you should focus on <strong style={{color:'var(--accent)'}}>{weak.join(', ')}</strong>{' '}
        this week. Your accuracy on these topics is below 40%, which is limiting your interview readiness score.
      </p>
      <div className="flex gap-3 flex-wrap">
        <RecoTag emoji="📌" text={`Practice 3 ${weak[0]||'DP'} problems daily`} />
        <RecoTag emoji="⏱️" text="Set 30-min timed sessions" />
        <RecoTag emoji="📖" text="Review pattern approaches" />
      </div>
    </div>
  )
}

function RecoTag({ emoji, text }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-xl"
      style={{background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text2)'}}>
      <span>{emoji}</span>{text}
    </div>
  )
}
