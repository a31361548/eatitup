"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PageShell } from '@/components/ui/PageShell'

const defaultItems = ['牛肉麵', '壽司', '咖哩', '火鍋', '炸雞', '沙拉']

export default function WheelPage(): React.ReactElement {
  const sp = useSearchParams()
  const itemsParam = sp.get('items')
  const items = useMemo(() => {
    const list = itemsParam ? itemsParam.split(',').map((item) => item.trim()).filter(Boolean) : defaultItems
    return list.length > 0 ? list : defaultItems
  }, [itemsParam])
  const [rotation, setRotation] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const segment = 360 / items.length
  const wheelBackground = useMemo(() => {
    return items
      .map((_, index) => {
        const start = index * segment
        const end = start + segment
        const color = `hsl(${(index * 50) % 360} 70% 60%)`
        return `${color} ${start}deg ${end}deg`
      })
      .join(',')
  }, [items, segment])

  const spin = (): void => {
    setSpinning(true)
    setSelected(null)
    const index = Math.floor(Math.random() * items.length)
    const center = index * segment + segment / 2
    const offset = 90
    const final = 5 * 360 + (360 + offset - center)
    setRotation(final)
    setTimeout(() => {
      setSpinning(false)
      setSelected(items[index])
    }, 2600)
  }

  return (
    <PageShell className="space-y-12 text-white">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Wheel Mode</p>
        <h1 className="text-3xl font-semibold">轉盤模式</h1>
        <p className="text-white/70">透過動畫轉盤讓決定更有儀式感。可從清單直接帶入項目，或使用下方預設範例先體驗。</p>
      </header>
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative mt-4 flex h-80 w-80 items-center justify-center md:h-96 md:w-96">
            <div className="absolute left-1/2 top-8 -translate-x-1/2 text-2xl drop-shadow-lg">⬇</div>
            <motion.div
              className="h-full w-full rounded-full border-[14px] border-white/10 bg-slate-950 shadow-[0_0_80px_rgba(15,23,42,0.8)]"
              style={{ background: `conic-gradient(${wheelBackground})` }}
              animate={{ rotate: rotation }}
              transition={{ duration: 2.6, ease: [0.17, 0.67, 0.32, 1.3] }}
            />
            <div className="absolute inset-6 rounded-full border border-white/10" />
          </div>
          <button
            className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-8 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
            onClick={spin}
            disabled={spinning}
          >
            {spinning ? '抽選中…' : '開始抽'}
          </button>
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected}
                className="min-h-[60px] rounded-3xl border border-white/10 bg-white/5 px-8 py-4 text-center text-2xl font-semibold text-emerald-200"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                {selected}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">候選項目</h2>
          <p className="text-sm text-white/70">從清單頁點選「直接轉盤」即可帶著自訂項目進入此頁。</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm text-white/80">
                {item}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white/70">
            <p>權重設定會在清單頁處理，轉盤畫面只負責呈現動畫。需要修改項目？</p>
            <Link className="mt-2 inline-flex rounded-full border border-white/30 px-4 py-2 text-white hover:bg-white/10" href="/lists">
              返回清單管理
            </Link>
          </div>
        </aside>
      </section>
    </PageShell>
  )
}
