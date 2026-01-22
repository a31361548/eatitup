'use client'

import { useState } from 'react'
import clsx from 'clsx'

interface TechCalendarProps {
  value: Date
  onChange: (date: Date) => void
  minDate?: Date
}

export function TechCalendar({ value, onChange, minDate }: TechCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(value))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, value.getHours(), value.getMinutes())
    if (minDate && newDate < new Date(minDate.setHours(0,0,0,0))) return
    onChange(newDate)
  }

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const newDate = new Date(value)
    if (type === 'hour') newDate.setHours(parseInt(val))
    else newDate.setMinutes(parseInt(val))
    onChange(newDate)
  }

  const isSelected = (day: number) => {
    return value.getDate() === day && value.getMonth() === currentMonth.getMonth() && value.getFullYear() === currentMonth.getFullYear()
  }

  const isDisabled = (day: number) => {
    if (!minDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date < new Date(minDate.setHours(0,0,0,0))
  }

  return (
    <div className="border border-aether-cyan/30 bg-aether-dark/80 p-4 rounded clip-path-angle-sm w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 font-tech text-aether-cyan">
        <button type="button" onClick={handlePrevMonth} className="hover:text-white transition-colors">{'<<'}</button>
        <span className="tracking-widest">
            {currentMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
        </span>
        <button type="button" onClick={handleNextMonth} className="hover:text-white transition-colors">{'>>'}</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4 text-center font-mono text-xs text-aether-mint/50">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const selected = isSelected(day)
          const disabled = isDisabled(day)
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={clsx(
                'p-2 rounded hover:bg-aether-cyan/20 transition-colors relative group',
                selected ? 'bg-aether-cyan text-black font-bold shadow-[0_0_10px_rgba(94,234,212,0.7)]' : 'text-white',
                disabled && 'opacity-20 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {day}
              {selected && <div className="absolute inset-0 border border-white opacity-50 rounded" />}
            </button>
          )
        })}
      </div>

      {/* Time Picker */}
      <div className="flex items-center justify-center gap-2 border-t border-aether-cyan/20 pt-4">
        <select 
            value={value.getHours()} 
            onChange={(e) => handleTimeChange('hour', e.target.value)}
            className="bg-aether-dark border border-aether-cyan/30 text-aether-cyan p-1 rounded font-mono focus:outline-none"
        >
            {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
        </select>
        <span className="text-aether-cyan">:</span>
        <select 
            value={value.getMinutes()} 
            onChange={(e) => handleTimeChange('minute', e.target.value)}
            className="bg-aether-dark border border-aether-cyan/30 text-aether-cyan p-1 rounded font-mono focus:outline-none"
        >
            {Array.from({ length: 60 }).map((_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
            ))}
        </select>
      </div>
    </div>
  )
}
