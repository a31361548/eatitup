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
      'relative depth-hud flex flex-col text-white rounded-2xl overflow-hidden',
      'transition-all duration-300 hover:border-samurai-blue/30',
      className
    )}>
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-samurai-blue/40 to-transparent opacity-50" />

      {/* Header Section */}
      <header className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-samurai-blue/10 bg-samurai-blue/5">
        <div className="flex items-center gap-3">
          {/* Status Indicators */}
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-samurai-red shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-samurai-blue/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-samurai-blue/30" />
          </div>
          
          {title && (
            <p className="font-header text-sm tracking-[0.2em] text-white/90 holo-text-glow uppercase">
              {title}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {controls}
          <span className="hidden text-[10px] font-tech tracking-[0.2em] text-samurai-blue/40 sm:block uppercase">
            System Online
          </span>
        </div>
      </header>

      {/* Content Area */}
      <div className="relative z-10 flex-1 overflow-auto p-6">
        {children}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-samurai-blue/5 bg-samurai-blue/5">
        <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-samurai-blue/30">Samurai.Sys</span>
        <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-samurai-blue/30">Ver. 4.0</span>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-samurai-blue/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-samurai-blue/30 rounded-br-2xl pointer-events-none" />
    </section>
  )
}
