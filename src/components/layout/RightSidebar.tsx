'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuxiliary } from '@/context/AuxiliaryContext'
import { SystemStatusWidget } from '@/components/dashboard/SystemStatusWidget'
import clsx from 'clsx'

export function RightSidebar() {
  const { currentView, isMobileOpen, toggleMobileMenu, data, toggleView } = useAuxiliary()
  const { data: session } = useSession()
  const currentUser = session?.user
  const playerName = currentUser?.name || '使用者'
  const coins = String(currentUser?.coins ?? 0).padStart(4, '0')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (currentView !== 'QUICK_NOTE') return
    if (!data || typeof data !== 'object') return
    const maybeTitle = (data as { title?: unknown }).title
    if (typeof maybeTitle === 'string' && !title) {
      setTitle(maybeTitle)
    }
  }, [currentView, data, title])

  const handleSave = async () => {
    setError(null)
    setSaved(false)
    if (!title.trim()) {
      setError('請輸入標題')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) throw new Error('Save failed')
      setTitle('')
      setContent('')
      setSaved(true)
    } catch (err) {
      setError('儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={clsx(
        "flex flex-col border-l border-aether-cyan/20 bg-aether-dim/95 backdrop-blur-sm fixed top-16 bottom-0 z-40 transition-transform duration-300",
        "w-[300px] right-0",
        // Desktop: Always visible
        "hidden xl:flex xl:translate-x-0",
        // Mobile: Slide in/out based on state
        isMobileOpen ? "flex translate-x-0" : "translate-x-full xl:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex h-12 items-center justify-between border-b border-aether-cyan/20 px-4 bg-aether-cyan/5">
          <span className="font-tech text-xs tracking-[0.2em] text-aether-cyan">
            輔助面板
          </span>
          <div className="flex gap-2">
             {/* Close Button (Mobile Only) */}
             <button onClick={toggleMobileMenu} className="xl:hidden text-aether-cyan/50 hover:text-aether-cyan">
               ✕
             </button>
             <div className="hidden xl:flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-aether-cyan/50" />
                <div className="h-1.5 w-1.5 rounded-full bg-aether-cyan/30" />
                <div className="h-1.5 w-1.5 rounded-full bg-aether-cyan/10" />
             </div>
          </div>
        </div>

        {/* Player Capsule */}
        {currentUser && (
          <div className="border-b border-aether-cyan/10 px-4 py-4">
            <div className="flex items-center gap-4 rounded-lg border border-aether-cyan/20 bg-aether-dark/60 px-4 py-3">
              <div className="h-11 w-11 overflow-hidden rounded-md border border-aether-cyan/40 bg-black/40 flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-aether-cyan">👤</span>
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] text-aether-mint/60 tracking-[0.25em]">身份 / PLAYER</span>
                <span className="text-sm text-white/90 tracking-widest">{playerName}</span>
              </div>
              <div className="ml-auto text-sm text-aether-gold tracking-[0.3em]">代幣 / COINS {coins}</div>
            </div>
          </div>
        )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentView === 'SYSTEM_STATUS' && (
          <div className="space-y-4">
             <div className="rounded border border-aether-cyan/20 bg-black/40 p-1">
                <SystemStatusWidget />
             </div>
              <div className="space-y-2">
                <button
                  onClick={() => toggleView('QUICK_NOTE')}
                  className="w-full rounded border border-aether-cyan/20 bg-aether-cyan/5 px-4 py-2 text-xs tracking-widest text-aether-cyan transition hover:bg-aether-cyan/20"
                >
                  快速筆記
                </button>
                <p className="text-[10px] font-tech tracking-[0.3em] text-white/40">寫入日誌</p>
              </div>

              <div className="rounded border border-white/5 bg-white/5 p-4 text-center">
                <p className="font-tech text-xs text-white/40 tracking-widest">
                  等待輸入中...
                </p>
              </div>
          </div>
        )}

        {currentView === 'QUICK_NOTE' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <h3 className="font-pixel text-lg text-aether-gold">快速筆記 / QUICK NOTE</h3>
            <div className="space-y-3">
              <label className="text-xs font-tech tracking-widest text-aether-mint/70">標題 / TITLE</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="輸入標題..."
                className="w-full rounded-lg border border-aether-cyan/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-aether-cyan focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-tech tracking-widest text-aether-mint/70">內容 / CONTENT</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="快速紀錄..."
                rows={6}
                className="w-full rounded-lg border border-aether-cyan/20 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-aether-cyan focus:outline-none"
              />
            </div>
            {error && <p className="text-xs text-aether-alert">{error}</p>}
            {saved && <p className="text-xs text-aether-mint">已儲存到日誌</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-lg border border-aether-cyan/40 bg-aether-cyan/20 px-3 py-2 text-xs tracking-widest text-aether-cyan transition hover:bg-aether-cyan hover:text-aether-dark disabled:opacity-50"
            >
              {saving ? '儲存中...' : '儲存筆記'}
            </button>
          </div>
        )}

        {currentView === 'WHEEL_PREVIEW' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <h3 className="font-pixel text-lg text-aether-cyan mb-4">輪盤連結 / WHEEL LINK</h3>
             <div className="h-40 rounded border border-aether-cyan/30 bg-aether-cyan/5 flex items-center justify-center">
               <span className="text-xs text-aether-cyan/50">輪盤模組 / WHEEL MODULE</span>
             </div>
           </div>
        )}
      </div>

      {/* Decorative Footer */}
      <div className="h-8 border-t border-aether-cyan/20 bg-black/60 flex items-center justify-center">
        <span className="font-tech text-[10px] tracking-[0.5em] text-white/20">
          安全連線 / SECURE CONNECTION
        </span>
      </div>
    </aside>
    </>
  )
}
