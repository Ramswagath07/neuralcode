import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { mentorChat, generateRoadmap } from '../services/api'
import { Spinner, Btn } from '../components/ui/primitives'

const QUICK = [
  { label:'📚 Explain DP',       text:'Explain dynamic programming with a real example I can code today.' },
  { label:'🗺️ Study Roadmap',    text:'Create a 4-week FAANG interview roadmap based on my weak areas.' },
  { label:'📊 Analyze Progress', text:'Based on my profile, what are my top 3 weaknesses and how do I fix them?' },
  { label:'🔍 Graph Problem',    text:'Give me a medium graph traversal problem with progressive hints.' },
  { label:'💡 DP Pattern',       text:'Teach me the most important DP patterns with examples: knapsack, LCS, LIS.' },
  { label:'⏱️ Interview Prep',   text:'Simulate a 30-minute Google phone screen. Ask me 2 problems.' },
]

const WELCOME = {
  role: 'assistant',
  content: `**Welcome to your NeuralCode AI Mentor session! 🚀**

I've analyzed your profile and here's what I see:

✅ **Strengths:** Arrays (80%), Strings (75%), Trees (68%)
⚠️ **Weak areas:** Dynamic Programming (25%), Graphs (38%), Tries (20%)
🔥 **Streak:** 12 days — great consistency!

I'm here to help you reach FAANG-level readiness. You can ask me to:
- Explain any DSA concept step-by-step
- Generate custom practice problems with hints
- Create a personalized study roadmap
- Review and debug your code
- Simulate technical interviews

**What would you like to work on today?**`,
}

/* ── Markdown-lite renderer ── */
function renderMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(99,120,255,0.15);padding:1px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:11px;color:#A5B4FC">$1</code>')
    .replace(/\n/g, '<br/>')
}

export default function MentorPage() {
  const { user, chatHistory, isChatLoading, addChatMessage, setChatLoading, showToast } = useStore()
  const [input, setInput]         = useState('')
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [roadmap, setRoadmap]     = useState('')
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const messages = chatHistory.length === 0 ? [WELCOME] : chatHistory

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [chatHistory, isChatLoading])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || isChatLoading) return
    setInput('')

    const userMsg = { role:'user', content:msg }
    addChatMessage(userMsg)
    setChatLoading(true)

    const history = [...(chatHistory.length ? chatHistory : [WELCOME]), userMsg]

    try {
      const reply = await mentorChat(history)
      addChatMessage({ role:'assistant', content:reply })
    } catch (e) {
      addChatMessage({ role:'assistant', content:"I'm having trouble connecting right now. Please try again in a moment! 🔄" })
    } finally {
      setChatLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleRoadmap = async () => {
    setShowRoadmap(true); setRoadmapLoading(true); setRoadmap('')
    try {
      const r = await generateRoadmap(['Dynamic Programming','Graphs','Tries'], 'FAANG', 4)
      setRoadmap(r)
    } catch { setRoadmap('Unable to generate roadmap. Please try again.') }
    finally { setRoadmapLoading(false) }
  }

  return (
    <div className="flex h-full">
      {/* ── Main chat ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 shrink-0"
          style={{ borderBottom:'1px solid var(--border2)', background:'var(--surface)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background:'linear-gradient(135deg,#0891B2,#6378FF)' }}>🤖</div>
          <div>
            <div className="text-sm font-bold">NeuralCode AI Mentor</div>
            <div className="flex items-center gap-1.5 text-[11px]" style={{color:'var(--green)'}}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{background:'var(--green)'}} />
              Online · Powered by Claude
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Btn onClick={handleRoadmap} size="sm">🗺️ Generate Roadmap</Btn>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 px-5 py-2.5 overflow-x-auto shrink-0"
          style={{ borderBottom:'1px solid var(--border2)' }}>
          {QUICK.map(({ label, text }) => (
            <button key={label} onClick={() => send(text)}
              className="shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-medium whitespace-nowrap transition-all hover:bg-[rgba(99,120,255,0.1)] hover:border-[rgba(99,120,255,0.3)] hover:text-[var(--accent)]"
              style={{ borderColor:'var(--border2)', color:'var(--text2)', background:'var(--surface2)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} content={m.content} />
          ))}
          {isChatLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 pb-4 pt-2 shrink-0" style={{ borderTop:'1px solid var(--border2)' }}>
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask your AI mentor anything about DSA... (Enter to send, Shift+Enter for newline)"
              className="flex-1 p-3 rounded-xl text-[13px] outline-none neon-focus resize-none leading-6"
              style={{
                background:'var(--surface2)', border:'1px solid var(--border)',
                color:'var(--text)', minHeight:44, maxHeight:120,
                fontFamily:'Space Grotesk,sans-serif',
              }}
              rows={1}
            />
            <button onClick={() => send()}
              disabled={isChatLoading || !input.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white btn-gradient disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0">
              {isChatLoading ? <Spinner size={16} color="#fff" /> : 'Send →'}
            </button>
          </div>
          <div className="text-[10px] mt-1.5 text-center" style={{color:'var(--text3)'}}>
            AI responses are generated — verify algorithms independently.
          </div>
        </div>
      </div>

      {/* ── Roadmap sidebar ── */}
      {showRoadmap && (
        <div className="w-80 shrink-0 flex flex-col overflow-hidden"
          style={{ borderLeft:'1px solid var(--border2)', background:'var(--surface)' }}>
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom:'1px solid var(--border2)' }}>
            <div className="text-sm font-bold">🗺️ 4-Week Roadmap</div>
            <button onClick={() => setShowRoadmap(false)}
              className="text-[var(--text3)] hover:text-[var(--text)] text-lg leading-none">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {roadmapLoading
              ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_,i) => (
                    <div key={i} className="shimmer h-12 rounded-xl" />
                  ))}
                </div>
              )
              : (
                <div className="text-[13px] leading-6 whitespace-pre-wrap" style={{color:'var(--text2)'}}>
                  {roadmap}
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}

function ChatBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 slide-up ${isUser?'flex-row-reverse':''}`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
        style={{
          background: isUser
            ? 'linear-gradient(135deg,#6378FF,#A855F7)'
            : 'linear-gradient(135deg,#0891B2,#6378FF)',
        }}>
        {isUser ? 'AK' : '🤖'}
      </div>
      {/* Bubble */}
      <div className="max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-6"
        style={isUser
          ? { background:'rgba(99,120,255,0.18)', border:'1px solid rgba(99,120,255,0.3)', color:'var(--text)', borderBottomRightRadius:4 }
          : { background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text2)', borderBottomLeftRadius:4 }
        }>
        <div dangerouslySetInnerHTML={{ __html: renderMd(content) }} />
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
        style={{ background:'linear-gradient(135deg,#0891B2,#6378FF)' }}>🤖</div>
      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background:'var(--surface2)', border:'1px solid var(--border2)', borderBottomLeftRadius:4 }}>
        <span className="w-2 h-2 rounded-full dot1" style={{background:'var(--text3)'}} />
        <span className="w-2 h-2 rounded-full dot2" style={{background:'var(--text3)'}} />
        <span className="w-2 h-2 rounded-full dot3" style={{background:'var(--text3)'}} />
      </div>
    </div>
  )
}
