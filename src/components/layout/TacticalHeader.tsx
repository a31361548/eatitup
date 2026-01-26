'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { LogoutButton } from '@/components/LogoutButton'
import { useAuxiliary } from '@/context/AuxiliaryContext'

export function TacticalHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { toggleView } = useAuxiliary()
  const currentUser = session?.user
  const isAdmin = currentUser?.role === 'ADMIN'

  const [time, setTime] = useState<string>('')
  const [ping, setPing] = useState<number>(24)
  const [mounted, setMounted] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)

  const tickers = [
    '系統狀態：最佳',
    '安全等級：啟用',
    '網路狀態：安全',
    '加密協議：AES-256',
    '核心協議：SAMURAI'
  ]

  useEffect(() => {
    setMounted(true)
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
    .map((segment) => segment.toUpperCase())

  const breadcrumbLabels: Record<string, string> = {
    DASHBOARD: '儀表板',
    TODOS: '任務',
    NOTES: '日誌',
    ORACLE: '神諭',
    LISTS: '卷軸',
    SETTINGS: '設定',
    ADMIN: '管理',
    MEMBERS: '成員'
  }

  const localizedBreadcrumbs = breadcrumbs
    .map((segment) => breadcrumbLabels[segment] ?? segment)
    .join(' / ')


  return (
    <header className="fixed top-0 left-0 z-50 w-full font-tech text-white select-none">
      {/* Main Bar Background */}
      <div className="relative h-14 w-full bg-samurai-dim/95 backdrop-blur-md border-b border-samurai-blue/20 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
        
        {/* Animated Loading Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-samurai-red/50 shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse" />

        <div className="h-full w-full px-3 sm:px-5 lg:px-6 flex items-center justify-between">
            
            {/* Left: Identity & Breadcrumbs */}
            <div className="flex items-center gap-6">
                {/* Logo Area */}
                <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 border border-samurai-red/30 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                        <div className="absolute inset-1 border border-samurai-red/60 rotate-0 group-hover:-rotate-45 transition-transform duration-500" />
                        <div className="w-2 h-2 bg-samurai-red shadow-[0_0_10px_rgba(244,63,94,0.7)] rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-heading tracking-widest text-white leading-none">SAMURAI</span>
                        <span className="text-[10px] text-samurai-blue/60 tracking-[0.3em] leading-none mt-1">OS v4.0</span>
                    </div>
                </Link>

                {/* Separator */}
                <div className="h-8 w-[1px] bg-white/10 -skew-x-12 hidden md:block" />

                {/* Breadcrumbs */}
                <div className="hidden md:flex items-center gap-2 text-xs tracking-widest text-samurai-text/50">
                    <span className="text-samurai-blue/80">指揮中樞</span>
                    {localizedBreadcrumbs && (
                        <>
                            <span className="text-samurai-blue/30">{'//'}</span>
                            <span className="text-samurai-text/80">{localizedBreadcrumbs}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Center: Ticker (Hidden on mobile) */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                <div className="relative overflow-hidden px-8 py-1 border-x border-samurai-blue/10 bg-samurai-blue/5 rounded-sm">
                    <div className="text-xs tracking-[0.3em] text-samurai-blue animate-pulse">
                        {tickers[tickerIndex]}
                    </div>
                    {/* Decorative brackets */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-samurai-blue/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-samurai-blue/30" />
                </div>
            </div>

            {/* Right: System Metrics */}
            <div className="flex items-center gap-4 sm:gap-8">
                {/* Ping */}
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-samurai-text/40 tracking-wider">延遲</span>
                    <span className={clsx(
                        "text-xs tracking-widest font-mono",
                        ping < 50 ? "text-samurai-text" : "text-samurai-red"
                    )}>
                        {ping}ms
                    </span>
                </div>

                {/* Time */}
                <div className="flex flex-col items-end min-w-[80px]">
                    <span className="text-[10px] text-samurai-text/40 tracking-wider">本地時間</span>
                    <span className="text-lg font-mono text-white leading-none tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {mounted ? time : '00:00:00'}
                    </span>
                </div>

                {/* Actions */}
                {currentUser && (
                  <div className="hidden xl:flex items-center gap-2">
                    {isAdmin && (
                      <Link
                        href="/admin/members"
                        className="inline-flex min-w-[80px] items-center justify-center border border-samurai-red px-3 py-1 text-[10px] tracking-[0.3em] text-samurai-red transition hover:bg-samurai-red hover:text-white"
                      >
                        管理後台
                      </Link>
                    )}
                    <LogoutButton />
                  </div>
                )}

                {/* Status Indicator / Mobile Aux Toggle */}
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-samurai-text/40 tracking-wider hidden sm:block">連線狀態</span>
                        <span className="text-xs text-samurai-red tracking-widest font-bold">線上</span>
                    </div>
                    {/* Mobile Toggle Button */}
                    <button 
                        onClick={() => toggleView('SYSTEM_STATUS')}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded transition-colors xl:hidden relative group"
                        aria-label="Toggle Aux Panel"
                    >
                        <div className="w-2 h-2 bg-samurai-red rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse group-active:scale-90" />
                        <span className="absolute inset-0 border border-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    </button>
                    {/* Desktop Status Dot */}
                    <div className="w-2 h-2 bg-samurai-red rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-pulse hidden xl:block" />
                </div>
            </div>

        </div>
      </div>
      
      {/* Decorative Bottom Tags */}
      <div className="absolute top-full right-8 flex gap-1">
         <div className="w-8 h-2 bg-samurai-blue/20 clip-path-slant" />
         <div className="w-4 h-2 bg-samurai-blue/40 clip-path-slant" />
      </div>
    </header>
  )
}
