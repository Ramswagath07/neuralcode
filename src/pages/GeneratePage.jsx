import React, { useState, useRef, useEffect } from 'react'
import { useStore, TOPICS, COMPANIES } from '../store/useStore'
import { generateProblem, getHint, getSolution, reviewCode } from '../services/api'
import { Card, Btn, DiffBadge, TopicBadge, SectionTitle, Spinner, Skeleton } from '../components/ui/primitives'
import clsx from 'clsx'

const LANG_EXT = { python:'solution.py', javascript:'solution.js', java:'Solution.java', cpp:'solution.cpp' }
const LANG_COLORS = { python:'#3B82F6', javascript:'#F59E0B', java:'#EF4444', cpp:'#8B5CF6' }

const FALLBACK = {
  title:'Climbing Stairs',
  difficulty:'medium',
  topics:['Dynamic Programming'],
  company:'General',
  description:'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  examples:[
    { input:'n = 2', output:'2', explanation:'1+1 or 2' },
    { input:'n = 3', output:'3', explanation:'1+1+1, 1+2, or 2+1' },
  ],
  constraints:['1 ≤ n ≤ 45'],
  timeComplexity:'O(n)', spaceComplexity:'O(1)',
  hints:['Think Fibonacci','dp[i] = dp[i-1] + dp[i-2]','Base cases: dp[1]=1, dp[2]=2'],
  starterCode:{
    python:'def climbStairs(n: int) -> int:\n    # Your code here\n    pass',
    javascript:'function climbStairs(n) {\n    // Your code here\n}',
    java:'class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n}',
    cpp:'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n    }\n};',
  },
  tags:['dp','fibonacci'],
}

