"use client"

import { useState } from 'react'

type Props = {
  listId: string
  initialTitle: string
}

export default function ListTitleEditor({ listId, initialTitle }: Props): React.ReactElement {
  const [title, setTitle] = useState(initialTitle)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const save = async (): Promise<void> => {
    if (!title.trim()) return
    setStatus('saving')
    const res = await fetch(`/api/lists/${listId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() })
    })
    setStatus(res.ok ? 'saved' : 'error')
    setTimeout(() => setStatus('idle'), 1600)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-inner shadow-black/20">
      <label className="text-sm text-white/60" htmlFor="list-title-editor">清單標題</label>
      <div className="mt-3 flex flex-wrap gap-3">
        <input
          id="list-title-editor"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-lg font-medium text-white outline-none focus:border-emerald-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          onClick={save}
          disabled={status === 'saving'}
        >
          {status === 'saving' ? '儲存中…' : status === 'saved' ? '已儲存' : '儲存標題'}
        </button>
      </div>
      {status === 'error' && <p className="mt-2 text-sm text-rose-300">儲存失敗，請稍後再試</p>}
    </div>
  )
}
