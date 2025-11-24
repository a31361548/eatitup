'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  const handleLogout = async () => {
    localStorage.removeItem('eatitup_token') // Clear token from localStorage
    await signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-400 hover:text-red-300 text-sm font-tech uppercase tracking-widest border border-red-900/30 px-3 py-1 hover:bg-red-900/20 transition-all"
    >
      斷開連結
    </button>
  )
}
