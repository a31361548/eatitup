'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PixelButton } from '@/components/PixelComponents'

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
  
  // 使用 useMemo 確保 hasCheckedInToday 會隨著 checkedDates 更新
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
        // 重新從 API 獲取最新的簽到日期列表
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

  if (loading) return <div className="h-64 border-4 border-aether-teal bg-[#031f1f]/60 animate-pulse" />

  return (
    <div className="relative overflow-hidden border-4 border-aether-teal bg-[#031f1f]/95 p-5 text-aether-mint shadow-pixel-card">
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-20" />
      <div className="relative z-10 space-y-4">
        <div className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan">
          Chrono Sync
        </div>
        <h2 className="font-header text-2xl text-aether-cyan">
          {currentYear}年 {currentMonth + 1}月 簽到紀錄
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-pixel uppercase text-aether-mint/60">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((d) => (
            <div
              key={d.date}
              className={`flex aspect-square items-center justify-center border-2 text-sm transition ${
                d.checked
                  ? 'border-aether-cyan bg-aether-cyan/20 text-white'
                  : 'border-aether-dim text-aether-mint/60 hover:border-aether-cyan/50 hover:text-aether-cyan'
              } ${d.date === todayIso ? 'outline outline-2 outline-aether-gold' : ''}`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="text-center font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-mint/80">
          本月簽到 <span className="text-aether-cyan">{days.filter((d) => d.checked).length}</span> 天
        </div>
        <div className="space-y-2">
          <PixelButton
            variant={hasCheckedInToday ? 'secondary' : 'primary'}
            fullWidth
            onClick={handleCheckIn}
            disabled={hasCheckedInToday || submitting}
          >
            {hasCheckedInToday ? '今日已簽到' : submitting ? '同步時間線中...' : `手動簽到 +${CHECK_IN_REWARD}`}
          </PixelButton>
          <p className="text-center font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/50">
            每日首次簽到獎勵：+{CHECK_IN_REWARD}
          </p>
          {feedback && (
            <div className={`text-center font-pixel text-pixel-sm ${feedback.type === 'success' ? 'text-aether-cyan' : 'text-aether-alert'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
