"use client"

import { ReactElement, useState } from 'react'
import { signIn } from 'next-auth/react'
import { PageShell } from '@/components/ui/PageShell'
import { AuthCard } from '@/components/ui/AuthCard'

export default function LoginPage(): ReactElement {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const submit = async (): Promise<void> => {
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('登入失敗，請檢查 Email / 密碼')
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <PageShell className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <AuthCard
        title="歡迎回來"
        subtitle="此入口僅限管理員或已建立的成員登入"
        footer={<span>需要帳號？請聯絡管理員 a31361548@gmail.com</span>}
      >
        <label className="space-y-2 text-sm text-white/70">
          Email
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-white/70">
          密碼
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-emerald-300"
            type="password"
            placeholder="至少 6 字"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button
          className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          onClick={submit}
          disabled={loading}
        >
          {loading ? '登入中…' : '登入'}
        </button>
      </AuthCard>
    </PageShell>
  )
}
