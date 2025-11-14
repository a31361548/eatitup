"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
      body: JSON.stringify({ listId, label: label.trim(), weight })
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
    <motion.div
      className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-inner shadow-black/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm text-white/60">新增項目</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <input
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-emerald-300"
          placeholder="餐點名稱"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="w-28 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-emerald-300"
          type="number"
          min={1}
          value={Number.isNaN(weight) ? '' : weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <button
          className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          onClick={add}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '新增中…' : '新增項目'}
        </button>
      </div>
      {status === 'error' && <p className="mt-2 text-sm text-rose-300">請確認名稱與權重（需 ≥ 1）</p>}
    </motion.div>
  )
}
