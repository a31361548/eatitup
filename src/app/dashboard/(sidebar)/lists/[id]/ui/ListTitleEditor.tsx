"use client"

import { useState } from 'react'
import { TechButton } from '@/components/ui/TechButton'

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
      body: JSON.stringify({ title: title.trim() }),
    })
    setStatus(res.ok ? 'saved' : 'error')
    setTimeout(() => setStatus('idle'), 1600)
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-black/30 p-5 text-white shadow-[inset_0_0_25px_rgba(0,0,0,0.4)]">
      <label className="text-xs font-tech uppercase tracking-[0.4em] text-white/60" htmlFor="list-title-editor">
        卷軸標題
      </label>
      <div className="mt-3 flex flex-wrap gap-3">
        <input
          id="list-title-editor"
          className="flex-1 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-lg font-heading text-white outline-none transition focus:border-cyan-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TechButton variant="primary" className="!px-6 !py-3 text-[11px]" onClick={save} disabled={status === 'saving'}>
          {status === 'saving' ? '儲存中…' : status === 'saved' ? '已儲存' : '儲存標題'}
        </TechButton>
      </div>
      {status === 'error' && <p className="mt-2 text-sm text-red-200">儲存失敗，請稍後再試</p>}
    </div>
  )
}
