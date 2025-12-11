'use client'


import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { 
    title: '首頁', 
    href: '/dashboard',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  { 
    title: '任務', 
    href: '/dashboard/todos',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18"/><path d="m15 9 2.5 2.5L21 8"/></svg>
  },
  { 
    title: '筆記', 
    href: '/dashboard/notes',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/></svg>
  },
  { 
    title: '轉盤', 
    href: '/modes/wheel',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
  },
  { 
    title: '清單', 
    href: '/dashboard/lists',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  },
  { 
    title: '成員', 
    href: '/admin/members',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  { 
    title: '設定', 
    href: '/dashboard/settings',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  },
]

export function JarvisSidebar() {
  const pathname = usePathname()

  const desktopNav = (
    <nav className="fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      <div className="mx-auto h-20 w-[1px] bg-gradient-to-b from-transparent to-aether-cyan/50" />
      <div className="flex flex-col gap-2 rounded-2xl border border-aether-cyan/20 bg-[#030b16]/70 p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex h-12 w-12 items-center justify-center rounded transition-all duration-300 ${
                isActive
                  ? 'bg-aether-cyan/20 text-aether-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'text-aether-cyan/40 hover:bg-aether-cyan/10 hover:text-aether-cyan'
              }`}
              aria-label={item.title}
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
              {isActive && <div className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-aether-cyan shadow-[0_0_10px_#00f0ff]" />}
              <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap border border-aether-cyan/30 bg-[#030b16] px-3 py-1 font-tech text-xs tracking-widest text-aether-cyan opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                {item.title}
                <div className="absolute top-1/2 -left-4 h-[1px] w-4 bg-aether-cyan/30" />
              </div>
            </Link>
          )
        })}
        <div className="mx-auto my-1 h-[1px] w-8 bg-aether-cyan/20" />
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="group relative flex h-12 w-12 items-center justify-center rounded text-red-500/60 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          aria-label="登出"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap border border-red-500/30 bg-[#030b16] px-3 py-1 font-tech text-xs tracking-widest text-red-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            登出 (LOGOUT)
            <div className="absolute top-1/2 -left-4 h-[1px] w-4 bg-red-500/30" />
          </div>
        </button>
      </div>
      <div className="mx-auto h-20 w-[1px] bg-gradient-to-t from-transparent to-aether-cyan/50" />
    </nav>
  )

  const mobileNav = (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 items-center justify-between rounded-3xl border border-cyan-300/20 bg-[#030b16]/90 px-3 py-2 text-[10px] font-tech tracking-[0.2em] text-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center gap-1 text-center" aria-label={item.title}>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                isActive ? 'border-cyan-300/80 bg-cyan-500/20 text-white' : 'border-white/10 bg-white/5 text-white/60'
              }`}
            >
              {item.icon}
            </span>
            <span className={isActive ? 'text-white' : 'text-white/50'}>{item.title}</span>
          </Link>
        )
      })}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex flex-col items-center gap-1 text-red-400"
        aria-label="登出"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-400/60 bg-red-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </span>
        <span>登出</span>
      </button>
    </nav>
  )

  return (
    <>
      {desktopNav}
      {mobileNav}
    </>
  )
}
