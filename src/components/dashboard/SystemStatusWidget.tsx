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
    <div className="h-full w-full bg-aether-dark/80 p-4 border-t-2 border-aether-cyan flex items-center justify-between font-tech tracking-widest text-xs text-aether-cyan/70">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-[10px] opacity-50">SYSTEM TIME</span>
                <span className="text-xl text-white font-mono">{time || '00:00:00'}</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col">
                <span className="text-[10px] opacity-50">SERVER STATUS</span>
                <span className="text-aether-teal animate-pulse">● OPERATIONAL</span>
            </div>
        </div>
        
        <div className="text-right hidden md:block">
            <div className="text-[10px] opacity-50">LOCATION</div>
            <div>SECTOR_07 [UNKNOWN]</div>
        </div>
    </div>
  )
}
