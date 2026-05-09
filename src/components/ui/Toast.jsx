import React from 'react'
import { useStore } from '../../store/useStore'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const bg = toast.type === 'success' ? 'rgba(16,185,129,0.15)'
           : toast.type === 'error'   ? 'rgba(239,68,68,0.15)'
           : 'var(--surface2)'
  const border = toast.type === 'success' ? 'rgba(16,185,129,0.35)'
               : toast.type === 'error'   ? 'rgba(239,68,68,0.35)'
               : 'var(--border)'

  return (
    <div className="fixed top-16 right-5 z-50 toast-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm max-w-xs"
        style={{ background:bg, border:`1px solid ${border}`,
          color:'var(--text)', boxShadow:'0 12px 40px rgba(0,0,0,0.5)', backdropFilter:'blur(20px)' }}>
        <span className="text-lg">{toast.icon}</span>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  )
}
