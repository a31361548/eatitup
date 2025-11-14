"use client"

import { motion } from 'framer-motion'

const heroItems = ['麻辣鍋', '壽司', '燉飯', '燒肉', '韓式炸雞', '越式河粉']
const wheelParts = heroItems.map((item, index) => {
  const start = (360 / heroItems.length) * index
  const end = start + 360 / heroItems.length
  const hue = Math.round(120 + index * (360 / heroItems.length))
  return { item, start, end, color: `hsl(${hue} 75% 60%)` }
})

export function HeroShowcase(): React.ReactElement {
  return (
    <div className="relative isolate grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
      <motion.div
        className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-white/20 bg-slate-900/40 p-6 shadow-[0_0_60px_rgba(15,23,42,0.5)]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
      >
        <div
          className="h-full w-full rounded-full border-8 border-slate-900 shadow-inner"
          style={{ background: `conic-gradient(${wheelParts.map(p => `${p.color} ${p.start}deg ${p.end}deg`).join(',')})` }}
        />
        <span className="absolute top-2 left-1/2 block -translate-x-1/2 text-lg">⬇</span>
      </motion.div>
      <motion.div
        className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
        }}
      >
        <p className="text-sm font-medium text-emerald-300">今天吃什麼？</p>
        <ul className="mt-4 space-y-2 text-base text-white/80">
          {heroItems.map((item) => (
            <motion.li
              key={item}
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <span>{item}</span>
              <span className="text-sm text-white/60">候選</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}
