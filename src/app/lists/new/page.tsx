"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/ui/PageShell'

export default function NewListPage(): React.ReactElement {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const submit = async (): Promise<void> => {
    if (!title.trim()) {
      setError('請輸入清單名稱')
      return
    }
    setLoading(true)
    setError(null)
    const res = await fetch('/api/lists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
    setLoading(false)
    if (res.ok) {
      const json = await res.json()
      router.push(`/lists/${json.id}`)
      return
    }
    setError('建立失敗，請稍後再試')
  }

  return (
    <PageShell className="flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-[0_0_60px_rgba(15,23,42,0.45)]">
        <header className="space-y-2 text-center">
          <p className="text-sm text-white/60">List Builder</p>
          <h1 className="text-3xl font-semibold">建立新的餐點清單</h1>
          <p className="text-white/60">建議將不同情境分開，例如「午餐」、「聚餐」、「團隊下午茶」。</p>
        </header>
        <div className="space-y-3">
          <label className="text-sm text-white/70" htmlFor="list-title">清單名稱</label>
          <input
            id="list-title"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-emerald-300 focus:bg-slate-900/40"
            placeholder="例：週五團隊午餐"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>
        <button
          className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          onClick={submit}
          disabled={loading}
        >
          {loading ? '建立中…' : '建立清單'}
        </button>
      </div>
    </PageShell>
  )
}
