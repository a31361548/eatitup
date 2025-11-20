"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
      body: JSON.stringify({ label: label.trim(), weight })
    })
    setStatus(res.ok ? 'saved' : 'error')
    setSaving(false)
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
    <motion.li
      className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/40 p-4 text-white md:flex-row md:items-center"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <input
        className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-white outline-none focus:border-emerald-300"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <div className="flex flex-1 flex-wrap items-center gap-2 md:justify-end">
        <input
          className="w-24 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-center text-white outline-none focus:border-emerald-300"
          type="number"
          min={1}
          value={Number.isNaN(weight) ? '' : weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <button
          className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          onClick={save}
          disabled={saving}
        >
          儲存
        </button>
        <button
          className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 disabled:opacity-60"
          onClick={remove}
          disabled={saving}
        >
          刪除
        </button>
      </div>
      {status === 'error' && <p className="text-sm text-rose-300">請確認名稱與權重</p>}
      {status === 'saved' && <p className="text-sm text-emerald-300">已儲存</p>}
    </motion.li>
  )
}
