'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PixelCard, PixelInput, PixelButton } from '@/components/PixelComponents'

export function LoginView() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email: username,
        password: password,
        redirect: false,
      })

      if (res?.error) {
        setError('存取被拒：憑證無效')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('系統錯誤：連線失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-float">
      <PixelCard title="身份驗證" glow="blue" className="w-full max-w-md relative z-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            <PixelInput 
              label="識別代號 (ID)" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
            />
            <PixelInput 
              label="訪問密碼" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-tech border border-red-900/50 bg-red-900/20 p-2 text-center animate-pulse">
              ⚠ {error}
            </div>
          )}

          <PixelButton 
            type="submit" 
            disabled={loading} 
            variant="success"
            className="w-full"
          >
            {loading ? '驗證中...' : '啟動連結'}
          </PixelButton>

          <div className="text-center">
            <span className="text-mythril-300/40 text-xs font-tech uppercase tracking-widest">
              AETHER OS v2.0.4
            </span>
          </div>
        </form>
    </PixelCard>
    </div>
  )
}
