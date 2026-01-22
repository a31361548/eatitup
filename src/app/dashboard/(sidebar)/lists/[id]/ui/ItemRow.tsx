"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TechButton } from '@/components/ui/TechButton'

type Props = { item: { id: string; label: string; weight: number } }

export default function ItemRow({ item }: Props): React.ReactElement {
  const [label, setLabel] = useState(item.label)
  const [weight, setWeight] = useState<number>(item.weight)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'error' | 'saved'>('idle')
  const router = useRouter()

  const save = async (): Promise<void> => {
    if (!label.trim() || weight < 1) {
      setStatus('error')
      return
    }
    setSaving(true)
    const res = await fetch(`/api/items/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label.trim(), weight }),
    })
    setSaving(false)
    setStatus(res.ok ? 'saved' : 'error')
    if (res.ok) {
      setTimeout(() => setStatus('idle'), 1500)
    }
  }

  const remove = async (): Promise<void> => {
    setSaving(true)
    const res = await fetch(`/api/items/${item.id}`, { method: 'POST', body: new URLSearchParams({ _method: 'DELETE' }) })
    setSaving(false)
    if (res.ok) router.refresh()
  }

  return (
    <li className="rounded-[28px] border border-white/10 bg-black/25 p-4 text-white shadow-[inset_0_0_25px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="flex-1 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-samurai-blue"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 md:justify-end">
          <input
            className="w-24 rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-center text-white outline-none focus:border-samurai-blue"
            type="number"
            min={1}
            value={Number.isNaN(weight) ? '' : weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
          <TechButton variant="secondary" className="!px-4 !py-2 text-[11px]" onClick={save} disabled={saving}>
            儲存
          </TechButton>
          <TechButton variant="danger" className="!px-4 !py-2 text-[11px]" onClick={remove} disabled={saving}>
            刪除
          </TechButton>
        </div>
      </div>
      {status === 'error' && <p className="mt-2 text-sm text-samurai-red">請確認名稱與權重</p>}
      {status === 'saved' && <p className="mt-2 text-sm text-samurai-success">已儲存</p>}
    </li>
  )
}
