"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'

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
    const res = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setLoading(false)
    if (res.ok) {
      const json = await res.json()
      router.push(`/dashboard/lists/${json.id}`)
      return
    }
    setError('建立失敗，請稍後再試')
  }

  return (
    <HoloWindow title="CREATE ORACLE SCROLL" className="mx-auto h-full max-w-3xl">
      <div className="space-y-10">
        <section className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-black/20 p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/20 bg-white/5 text-3xl">▤</div>
            <h1 className="font-pixel text-pixel-2xl uppercase tracking-[0.35em]">建立新卷軸</h1>
            <p className="text-sm text-white/70">為命運輪盤準備新的資料集，輸入名稱即可開始刻寫素材。</p>
          </div>
        </section>

        <section className="space-y-6 rounded-[32px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="space-y-2">
            <label className="text-xs font-tech uppercase tracking-[0.4em] text-white/60" htmlFor="list-title">
              卷軸名稱
            </label>
            <input
              id="list-title"
              className="w-full rounded-2xl border border-white/15 bg-black/50 p-4 font-heading text-lg text-white outline-none transition focus:border-cyan-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              placeholder="例如：午餐協定 V1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {error && <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          </div>

          <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4">
            <Link href="/dashboard/lists" className="flex-1">
              <TechButton variant="ghost" className="w-full">
                取消
              </TechButton>
            </Link>
            <div className="flex-[2]">
              <TechButton variant="primary" className="w-full" onClick={submit} disabled={loading}>
                {loading ? '建立中…' : '初始化卷軸'}
              </TechButton>
            </div>
          </div>
        </section>
      </div>
    </HoloWindow>
  )
}
