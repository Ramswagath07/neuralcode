// All Anthropic API calls are routed through this service.
// In production, proxy these through your backend to protect the API key.

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = 'claude-sonnet-4-20250514'

async function callClaude(messages, system = '', maxTokens = 1000) {
  const body = { model: MODEL, max_tokens: maxTokens, messages }
  if (system) body.system = system

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.content.map(c => c.text || '').join('')
}

/* ─── Problem generation ─── */
export async function generateProblem({ difficulty, topics, company, mode }) {
  const topicStr    = topics.length ? topics.join(', ') : 'Arrays, Dynamic Programming'
  const companyNote = company ? ` This problem should match patterns commonly asked at ${company}.` : ''
  const modeNote    = mode === 'challenge' ? ' Make it creative and non-obvious — something that tests deep insight.'
                    : mode === 'timed'    ? ' Keep complexity appropriate for a 45-minute timed contest.'
                    : ''

  const prompt = `Generate a ${difficulty} difficulty DSA problem focused on: ${topicStr}.${companyNote}${modeNote}

Return ONLY valid JSON (no markdown fences, no preamble) exactly matching this schema:
{
  "title": "string",
  "difficulty": "${difficulty}",
  "topics": ["string"],
  "company": "string or General",
  "description": "2-3 sentence clear problem statement",
  "examples": [
    { "input": "string", "output": "string", "explanation": "string" },
    { "input": "string", "output": "string", "explanation": "string" }
  ],
  "constraints": ["string"],
  "timeComplexity":  "O(?)",
  "spaceComplexity": "O(?)",
  "starterCode": {
    "python":     "def solution(...):\n    pass",
    "javascript": "function solution(...) {\n\n}",
    "java":       "class Solution {\n    public ... solution(...) {\n    }\n}",
    "cpp":        "class Solution {\npublic:\n    ... solution(...) {\n    }\n};"
  },
  "hints": ["gentle nudge", "algorithm hint", "step outline"],
  "tags": ["string"]
}`

  const raw   = await callClaude([{ role: 'user', content: prompt }])
  const clean = raw.replace(/```json?/g,'').replace(/```/g,'').trim()
  return JSON.parse(clean)
}

/* ─── Progressive hints ─── */
export async function getHint(title, description, level) {
  const levelDesc = level === 1 ? 'A gentle nudge about the approach without naming the algorithm.'
                  : level === 2 ? 'Name the specific algorithm or data structure to use and why.'
                  : 'Outline the key algorithmic steps in order (no code).'

  return callClaude([{ role: 'user', content:
    `Hint level ${level}/3 for DSA problem "${title}":\n${description}\n\nHint type: ${levelDesc}\n\nReturn ONLY the hint text, nothing else.`
  }])
}

/* ─── Solution generation ─── */
export async function getSolution(title, description, language) {
  return callClaude([{ role: 'user', content:
    `Write a clean, well-commented ${language} solution for:\n\nTitle: ${title}\nDescription: ${description}\n\nRequirements:\n- Optimal complexity\n- Inline comments explaining logic\n- Complexity analysis as a comment at the end\n\nReturn ONLY the code, no markdown fences.`
  }])
}

/* ─── AI code review ─── */
export async function reviewCode(code, title, language) {
  return callClaude([{ role: 'user', content:
    `Review this ${language} solution for "${title}":\n\n${code}\n\nProvide:\n1. ✅ Correctness\n2. ⏱ Time & space complexity\n3. 💡 One key improvement\n4. ⭐ Score /10\n\nBe concise (under 180 words).`
  }])
}

/* ─── AI Mentor chat ─── */
const MENTOR_SYSTEM = `You are NeuralCode AI Mentor — an expert DSA coach for FAANG interview prep.

Student profile:
• 247 problems solved, 78% accuracy
• Weak areas: Dynamic Programming, Graphs, Tries
• Strong areas: Arrays, Strings, Binary Search
• Current streak: 12 days | Goal: FAANG readiness

Your style:
• Warm, encouraging, and specific
• Use concrete code snippets when helpful (use backtick blocks)
• Reference the student's profile when relevant
• Always give time/space complexity for algorithms
• Keep replies focused and under 250 words unless asked for detail`

export async function mentorChat(history) {
  return callClaude(history, MENTOR_SYSTEM, 1000)
}

/* ─── Study roadmap ─── */
export async function generateRoadmap(weakTopics, company, weeks) {
  return callClaude([{ role: 'user', content:
    `Create a ${weeks}-week DSA study roadmap for someone targeting ${company || 'FAANG'} with weak areas: ${weakTopics.join(', ')}.\n\nFormat: week-by-week plan with focus topic, 3-4 specific problems to solve, and one key resource.\nBe concrete and actionable.`
  }], '', 1000)
}
