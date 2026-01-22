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
    <section className={clsx(
      'holo-panel flex flex-col text-white rounded-2xl overflow-hidden',
      'border border-aether-cyan/30 shadow-[0_0_30px_-5px_rgba(45,212,191,0.15)]',
      className
    )}>
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent opacity-50" />

      {/* Header Section */}
      <header className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-aether-cyan/10 bg-aether-dim/30">
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-aether-cyan/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-aether-cyan/30" />
          </div>
          
          {title && (
            <p className="font-header text-sm tracking-[0.2em] text-white/90 holo-text-glow uppercase">
              {title}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {controls}
          <span className="hidden text-[10px] font-tech tracking-[0.2em] text-aether-cyan/40 sm:block uppercase">
            System Online
          </span>
        </div>
      </header>

      {/* Content Area */}
      <div className="relative z-10 flex-1 overflow-auto p-6">
        {children}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-aether-cyan/5 bg-aether-dim/20">
        <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-aether-cyan/30">Holo.Sys</span>
        <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-aether-cyan/30">Ver. 3.1</span>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-aether-cyan/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-aether-cyan/30 rounded-br-2xl pointer-events-none" />
    </section>
  )
}
