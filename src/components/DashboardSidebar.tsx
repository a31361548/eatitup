'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'

const links = [
  { href: '/dashboard/home', label: '首頁', icon: '🏠' },
  { href: '/dashboard', label: '會員中心', icon: '📊' },
  { href: '/dashboard/todos', label: '待辦清單', icon: '✅' },
  { href: '/dashboard/lists', label: '清單管理', icon: '📝' },
  { href: '/dashboard/notes', label: '記事本', icon: '📒' },
  { href: '/dashboard/settings', label: '個人設定', icon: '⚙️' },
]

export function DashboardSidebar(): React.ReactElement {
  const pathname = usePathname()

  return (
    <aside className="w-full border-4 border-aether-teal bg-[#031f1f]/95 p-4 text-aether-mint shadow-pixel-card md:sticky md:top-24 md:w-56 md:self-start">
      <div className="mb-4 font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan">HUD // MODULES</div>
      <nav className="flex flex-col gap-2 font-pixel text-pixel-sm uppercase tracking-pixel-wide">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 border-l-4 px-3 py-3 transition ${
                isActive
                  ? 'border-aether-cyan bg-aether-teal/20 text-white'
                  : 'border-transparent text-aether-mint/60 hover:border-aether-cyan/50 hover:bg-aether-dim/20'
              }`}
            >
              <span className="text-aether-teal">{isActive ? '▶' : '▢'}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-6 border-t-2 border-aether-teal/40 pt-4">
        <LogoutButton />
      </div>
    </aside>
  )
}
