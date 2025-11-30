import React from 'react'
import clsx from 'clsx'

interface HoloWindowProps {
  children: React.ReactNode
  title?: string
  className?: string
  controls?: React.ReactNode
}

export function HoloWindow({ children, title, className = '', controls }: HoloWindowProps) {
  return (
    <section className={clsx('ritual-card flex flex-col text-white', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)] opacity-60" />
        <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <header className="ritual-card-header flex flex-col gap-3 text-xs uppercase tracking-[0.4em] text-aether-cyan/70 sm:flex-row sm:items-center sm:justify-between sm:tracking-[0.3em]">
        <div className="flex items-center gap-3 text-[10px] sm:text-xs">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="h-2 w-2 rounded-full bg-amber-300/80" />
            <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
          </div>
          {title && <p className="font-tech tracking-[0.45em] text-white sm:tracking-[0.4em]">{title}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {controls}
          <span className="hidden text-[10px] font-tech tracking-[0.4em] text-aether-mint/40 sm:block">RITUAL SYS // ONLINE</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-auto p-6 ritual-scroll">
        {children}
      </div>

      <div className="ritual-divider" />
      <div className="flex items-center justify-between px-6 py-3 text-[10px] font-tech uppercase tracking-[0.3em] text-aether-mint/60">
        <span>PIXEL TEMPLE</span>
        <span>VER. 3.0</span>
      </div>
    </section>
  )
}
