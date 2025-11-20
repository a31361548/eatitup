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
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20"
    >
      登出
    </button>
  )
}
