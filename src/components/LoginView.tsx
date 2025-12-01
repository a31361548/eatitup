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
        setError('存取被拒 // 憑證無效')
      } else {
        router.push('/dashboard/home')
        router.refresh()
      }
    } catch (err) {
      setError('系統錯誤 // 連線失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-float px-4">
      <PixelCard title="身份驗證" glow="blue" className="w-full max-w-sm md:max-w-md lg:max-w-xl relative z-10">
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
            <div className="border-2 border-aether-alert bg-aether-alert/10 px-3 py-2 text-center font-pixel text-pixel-sm uppercase tracking-pixel-normal text-aether-alert animate-pulse">
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

          <div className="text-center font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/40">
            AETHER OS v2.0.4
          </div>
        </form>
      </PixelCard>
    </div>
  )
}
