"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PageShell } from '@/components/ui/PageShell'

const defaults = ['鍋燒意麵', '鹽酥雞', '生魚片', '韓式年糕']

export default function DrawPage(): React.ReactElement {
  const sp = useSearchParams()
  const itemsParam = sp.get('items')
  const items = useMemo(() => {
    const arr = itemsParam ? itemsParam.split(',').map((item) => item.trim()).filter(Boolean) : defaults
    return arr.length > 0 ? arr : defaults
  }, [itemsParam])
  const [picked, setPicked] = useState<string | null>(null)
  const [drawing, setDrawing] = useState(false)

  const draw = (): void => {
    setDrawing(true)
    setPicked(null)
    const index = Math.floor(Math.random() * items.length)
    setTimeout(() => {
      setPicked(items[index])
      setDrawing(false)
    }, 900)
  }

  return (
    <PageShell className="space-y-12 text-white">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Draw Mode</p>
        <h1 className="text-3xl font-semibold">抽籤模式</h1>
        <p className="text-white/70">適合手機快速決定，按下一次就隨機挑出一個結果。</p>
      </header>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex h-64 w-full max-w-md items-center justify-center">
            <motion.div
              className="h-48 w-72 rounded-[32px] border border-white/10 bg-white/5 p-8 text-center text-3xl font-semibold text-white shadow-[0_0_60px_rgba(15,23,42,0.6)]"
              animate={drawing ? { rotateY: [0, 90, 0] } : { rotateY: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={picked ?? 'placeholder'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {picked ?? (drawing ? '抽籤中…' : '按下按鈕開始')}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
          <button
            className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-8 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
            onClick={draw}
            disabled={drawing}
          >
            {drawing ? '抽籤中…' : '抽一個'}
          </button>
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">候選列表</h2>
          <p className="text-sm text-white/70">這裡會顯示目前參與抽籤的項目，從清單帶入時會自動同步。</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-white/80">
                {item}
              </span>
            ))}
          </div>
          <Link className="inline-flex rounded-full border border-white/30 px-4 py-2 text-sm text-white/80 hover:bg-white/10" href="/lists">
            回到清單管理
          </Link>
        </aside>
      </section>
    </PageShell>
  )
}
