'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

const links = [
  { href: '/dashboard', label: '會員中心', icon: '📊' },
  { href: '/dashboard/lists', label: '清單管理', icon: '📝' },
  { href: '/dashboard/notes', label: '記事本', icon: '📒' },
  { href: '/dashboard/settings', label: '個人設定', icon: '⚙️' },
]

export function DashboardSidebar(): React.ReactElement {
  const pathname = usePathname()

  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-lg shadow-slate-900/30 md:sticky md:top-24 md:w-64 md:self-start md:bg-slate-900/40 md:p-6 md:shadow-none">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 border-t border-white/10 pt-6">
        <LogoutButton />
      </div>
    </aside>
  )
}
