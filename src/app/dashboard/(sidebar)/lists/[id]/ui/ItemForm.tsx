"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TechButton } from '@/components/ui/TechButton'

export default function ItemForm({ listId }: { listId: string }): React.ReactElement {
  const [label, setLabel] = useState('')
  const [weight, setWeight] = useState<number>(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const router = useRouter()

  const add = async (): Promise<void> => {
    if (!label.trim() || weight < 1) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, label: label.trim(), weight }),
    })
    if (!res.ok) {
      setStatus('error')
      return
    }
    setLabel('')
    setWeight(1)
    setStatus('idle')
    router.refresh()
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-black/30 p-5 text-white shadow-[inset_0_0_25px_rgba(0,0,0,0.4)]">
      <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">新增素材</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <input
          className="flex-1 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-samurai-blue"
          placeholder="項目名稱"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="w-28 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-center text-white outline-none transition focus:border-samurai-blue"
          type="number"
          min={1}
          value={Number.isNaN(weight) ? '' : weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <TechButton variant="primary" className="!px-6 !py-3" onClick={add} disabled={status === 'loading'}>
          {status === 'loading' ? '新增中…' : '新增'}
        </TechButton>
      </div>
      {status === 'error' && <p className="mt-2 text-sm text-samurai-red">請確認名稱與權重（需 ≥ 1）</p>}
    </div>
  )
}
