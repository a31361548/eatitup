'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/LogoutButton'
import { Session } from 'next-auth'

interface NavbarClientProps {
  user: Session['user'] | undefined
}

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname()

  // Hide Navbar on Login Page (root path)
  if (pathname === '/') {
    return null
  }

  return (
    <header className="border-b border-gold-500/20 bg-void-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link 
            href={user ? "/dashboard" : "/"}
            className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 text-2xl font-heading font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
            AETHER<span className="text-white font-light">OS</span>
        </Link>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
                {/* User Status Pill */}
                <div className="hidden md:flex items-center gap-3 bg-void-800 border border-white/10 px-4 py-1.5 rounded-full shadow-glow-blue shrink-0">
                    <div className="relative flex-shrink-0">
                        {user.avatar ? (
                             <img 
                                src={user.avatar} 
                                className="w-6 h-6 rounded-full border border-gold-500/50 object-cover" 
                                alt="av" 
                             />
                        ) : (
                             <div className="w-6 h-6 rounded-full bg-void-900 border border-gold-500/50 flex items-center justify-center text-[10px]">👤</div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-black animate-pulse"></div>
                    </div>
                    <span className="text-mythril-200 text-sm font-tech tracking-wider uppercase">{user.name || 'User'}</span>
                    
                    {/* Currency Display */}
                    <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <div className="flex items-center gap-1 text-gold-400 font-tech">
                        <span className="text-xs">AC</span>
                        <span className="font-bold">{user.coins || 0}</span>
                    </div>
                </div>

                {/* Admin Link */}
                {user.role === 'ADMIN' && (
                    <Link href="/admin/members" className="hidden sm:block text-cyan-400 hover:text-cyan-300 text-sm font-tech uppercase tracking-widest border border-cyan-500/30 px-3 py-1 hover:bg-cyan-900/20 transition-all">
                        監管核心
                    </Link>
                )}

                <LogoutButton />
            </>
          ) : (
            <Link 
                href="/"
                className="text-gold-400 hover:text-gold-300 text-sm font-tech uppercase tracking-widest border border-gold-500/30 px-4 py-1.5 hover:bg-gold-900/20 transition-all hover:shadow-glow-gold"
            >
                啟動連結 (LOGIN)
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
