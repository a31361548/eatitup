'use client'

import { useState, useEffect } from 'react'

export function SystemStatusWidget() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full bg-aether-dark/80 p-4 border-t-2 border-aether-cyan font-tech text-xs text-aether-cyan/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] opacity-50 whitespace-nowrap tracking-wide">SYSTEM TIME</span>
            <span className="text-lg sm:text-xl text-white font-mono tracking-wide">{time || '00:00:00'}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] opacity-50 whitespace-nowrap tracking-wide">SERVER STATUS</span>
            <span className="text-aether-teal animate-pulse whitespace-nowrap tracking-wide">● OPERATIONAL</span>
          </div>
        </div>
        
        <div className="text-right hidden lg:block">
          <div className="text-[10px] opacity-50 tracking-wide">LOCATION</div>
          <div className="tracking-wide">SECTOR_07 [UNKNOWN]</div>
        </div>
      </div>
    </div>
  )

}
