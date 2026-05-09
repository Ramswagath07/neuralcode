# ⚡ NeuralCode — AI-Powered Personalized DSA Platform

> A next-generation, production-ready coding platform that uses Claude AI to generate personalized Data Structures & Algorithms problems, coach you like a mentor, and track your progress with beautiful analytics.

![NeuralCode Screenshot](https://via.placeholder.com/1200x630/080B14/6378FF?text=NeuralCode+%E2%9A%A1+AI+DSA+Platform)

---

## 🚀 Features

| Category | Features |
|---|---|
| **AI Problem Gen** | Real-time problem generation via Claude API · topic/difficulty/company-specific |
| **Code Editor** | Syntax-aware textarea · Tab indent · multi-language (Python, JS, Java, C++) |
| **AI Mentor Chat** | Full conversational AI mentor · study roadmap generation · quick prompts |
| **Analytics** | Activity heatmap · topic mastery bars · difficulty rings · history · achievements |
| **Leaderboard** | Global rankings · podium · XP system · streak tracking |
| **UX** | Glassmorphism · animated gradients · dark/light theme · toast notifications |
| **State** | Zustand global store · persistent user profile & chat history |

---

## 📁 Project Structure

```
neuralcode/
├── src/
│   ├── components/
│   │   ├── layout/       Layout, Sidebar, TopNav
│   │   └── ui/           Toast, primitives (Card, Ring, Badge, Btn, Spinner…)
│   ├── pages/
│   │   ├── GeneratePage.jsx    ← AI problem generation + editor
│   │   ├── AnalyticsPage.jsx   ← Dashboard, charts, heatmap
│   │   ├── MentorPage.jsx      ← AI chat mentor + roadmap
│   │   └── LeaderboardPage.jsx ← Rankings + achievements
│   ├── services/
│   │   └── api.js         ← All Claude API calls (generate, hint, solution, chat, roadmap)
│   ├── store/
│   │   └── useStore.js    ← Zustand global state
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Install dependencies
```bash
cd neuralcode
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```
Edit `.env` and add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ **For production**, never expose your API key in the frontend. Proxy all API calls through your backend (see Backend section below).

### 3. Run dev server
```bash
npm run dev
```
Open http://localhost:5173

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 🔑 API Key Setup

The app calls the Anthropic API directly from the browser (for demo purposes). The API key is handled by the browser proxy in claude.ai.

**For production deployment**, create a backend proxy:

```js
// backend/server.js (Express example)
app.post('/api/claude', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  })
  const data = await response.json()
  res.json(data)
})
```

Then update `src/services/api.js` to point to your backend:
```js
const API_URL = '/api/claude' // instead of the direct Anthropic URL
```

---

## 🌐 Deployment

### Frontend — Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
```

### Frontend — Netlify
```bash
npm run build
# drag & drop `dist/` folder to netlify.com
```

### Backend — Railway / Render
```bash
# push your express proxy server
railway up
```

---

## 🐳 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "dist", "-p", "3000"]
```

```bash
docker build -t neuralcode .
docker run -p 3000:3000 neuralcode
```

---

## 🧩 Full Backend (FastAPI)

For a production backend, create `backend/main.py`:

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic

app = FastAPI(title="NeuralCode API")
app.add_middleware(CORSMiddleware, allow_origins=["*"])
client = Anthropic()

@app.post("/api/generate-problem")
async def generate_problem(payload: dict):
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": payload["prompt"]}]
    )
    return {"content": response.content[0].text}
```

```bash
pip install fastapi uvicorn anthropic
uvicorn main:app --reload
```

---

## 🗄️ Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problems
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')),
  topics TEXT[],
  content JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  problem_id UUID REFERENCES problems(id),
  code TEXT,
  language TEXT,
  result TEXT,
  runtime_ms INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📱 Mobile (React Native / Flutter)

The service layer (`src/services/api.js`) is framework-agnostic. To convert to React Native:
1. Replace HTML elements with RN equivalents (`View`, `Text`, `TextInput`)
2. Use `AsyncStorage` instead of Zustand persist
3. Use `react-navigation` instead of `react-router-dom`
4. The API service stays identical

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | Zustand |
| Charts | Recharts |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Routing | React Router v6 |
| Icons | Lucide React |
| Backend (optional) | FastAPI / Express + PostgreSQL |
| Auth (optional) | JWT + OAuth (GitHub/Google) |
| Deployment | Vercel + Railway / AWS |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free for personal and commercial use.

---

**Built with ❤️ using React + Claude AI**
