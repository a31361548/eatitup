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
    <aside className="w-full border border-gold-500/20 bg-void-800/50 backdrop-blur-sm p-5 text-mythril-100 shadow-glow-gold md:sticky md:top-24 md:w-64 md:self-start md:p-6">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-tech tracking-wider uppercase transition-all clip-path-slant ${
                isActive
                  ? 'bg-gold-500/20 text-gold-400 border-l-2 border-gold-500'
                  : 'text-mythril-300 hover:bg-white/5 hover:text-gold-200 hover:border-l-2 hover:border-gold-500/50 border-l-2 border-transparent'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-8 border-t border-gold-500/20 pt-6">
        <LogoutButton />
      </div>
    </aside>
  )
}
