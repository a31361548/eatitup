'use client'

import { useState, useEffect } from 'react'

export function CheckInCalendar() {
  const [checkedDates, setCheckedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // Fetch history
      const res = await fetch('/api/checkin')
      if (res.ok) {
        const data = await res.json()
        setCheckedDates(new Set(data.dates))
      }

      // Auto check-in
      const checkInRes = await fetch('/api/checkin', { method: 'POST' })
      if (checkInRes.ok) {
        const data = await checkInRes.json()
        if (data.success) {
          setCheckedDates((prev) => new Set(prev).add(data.date))
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1).toISOString().split('T')[0]
    return {
      day: i + 1,
      date,
      checked: checkedDates.has(date),
    }
  })

  if (loading) return <div className="animate-pulse h-64 rounded-3xl bg-white/5"></div>

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">
        {currentYear}年 {currentMonth + 1}月 簽到紀錄
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <div key={d} className="py-2 text-white/40">{d}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((d) => (
          <div
            key={d.date}
            className={`aspect-square flex items-center justify-center rounded-full transition-all ${
              d.checked
                ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'text-white/60 hover:bg-white/10'
            }`}
          >
            {d.day}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-white/60">
        本月已簽到 <span className="text-emerald-400 font-bold">{days.filter(d => d.checked).length}</span> 天
      </div>
    </div>
  )
}
