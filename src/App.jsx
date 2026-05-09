import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import GeneratePage    from './pages/GeneratePage'
import AnalyticsPage   from './pages/AnalyticsPage'
import MentorPage      from './pages/MentorPage'
import LeaderboardPage from './pages/LeaderboardPage'
import Toast           from './components/ui/Toast'

export default function App() {
  return (
    <div className="relative h-full w-full" style={{ background:'var(--bg)', color:'var(--text)' }}>
      {/* Ambient background */}
      <div className="bg-grid" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full"
          style={{ width:600, height:600, top:-150, left:-150,
            background:'radial-gradient(circle, rgba(99,120,255,0.11) 0%, transparent 70%)', filter:'blur(80px)' }} />
        <div className="absolute rounded-full"
          style={{ width:500, height:500, bottom:-100, right:-100,
            background:'radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)', filter:'blur(80px)' }} />
        <div className="absolute rounded-full"
          style={{ width:350, height:350, top:'45%', left:'50%',
            background:'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', filter:'blur(80px)' }} />
      </div>

      {/* App shell */}
      <div className="relative z-10 flex flex-col h-full">
        <Layout>
          <Routes>
            <Route path="/"             element={<Navigate to="/generate" replace />} />
            <Route path="/generate"     element={<GeneratePage />} />
            <Route path="/analytics"    element={<AnalyticsPage />} />
            <Route path="/mentor"       element={<MentorPage />} />
            <Route path="/leaderboard"  element={<LeaderboardPage />} />
            <Route path="*"             element={<Navigate to="/generate" replace />} />
          </Routes>
        </Layout>
      </div>

      <Toast />
    </div>
  )
}
