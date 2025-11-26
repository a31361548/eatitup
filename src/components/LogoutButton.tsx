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
      className="font-pixel text-pixel-xs uppercase tracking-pixel-wider border-2 border-aether-alert px-4 py-2 text-aether-alert transition hover:bg-aether-alert hover:text-aether-dark"
    >
      斷開連結
    </button>
  )
}
