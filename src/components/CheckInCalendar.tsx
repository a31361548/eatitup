'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const hasCheckedInToday = checkedDates.has(todayIso)

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = toIsoDate(new Date(currentYear, currentMonth, i + 1))
    return {
      day: i + 1,
      date,
      checked: checkedDates.has(date),
    }
  })

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
        setCheckedDates((prev) => new Set(prev).add(data.date))
        setFeedback({ type: 'success', message: `簽到成功！以太幣 +${reward}` })
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

  if (loading) return <div className="animate-pulse h-64 rounded-3xl border border-cyan-500/30 bg-void-900/40"></div>

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-void-900/60 p-6 shadow-glow-blue">
      <div className="pointer-events-none absolute inset-0 bg-tech-grid-overlay opacity-40"></div>
      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-xs font-tech uppercase tracking-[0.4em] text-cyan-400/70">Chrono Sync</p>
          <h2 className="text-2xl font-heading text-white drop-shadow">
            {currentYear}年 {currentMonth + 1}月 簽到紀錄
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-tech">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d} className="py-2 text-white/40">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((d) => (
            <div
              key={d.date}
              className={`aspect-square flex items-center justify-center rounded-full border transition-all text-xs md:text-sm ${
                d.checked
                  ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                  : 'border-white/10 text-white/60 hover:border-cyan-400/40 hover:text-white'
              } ${d.date === todayIso ? 'ring-1 ring-gold-400/80 ring-offset-2 ring-offset-void-900' : ''}`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="text-sm text-white/70 text-center">
          本月已簽到 <span className="text-cyan-400 font-bold">{days.filter(d => d.checked).length}</span> 天
        </div>
        <div className="space-y-2">
          <PixelButton
            variant={hasCheckedInToday ? 'secondary' : 'success'}
            className="w-full py-4 text-base"
            onClick={handleCheckIn}
            disabled={hasCheckedInToday || submitting}
          >
            {hasCheckedInToday ? '今日已簽到' : submitting ? '同步時間線中...' : `手動簽到 +${CHECK_IN_REWARD} 以太幣`}
          </PixelButton>
          <p className="text-center text-xs font-tech uppercase tracking-[0.3em] text-gold-300">
            每日首次簽到獎勵：+{CHECK_IN_REWARD}
          </p>
          {feedback && (
            <div className={`text-center text-sm font-tech ${feedback.type === 'success' ? 'text-emerald-300' : 'text-red-400'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
