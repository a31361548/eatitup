'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TechButton } from '@/components/ui/TechButton'
import clsx from 'clsx'

const CHECK_IN_REWARD = 5
const toIsoDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function CheckInCalendar() {
  const [checkedDates, setCheckedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const router = useRouter()
  const { update } = useSession()

  useEffect(() => {
    const init = async () => {
      const res = await fetch('/api/checkin')
      if (res.ok) {
        const data = await res.json()
        setCheckedDates(new Set(data.dates))
      }
      setLoading(false)
    }
    init()
  }, [])

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const todayIso = toIsoDate(today)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const hasCheckedInToday = useMemo(() => {
    return checkedDates.has(todayIso)
  }, [checkedDates, todayIso])

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = toIsoDate(new Date(currentYear, currentMonth, i + 1))
    return {
      day: i + 1,
      date,
      checked: checkedDates.has(date),
    }
  })

  const refreshCheckIns = async () => {
    const res = await fetch('/api/checkin')
    if (res.ok) {
      const data = await res.json()
      setCheckedDates(new Set(data.dates))
    }
  }

  const handleCheckIn = async () => {
    if (hasCheckedInToday || submitting) return
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/checkin', { method: 'POST' })
      if (!res.ok) throw new Error('簽到失敗')
      const data = await res.json()
      if (data.success) {
        const reward = typeof data.reward === 'number' ? data.reward : CHECK_IN_REWARD
        setFeedback({ type: 'success', message: `簽到成功！以太幣 +${reward}` })
        await refreshCheckIns()
        await update()
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: data.message ?? '今天已簽到' })
      }
    } catch (_error) {
      setFeedback({ type: 'error', message: '系統忙碌，稍後再試' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="h-full w-full bg-aether-dark/50 animate-pulse rounded border border-aether-cyan/20" />

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-aether-cyan/20 bg-aether-dark/50 p-4 text-aether-mint flex flex-col">
      {/* Decorative Header Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
            <div className="font-tech text-xs uppercase tracking-widest text-aether-cyan/70">
            時序紀錄
            </div>
            <div className="font-tech text-xs text-aether-mint/50">
                {currentYear}.{String(currentMonth + 1).padStart(2, '0')}
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-tech uppercase text-aether-mint/40 mb-1">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
                <div key={d}>{d}</div>
            ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
            ))}
            {days.map((d) => (
                <div
                key={d.date}
                className={clsx(
                    'aspect-square flex items-center justify-center rounded-[1px] transition-all duration-300',
                    d.checked
                    ? 'bg-samurai-blue/20 text-samurai-blue shadow-[0_0_5px_rgba(59,130,246,0.3)]'
                    : 'text-aether-mint/30 hover:bg-aether-cyan/5 hover:text-aether-mint',
                    d.date === todayIso && !d.checked && 'border border-aether-gold/50 text-aether-gold animate-pulse',
                    d.date === todayIso && d.checked && 'border border-aether-cyan'
                )}
                >
                {d.day}
                </div>
            ))}
            </div>
        </div>

        <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-tech uppercase tracking-wider text-aether-mint/60">
                <span>狀態：{hasCheckedInToday ? '已同步' : '待同步'}</span>
                <span>獎勵：+{CHECK_IN_REWARD} 代幣</span>
            </div>
            
            <TechButton
                variant={hasCheckedInToday ? 'ghost' : 'primary'}
                className="w-full text-xs py-2"
                onClick={handleCheckIn}
                disabled={hasCheckedInToday || submitting}
            >
                {hasCheckedInToday ? '今日已簽到（已同步）' : submitting ? '同步中...' : '手動簽到'}
            </TechButton>
            
            {feedback && (
                <div className={clsx(
                    "text-center font-tech text-[10px] tracking-wide animate-fade-in",
                    feedback.type === 'success' ? 'text-samurai-blue' : 'text-samurai-red'
                )}>
                {feedback.message}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
