"use client"

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { PageShell } from '@/components/ui/PageShell'
import { ModeInput } from '@/components/ModeInput'
import { ModeSwitcher } from '@/components/modes/ModeSwitcher'

const defaultItems = ['牛肉麵', '壽司', '咖哩', '火鍋', '炸雞', '沙拉']
const wheelColors = ['#9d4edd', '#5a189a', '#7b2cbf', '#3c096c', '#560bad', '#4361ee']

export default function WheelPage(): React.ReactElement {
  const sp = useSearchParams()
  const itemsParam = sp.get('items')
  
  const [items, setItems] = useState<string[]>([])
  const [rotation, setRotation] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])
  
  const wheelRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const list = itemsParam ? itemsParam.split(',').map((item) => item.trim()).filter(Boolean) : defaultItems
    setItems(list.length > 0 ? list : defaultItems)
  }, [itemsParam])

  const spin = (): void => {
    if (items.length === 0 || spinning) return
    setSpinning(true)
    setSelected(null)
    setConfetti([])
    
    const index = Math.floor(Math.random() * items.length)
    const segmentAngle = 360 / items.length
    const targetAngle = 270 - (index + 0.5) * segmentAngle
    const spins = 5
    const totalRotation = rotation + (360 * spins) + (targetAngle - (rotation % 360))
    
    // GSAP animation for smooth physics
    if (wheelRef.current) {
      gsap.to(wheelRef.current, {
        rotation: totalRotation,
        duration: 4,
        ease: 'power4.out',
        onComplete: () => {
          setRotation(totalRotation)
          setSpinning(false)
          setSelected(items[index])
          triggerConfetti()
        }
      })
    }
  }

  const triggerConfetti = () => {
    const particles: Array<{ id: number; x: number; y: number; color: string }> = []
    const colors = ['#6366f1', '#c084fc', '#38bdf8', '#a855f7', '#7dd3fc']
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    setConfetti(particles)
    
    setTimeout(() => {
      setConfetti([])
    }, 3000)
  }

  return (
    <PageShell className="space-y-12 text-white">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Wheel Mode</p>
            <h1 className="text-3xl font-semibold">轉盤模式</h1>
          </div>
          <Link className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10" href="/dashboard">
            返回會員中心
          </Link>
        </div>
        <ModeSwitcher active="wheel" />
      </header>
      
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative overflow-hidden rounded-[40px] border border-[#6366f1]/40 bg-gradient-to-br from-[#0f172a]/90 via-[#1e1b4b]/90 to-[#0a1027]/95 p-8 shadow-[0_60px_140px_rgba(15,23,42,0.7)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-4 h-64 w-64 rounded-full bg-[#7c3aed]/30 blur-[140px]" />
            <div className="absolute -bottom-20 left-4 h-64 w-64 rounded-full bg-[#38bdf8]/25 blur-[150px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_60%)]" />
          </div>
          <div className="relative flex flex-col items-center gap-8">
            <div className="text-center text-indigo-100/90">
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">Lucky Spin</p>
              <p className="text-base text-indigo-50/90">把所有靈感放上轉盤，讓好運來決定！</p>
            </div>
            <div className="relative flex w-full flex-col items-center gap-8">
              <div className="relative flex aspect-square w-full max-w-[360px] items-center justify-center sm:max-w-[420px] md:max-w-[500px]">
                {/* Pointer/Ticker */}
                <div 
                  ref={tickerRef}
                  className="absolute -top-8 z-30 flex flex-col items-center text-[#c084fc] drop-shadow-2xl"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-200/70">pick</span>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#c084fc]/40 blur-md" />
                    <div className="relative text-5xl">▼</div>
                  </div>
                </div>
            
            {/* Wheel */}
                <div 
                  ref={wheelRef}
                  className="relative h-full w-full rounded-full border-4 border-[#fbbf24]/70 bg-[#7c1515]/70 p-4"
                  style={{ transformOrigin: 'center center' }}
                >
                  <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)]">
                    <circle cx="50" cy="50" r="50" fill="url(#wheelGlow)" opacity="0.35" />
                    <defs>
                      <radialGradient id="wheelGlow">
                        <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="centerGrad">
                        <stop offset="0%" stopColor="#fff7ed" />
                        <stop offset="100%" stopColor="#fdba74" />
                      </linearGradient>
                    </defs>

                {items.map((item, i) => {
                  const angle = 360 / items.length
                  const startAngle = i * angle
                  const endAngle = (i + 1) * angle
                  
                  const r = 50
                  const cx = 50
                  const cy = 50
                  
                  const startRad = (startAngle * Math.PI) / 180
                  const endRad = (endAngle * Math.PI) / 180
                  
                  const x1 = cx + r * Math.cos(startRad)
                  const y1 = cy + r * Math.sin(startRad)
                  const x2 = cx + r * Math.cos(endRad)
                  const y2 = cy + r * Math.sin(endRad)
                  
                  const largeArc = angle > 180 ? 1 : 0
                  const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
                  const midAngle = startAngle + angle / 2
                  
                  const color = wheelColors[i % wheelColors.length]
                  return (
                    <g key={i}>
                      <path 
                        d={path} 
                        fill={color}
                        stroke="rgba(255,255,255,0.25)" 
                        strokeWidth="0.5"
                        filter="drop-shadow(0 1px 4px rgba(0,0,0,0.3))"
                      />
                      <g transform={`translate(50,50) rotate(${midAngle}) translate(35,0)`}>
                        <text
                          fill="white"
                          fontSize="3.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                          }}
                        >
                          {item.length > 8 ? item.slice(0, 8) + '...' : item}
                        </text>
                      </g>
                    </g>
                  )
                })}
                
                <circle cx="50" cy="50" r="8" fill="url(#centerGrad)" stroke="#fef3c7" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Confetti */}
                {confetti.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      backgroundColor: particle.color
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0.5],
                      opacity: [1, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: Math.random() * 300 + 100
                    }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                ))}
              </div>

              <button
                className="w-full max-w-sm rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-10 py-4 text-xl font-bold text-slate-900 shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60 sm:max-w-none sm:px-12 active:scale-95"
                onClick={spin}
                disabled={spinning || items.length < 2}
              >
                {spinning ? '抽選中…' : '開始轉動'}
              </button>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-indigo-100/70">
                <span className="rounded-full border border-white/20 px-3 py-1">目前項目 {items.length} 個</span>
                <span className="rounded-full border border-white/20 px-3 py-1">動畫 4 秒</span>
              </div>

              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected}
                    className="absolute left-1/2 top-1/2 z-40 w-full max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-[#fbbf24]/60 bg-[#2b0909]/95 px-6 py-5 text-center backdrop-blur-xl shadow-2xl sm:max-w-md sm:px-8 sm:py-6"
                    initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <p className="mb-2 text-sm text-amber-100/70">結果是</p>
                    <p className="text-3xl font-bold text-[#facc15]">{selected}</p>
                    <button 
                      onClick={() => setSelected(null)}
                      className="mt-4 text-sm text-white/70 hover:text-amber-100 underline transition-colors"
                    >
                      關閉
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <aside className="space-y-6">
          <ModeInput currentItems={items} onUpdate={setItems} className="rounded-[32px] border-[#7c3aed]/40 bg-[#0f172a]/80 shadow-[0_25px_80px_rgba(15,23,42,0.55)]" />
          
          <div className="rounded-[32px] border border-[#6366f1]/30 bg-[#111827]/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.5)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-indigo-100">當前項目 ({items.length})</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">Live list</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {items.map((item, i) => (
                <span 
                  key={`${item}-${i}`} 
                  className="rounded-full border border-white/20 bg-[#1f2937]/70 px-3 py-1 text-sm text-indigo-50/90 transition-all hover:scale-105" 
                  style={{ borderColor: `hsl(${(i * 360) / items.length}, 70%, 60%)` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  )
}
