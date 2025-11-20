"use client"

import Link from 'next/link'
import clsx from 'clsx'
import type { ReactElement } from 'react'

type Mode = 'wheel'

type ModeSwitcherProps = {
  active: Mode
}

const modes: Array<{ key: Mode; label: string; href: string; emoji: string }> = [
  { key: 'wheel', label: '轉盤模式', href: '/modes/wheel', emoji: '🎡' }
]

export function ModeSwitcher({ active }: ModeSwitcherProps): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 text-sm text-white shadow-[0_15px_35px_rgba(15,23,42,0.35)] backdrop-blur">
      {modes.map((mode) => (
        <Link
          key={mode.key}
          href={mode.href}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70',
            active === mode.key
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-lg shadow-emerald-500/30'
              : 'text-white/70 hover:text-white'
          )}
          aria-current={active === mode.key ? 'page' : undefined}
        >
          <span>{mode.emoji}</span>
          {mode.label}
        </Link>
      ))}
    </div>
  )
}
