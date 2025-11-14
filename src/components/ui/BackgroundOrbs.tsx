"use client"

import { motion } from 'framer-motion'

type OrbConfig = {
  size: number
  color: string
  top: string
  left: string
  duration: number
  scale: number
  delay: number
}

const orbs: OrbConfig[] = [
  { size: 420, color: 'rgba(56,189,248,0.25)', top: '-80px', left: '-120px', duration: 16, scale: 1.4, delay: 0 },
  { size: 360, color: 'rgba(16,185,129,0.25)', top: '20%', left: '60%', duration: 18, scale: 1.6, delay: 2 },
  { size: 300, color: 'rgba(244,114,182,0.2)', top: '60%', left: '10%', duration: 14, scale: 1.5, delay: 1 }
]

export function BackgroundOrbs(): React.ReactElement {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {orbs.map((orb, index) => (
        <motion.span
          key={index}
          className="absolute block rounded-full blur-[110px]"
          style={{ width: orb.size, height: orb.size, background: orb.color, top: orb.top, left: orb.left }}
          animate={{ scale: [1, orb.scale, 1], opacity: [0.6, 0.35, 0.6] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_55%)]" />
    </div>
  )
}
