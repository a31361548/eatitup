'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function TacticalHeader() {
  const pathname = usePathname()
  const [time, setTime] = useState<string>('')
  const [ping, setPing] = useState<number>(24)
  const [tickerIndex, setTickerIndex] = useState(0)

  const tickers = [
    'SYSTEM: OPTIMAL',
    'SECURITY: ACTIVE',
    'NETWORK: SECURE',
    'ENCRYPTION: AES-256',
    'PROTOCOL: OMEGA'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
      
      // Randomize ping slightly
      setPing(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newPing = prev + change
        return newPing < 1 ? 1 : newPing > 50 ? 50 : newPing
      })
    }, 1000)

    const tickerTimer = setInterval(() => {
        setTickerIndex(prev => (prev + 1) % tickers.length)
    }, 3000)

    return () => {
        clearInterval(timer)
        clearInterval(tickerTimer)
    }
  }, [])

  // Generate breadcrumbs from pathname
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.toUpperCase())
    .join(' / ')

  return (
    <header className="fixed top-0 left-0 z-50 w-full font-tech text-white select-none">
      {/* Main Bar Background */}
      <div className="relative h-14 w-full bg-[#030b16]/95 backdrop-blur-md border-b border-aether-cyan/20 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
        
        {/* Energy Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-aether-cyan/50 shadow-[0_0_10px_#00f0ff] animate-pulse" />
        
        <div className="h-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            {/* Left: Identity & Breadcrumbs */}
            <div className="flex items-center gap-6">
                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 border border-aether-cyan/30 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                        <div className="absolute inset-1 border border-aether-cyan/60 rotate-0 group-hover:-rotate-45 transition-transform duration-500" />
                        <div className="w-2 h-2 bg-aether-cyan shadow-[0_0_10px_#00f0ff] rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-heading tracking-widest text-white leading-none">AETHER</span>
                        <span className="text-[10px] text-aether-cyan/60 tracking-[0.3em] leading-none mt-1">OS v2.1</span>
                    </div>
                </div>

                {/* Separator */}
                <div className="h-8 w-[1px] bg-white/10 -skew-x-12 hidden md:block" />

                {/* Breadcrumbs */}
                <div className="hidden md:flex items-center gap-2 text-xs tracking-widest text-aether-mint/50">
                    <span className="text-aether-cyan/80">COMMAND CENTER</span>
                    {breadcrumbs && (
                        <>
                            <span className="text-aether-cyan/30">{'//'}</span>
                            <span className="text-aether-mint/80">{breadcrumbs}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Center: Ticker (Hidden on mobile) */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                <div className="relative overflow-hidden px-8 py-1 border-x border-aether-cyan/10 bg-aether-cyan/5 rounded-sm">
                    <div className="text-xs tracking-[0.3em] text-aether-cyan animate-pulse">
                        {tickers[tickerIndex]}
                    </div>
                    {/* Decorative brackets */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-aether-cyan/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-aether-cyan/30" />
                </div>
            </div>

            {/* Right: System Metrics */}
            <div className="flex items-center gap-4 sm:gap-8">
                {/* Ping */}
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-aether-mint/40 tracking-wider">LATENCY</span>
                    <span className={clsx(
                        "text-xs tracking-widest font-mono",
                        ping < 50 ? "text-aether-mint" : "text-aether-alert"
                    )}>
                        {ping}ms
                    </span>
                </div>

                {/* Time */}
                <div className="flex flex-col items-end min-w-[80px]">
                    <span className="text-[10px] text-aether-mint/40 tracking-wider">LOCAL TIME</span>
                    <span className="text-lg font-mono text-white leading-none tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {time || '00:00:00'}
                    </span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-aether-mint/40 tracking-wider hidden sm:block">STATUS</span>
                        <span className="text-xs text-aether-teal tracking-widest font-bold">ONLINE</span>
                    </div>
                    <div className="w-2 h-2 bg-aether-teal rounded-full shadow-[0_0_10px_#2dd4bf] animate-pulse" />
                </div>
            </div>

        </div>
      </div>
      
      {/* Decorative Bottom Tags */}
      <div className="absolute top-full right-8 flex gap-1">
         <div className="w-8 h-2 bg-aether-cyan/20 clip-path-slant" />
         <div className="w-4 h-2 bg-aether-cyan/40 clip-path-slant" />
      </div>
    </header>
  )
}
