"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'
import { ElvenWheel } from '@/components/ElvenWheel'
import { ForgeArchive } from '@/components/ForgeArchive'

const DEFAULT_OPTIONS = ['龍息寶庫', '弒君審判', '鳳凰之焰', '虛空旅者', '聖耀裁決', '鋼鐵意志']

export default function WheelPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const itemsParam = sp.get('items')

  const [input, setInput] = useState(DEFAULT_OPTIONS.join('\n'))
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    if (itemsParam) {
      const list = itemsParam.split(',').map((item) => item.trim()).filter(Boolean)
      if (list.length > 0) {
        setInput(list.join('\n'))
      }
    }
  }, [itemsParam])

  const options = input.split('\n').filter((line) => line.trim().length > 0)

  const handleSpinStart = () => {
    if (options.length < 2) return
    setIsSpinning(true)
    setWinner(null)
  }

  const handleSpinEnd = (result: string) => {
    setIsSpinning(false)
    setWinner(result)
  }

  return (
    <HoloWindow
      title="PROBABILITY ENGINE"
      className="h-full"
      controls={
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <TechButton variant="ghost" className="!px-4 !py-2" onClick={() => router.back()}>
            返回
          </TechButton>
          <Link href="/dashboard/lists" className="inline-flex">
            <TechButton as="span" variant="secondary" className="!px-4 !py-2">
              清單
            </TechButton>
          </Link>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="relative flex min-h-[520px] flex-col items-center justify-center rounded-[34px] border border-white/10 bg-gradient-to-b from-white/5 to-black/30 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.2),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(251,191,36,0.15),transparent_60%)]" />
          </div>
          <div className="relative z-10 w-full max-w-2xl">
            <ElvenWheel options={options} isSpinning={isSpinning} onSpinEnd={handleSpinEnd} />
          </div>
          {winner && !isSpinning && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div
                className="w-full max-w-xl cursor-pointer rounded-[24px] border border-cyan-300/40 bg-black/80 p-8 text-center shadow-[0_0_80px_rgba(6,182,212,0.45)]"
                onClick={() => setWinner(null)}
              >
                <p className="font-tech text-xs uppercase tracking-[0.4em] text-cyan-200/80">Target Acquired</p>
                <h2 className="mt-4 text-4xl font-heading">{winner}</h2>
                <p className="mt-2 text-sm text-white/70">點擊關閉以繼續抽選</p>
              </div>
            </div>
          )}
        </section>
        <section className="space-y-6 rounded-[34px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div>
            <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">輸入素材</p>
            <p className="text-sm text-white/70">每行代表一個項目，可從左側清單快速帶入。</p>
          </div>
          <ForgeArchive input={input} setInput={setInput} isSpinning={isSpinning} onSpin={handleSpinStart} optionsCount={options.length} />
        </section>
      </div>
    </HoloWindow>
  )
}