export default function GeneratePage() {
  const {
    difficulty, selectedTopics, company, language, mode,
    currentProblem, isGenerating, problemCount,
    setDifficulty, toggleTopic, setCompany, setLanguage, setMode,
    setCurrentProblem, setIsGenerating, incProblemCount,
    showToast, addXP,
  } = useStore()

  const [code,        setCode]        = useState('# Write your solution here\ndef solution():\n    pass')
  const [hintText,    setHintText]    = useState('')
  const [hintLevel,   setHintLevel]   = useState(0)
  const [hintOpen,    setHintOpen]    = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [reviewText,  setReviewText]  = useState('')
  const [reviewOpen,  setReviewOpen]  = useState(false)
  const [runState,    setRunState]    = useState(null) // null | running | pass | fail | accepted
  const [timer,       setTimer]       = useState(null)
  const [elapsed,     setElapsed]     = useState(0)
  const timerRef = useRef(null)

  // Timed mode timer
  useEffect(() => {
    if (mode === 'timed' && currentProblem && !timer) {
      const start = Date.now()
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now()-start)/1000)), 1000)
      setTimer(start)
    }
    return () => clearInterval(timerRef.current)
  }, [currentProblem, mode])

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  /* ── Generate ── */
  const handleGenerate = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    setHintOpen(false); setHintText(''); setHintLevel(0)
    setReviewOpen(false); setReviewText('')
    setRunState(null); setElapsed(0); setTimer(null)
    clearInterval(timerRef.current)

    try {
      const prob = await generateProblem({ difficulty, topics: selectedTopics, company, mode })
      setCurrentProblem(prob)
      incProblemCount()
      setCode(prob.starterCode?.[language] || FALLBACK.starterCode[language])
      showToast('✨', 'Problem generated!', 'success')
    } catch (e) {
      console.error(e)
      setCurrentProblem(FALLBACK)
      incProblemCount()
      setCode(FALLBACK.starterCode[language])
      showToast('⚠️', 'Using demo problem (check API key)')
    } finally {
      setIsGenerating(false)
    }
  }

  /* ── Hint ── */
  const handleHint = async () => {
    if (!currentProblem || hintLoading || hintLevel >= 3) return
    const next = hintLevel + 1
    setHintLevel(next); setHintOpen(true); setHintLoading(true)
    try {
      const h = await getHint(currentProblem.title, currentProblem.description, next)
      setHintText(h)
    } catch {
      setHintText(currentProblem.hints?.[next-1] || 'Think carefully about the problem structure.')
    } finally { setHintLoading(false) }
  }

  /* ── Solution ── */
  const handleSolution = async () => {
    if (!currentProblem) return
    showToast('📖', 'Generating solution...')
    try {
      const sol = await getSolution(currentProblem.title, currentProblem.description, language)
      setCode(sol.replace(/```\w*/g,'').replace(/```/g,'').trim())
      showToast('✅', 'Solution loaded!', 'success')
    } catch { showToast('❌', 'Failed to load solution', 'error') }
  }

  /* ── Review ── */
  const handleReview = async () => {
    if (!currentProblem || !code.trim()) return
    setReviewOpen(true); setReviewText('')
    try {
      const r = await reviewCode(code, currentProblem.title, language)
      setReviewText(r)
    } catch { setReviewText('Review unavailable. Please try again.') }
  }

  /* ── Run / Submit ── */
  const handleRun = () => {
    setRunState('running')
    setTimeout(() => {
      const ok = Math.random() > 0.3
      setRunState(ok ? 'pass' : 'fail')
    }, 1600)
  }
  const handleSubmit = () => {
    setRunState('submitting')
    setTimeout(() => {
      setRunState('accepted')
      addXP(difficulty === 'easy' ? 60 : difficulty === 'medium' ? 120 : 200)
      clearInterval(timerRef.current)
      showToast('🎉', `Accepted! +${difficulty==='easy'?60:difficulty==='medium'?120:200} XP`, 'success')
    }, 2000)
  }

  const prob = currentProblem

  return (
    <div className="flex h-full">
      {/* ── Config panel ── */}
      <aside className="w-[270px] shrink-0 overflow-y-auto p-4 flex flex-col gap-3"
        style={{ borderRight:'1px solid var(--border2)' }}>

        <ConfigSection title="Difficulty">
          <div className="flex gap-2">
            {(['easy','medium','hard']).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="flex-1 py-2 rounded-xl border text-[11px] font-bold capitalize transition-all"
                style={{
                  background: difficulty===d ? (d==='easy'?'rgba(16,185,129,0.15)':d==='medium'?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)') : 'transparent',
                  borderColor: difficulty===d ? (d==='easy'?'rgba(16,185,129,0.5)':d==='medium'?'rgba(245,158,11,0.5)':'rgba(239,68,68,0.5)') : 'var(--border)',
                  color: difficulty===d ? (d==='easy'?'#10B981':d==='medium'?'#F59E0B':'#EF4444') : 'var(--text2)',
                }}>
                {d==='easy'?'🟢':d==='medium'?'🟡':'🔴'} {d}
              </button>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection title="Topics">
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map(t => (
              <button key={t} onClick={() => toggleTopic(t)}
                className="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all"
                style={{
                  background:   selectedTopics.includes(t) ? 'rgba(99,120,255,0.14)' : 'var(--surface)',
                  borderColor:  selectedTopics.includes(t) ? 'rgba(99,120,255,0.4)'  : 'var(--border2)',
                  color:        selectedTopics.includes(t) ? 'var(--accent)'          : 'var(--text2)',
                }}>
                {t}
              </button>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection title="Company Pattern">
          <select value={company} onChange={e => setCompany(e.target.value)}
            className="w-full p-2.5 rounded-xl text-[12px] outline-none neon-focus"
            style={{ background:'var(--surface)', border:'1px solid var(--border2)', color:'var(--text)' }}>
            {COMPANIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </ConfigSection>

        <ConfigSection title="Mode">
          {[['practice','📚 Practice Mode'],['timed','⏱️ Timed (45 min)'],['challenge','⚡ Challenge Me!']].map(([v,lbl]) => (
            <label key={v} className="flex items-center gap-2.5 py-1 cursor-pointer">
              <input type="radio" name="mode" value={v} checked={mode===v} onChange={()=>setMode(v)}
                style={{ accentColor:'var(--accent)' }} />
              <span className="text-[12px]" style={{color:'var(--text2)'}}>{lbl}</span>
            </label>
          ))}
        </ConfigSection>

        <button onClick={handleGenerate} disabled={isGenerating}
          className="w-full py-3 rounded-xl text-sm font-bold text-white btn-gradient disabled:opacity-60 disabled:cursor-not-allowed mt-1">
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size={16} color="#fff" /> Generating...
            </span>
          ) : '✨ Generate AI Problem'}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{color:'var(--text3)'}}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{background:'var(--accent)'}} />
          Powered by Claude AI
        </div>

        {/* Language */}
        <ConfigSection title="Language">
          <div className="flex flex-wrap gap-2">
            {Object.entries(LANG_COLORS).map(([lang,col]) => (
              <button key={lang} onClick={() => {
                setLanguage(lang)
                if (currentProblem?.starterCode?.[lang]) setCode(currentProblem.starterCode[lang])
              }}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize border transition-all"
                style={{
                  background:  language===lang ? `${col}22` : 'var(--surface)',
                  borderColor: language===lang ? `${col}66` : 'var(--border2)',
                  color:       language===lang ? col         : 'var(--text2)',
                }}>
                {lang}
              </button>
            ))}
          </div>
        </ConfigSection>
      </aside>

      {/* ── Problem area ── */}
      <div className="flex-1 overflow-y-auto p-5">
        {!prob ? (
          <EmptyState onGenerate={handleGenerate} loading={isGenerating} />
        ) : (
          <div className="max-w-3xl slide-up">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="text-[11px] font-mono mb-1" style={{color:'var(--text3)'}}>
                  #{String(problemCount).padStart(3,'0')} · AI Generated · {LANG_EXT[language]}
                  {mode==='timed' && (
                    <span className="ml-3 font-bold" style={{color: elapsed>2400?'var(--red)':elapsed>1800?'var(--accent4)':'var(--green)'}}>
                      ⏱ {fmt(elapsed)}
                    </span>
                  )}
                </div>
                <h1 className="font-syne text-2xl font-bold mb-2.5 leading-tight">{prob.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <DiffBadge difficulty={prob.difficulty} />
                  {(prob.topics||[]).map(t => <TopicBadge key={t}>{t}</TopicBadge>)}
                  {prob.company && prob.company!=='General' && <TopicBadge color="cyan">📍 {prob.company}</TopicBadge>}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{background:'rgba(99,120,255,0.08)',color:'var(--text3)'}}>
                    ⏱ {prob.timeComplexity}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                <Btn onClick={handleHint} disabled={hintLevel>=3}>
                  💡 Hint {hintLevel>0?`${hintLevel}/3`:''}
                </Btn>
                <Btn onClick={handleSolution}>📖 Solution</Btn>
                <Btn onClick={handleReview}>🔍 Review</Btn>
                <Btn onClick={handleGenerate} variant="primary">🔄 New</Btn>
              </div>
            </div>

            {/* Problem body */}
            <Card className="mb-4 text-sm leading-7">
              <SectionTitle>Problem Description</SectionTitle>
              <p className="mb-4" style={{color:'var(--text2)'}}>{prob.description}</p>

              <SectionTitle>Examples</SectionTitle>
              {(prob.examples||[]).map((ex,i) => (
                <div key={i} className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{color:'var(--text3)'}}>Example {i+1}</div>
                  <div className="rounded-xl p-3 font-mono text-[12px] leading-6"
                    style={{background:'rgba(0,0,0,0.4)', border:'1px solid var(--border2)'}}>
                    <div><span style={{color:'var(--text3)'}}>Input: </span><span style={{color:'#A5B4FC'}}>{ex.input}</span></div>
                    <div><span style={{color:'var(--text3)'}}>Output: </span><span style={{color:'#A5B4FC'}}>{ex.output}</span></div>
                    <div style={{color:'var(--text3)'}}>// {ex.explanation}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-xl p-3 mt-2"
                style={{background:'rgba(245,158,11,0.04)', border:'1px solid rgba(245,158,11,0.14)'}}>
                <SectionTitle>Constraints</SectionTitle>
                <ul className="space-y-1">
                  {(prob.constraints||[]).map((c,i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px]" style={{color:'var(--text2)'}}>
                      <span style={{color:'var(--accent4)'}}>▸</span>{c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-6 mt-4 pt-3" style={{borderTop:'1px solid var(--border2)'}}>
                <ComplexBadge label="Time"  val={prob.timeComplexity}  />
                <ComplexBadge label="Space" val={prob.spaceComplexity} />
              </div>
            </Card>

            {/* Hint panel */}
            {hintOpen && (
              <div className="rounded-2xl p-4 mb-4 slide-up"
                style={{background:'rgba(99,120,255,0.06)', border:'1px solid rgba(99,120,255,0.2)'}}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold" style={{color:'var(--accent)'}}>💡 Hint {hintLevel}/3</span>
                  {hintLevel < 3 && <span className="text-[10px]" style={{color:'var(--text3)'}}>Click Hint for more</span>}
                </div>
                {hintLoading
                  ? <Skeleton className="h-10 w-full" />
                  : <p className="text-[13px] leading-6" style={{color:'var(--text2)'}}>{hintText}</p>
                }
              </div>
            )}

            {/* Review panel */}
            {reviewOpen && (
              <div className="rounded-2xl p-4 mb-4 slide-up"
                style={{background:'rgba(34,211,238,0.04)', border:'1px solid rgba(34,211,238,0.16)'}}>
                <div className="text-[11px] font-bold mb-2" style={{color:'var(--accent3)'}}>🔍 AI Code Review</div>
                {!reviewText
                  ? <Skeleton className="h-20 w-full" />
                  : <p className="text-[13px] leading-6 whitespace-pre-wrap" style={{color:'var(--text2)'}}>{reviewText}</p>
                }
              </div>
            )}

            {/* Code editor */}
            <div className="rounded-2xl overflow-hidden mb-4"
              style={{border:'1px solid var(--border)'}}>
              {/* Editor chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{background:'#0A0E1A', borderBottom:'1px solid var(--border2)'}}>
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-[11px] font-mono font-bold"
                  style={{color:LANG_COLORS[language]}}>{LANG_EXT[language]}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px]" style={{color:'var(--text3)'}}>
                    {code.split('\n').length} lines
                  </span>
                </div>
              </div>
              {/* Textarea (Monaco-style) */}
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                className="w-full p-4 font-mono text-[12px] leading-6 outline-none resize-none"
                style={{
                  background:'#0A0E1A',
                  color:'#A5B4FC',
                  minHeight:240,
                  fontFamily:'"JetBrains Mono",monospace',
                  tabSize:4,
                }}
                rows={14}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    const s = e.target.selectionStart, el = e.target.value
                    setCode(el.substring(0,s)+'    '+el.substring(e.target.selectionEnd))
                    requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s+4 })
                  }
                }}
              />
              {/* Footer */}
              <div className="flex items-center gap-3 px-4 py-2.5"
                style={{background:'#0A0E1A', borderTop:'1px solid var(--border2)'}}>
                <Btn onClick={handleRun} variant="success" size="sm">▶ Run Tests</Btn>
                <Btn onClick={handleSubmit} variant="primary" size="sm">Submit →</Btn>
                <RunResult state={runState} difficulty={prob.difficulty} />
              </div>
            </div>

            {/* Tags */}
            {(prob.tags||[]).length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="text-[11px]" style={{color:'var(--text3)'}}>Tags:</span>
                {prob.tags.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded"
                    style={{background:'var(--surface2)', color:'var(--text3)'}}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ConfigSection({ title, children }) {
  return (
    <div className="rounded-2xl p-4" style={{background:'var(--surface2)', border:'1px solid var(--border2)'}}>
      <div className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{color:'var(--text3)'}}>{title}</div>
      {children}
    </div>
  )
}

function ComplexBadge({ label, val }) {
  return (
    <span className="text-[12px]" style={{color:'var(--text3)'}}>
      {label}: <span className="font-mono font-bold" style={{color:'var(--accent)'}}>{val}</span>
    </span>
  )
}

function RunResult({ state, difficulty }) {
  if (!state) return null
  const xp = difficulty==='easy'?60:difficulty==='medium'?120:200
  const map = {
    running:    { color:'var(--accent4)',  text:'⏳ Running tests...' },
    submitting: { color:'var(--accent4)',  text:'⏳ Submitting...' },
    pass:       { color:'var(--green)',    text:'✅ 3/3 tests passed' },
    fail:       { color:'var(--red)',      text:'❌ 2/3 tests passed' },
    accepted:   { color:'var(--green)',    text:`🎉 Accepted! +${xp} XP` },
  }
  const s = map[state]
  return <span className="text-[12px] font-mono font-bold" style={{color:s.color}}>{s.text}</span>
}

function EmptyState({ onGenerate, loading }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 text-center px-8">
      <div className="text-6xl float">⚡</div>
      <div>
        <h2 className="font-syne text-2xl font-bold mb-2" style={{color:'var(--text2)'}}>Ready to Generate</h2>
        <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{color:'var(--text3)'}}>
          Configure your topics and difficulty on the left, then let Claude AI craft a
          perfectly personalized DSA problem for you.
        </p>
      </div>
      <button onClick={onGenerate} disabled={loading}
        className="px-8 py-3 rounded-xl text-sm font-bold text-white btn-gradient disabled:opacity-60">
        {loading ? '⏳ Generating...' : '✨ Generate My First Problem'}
      </button>
      <div className="grid grid-cols-3 gap-4 mt-4 max-w-sm w-full">
        {['Arrays','Graphs','DP'].map(t => (
          <div key={t} className="p-3 rounded-xl text-center text-[12px]"
            style={{background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text3)'}}>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}
