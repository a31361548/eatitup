'use client'

import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Todo, TodoStatus } from '@/types/todo'
import { TODO_STATUS_OPTIONS } from '@/types/todo'
import { TechButton } from '@/components/ui/TechButton'
import { TechCalendar } from '@/components/ui/TechCalendar'

const DEFAULT_DURATION_MINUTES = 30

export type TodoFormPayload = {
  title: string
  description?: string
  startAt: string
  endAt: string
  status: TodoStatus
}

type TodoFormProps = {
  mode: 'create' | 'edit'
  initialTodo?: Todo
  submitting?: boolean
  onSubmit: (payload: TodoFormPayload) => Promise<void> | void
  onCancel?: () => void
}

type TodoFormState = {
  title: string
  description: string
  startAt: Date
  endAt: Date
  status: TodoStatus
  manualStatus: boolean // Track if user manually changed status
}

const addMinutes = (base: Date, minutes: number): Date => {
  return new Date(base.getTime() + minutes * 60 * 1000)
}

const determineStatus = (start: Date, end: Date): TodoStatus => {
    const now = new Date()
    if (now > end) return 'NOT_STARTED' // Expired tasks revert to not started or stay as is
    if (now >= start && now <= end) return 'IN_PROGRESS'
    return 'NOT_STARTED'
}

const deriveInitialState = (todo?: Todo): TodoFormState => {
  if (todo) {
    return {
      title: todo.title,
      description: todo.description ?? '',
      startAt: new Date(todo.startAt),
      endAt: new Date(todo.endAt),
      status: todo.status,
      manualStatus: true, // Existing todos preserve their status
    }
  }
  const now = new Date()
  // Round up to next 15 min
  const start = new Date(Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000))
  const end = addMinutes(start, DEFAULT_DURATION_MINUTES)
  
  return {
    title: '',
    description: '',
    startAt: start,
    endAt: end,
    status: 'NOT_STARTED',
    manualStatus: false,
  }
}

export function TodoForm({ mode, initialTodo, submitting, onSubmit, onCancel }: TodoFormProps): React.ReactElement {
  const initialSnapshot = useMemo(() => deriveInitialState(initialTodo), [initialTodo])
  const [formState, setFormState] = useState<TodoFormState>(initialSnapshot)
  const [error, setError] = useState<string | null>(null)

  // Sync form state when initialTodo changes
  useEffect(() => {
    setFormState(initialSnapshot)
    setError(null)
  }, [initialSnapshot])

  // Auto-update status when dates change, unless manually overridden
  useEffect(() => {
    if (!formState.manualStatus) {
        const newStatus = determineStatus(formState.startAt, formState.endAt)
        if (newStatus !== formState.status) {
            setFormState(prev => ({ ...prev, status: newStatus }))
        }
    }
  }, [formState.startAt, formState.endAt, formState.manualStatus, formState.status])

  const handleChange = (field: keyof TodoFormState, value: any) => {
    setFormState((prev) => {
      if (field === 'startAt') {
        const newStart = value as Date
        // Auto-adjust end if start moves past it
        let newEnd = prev.endAt
        if (newEnd <= newStart) {
            newEnd = addMinutes(newStart, DEFAULT_DURATION_MINUTES)
        }
        return { ...prev, startAt: newStart, endAt: newEnd }
      }
      if (field === 'status') {
        return { ...prev, status: value as TodoStatus, manualStatus: true }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!formState.title.trim()) {
        setError('請輸入任務指令 (標題)')
        return
    }

    if (formState.endAt <= formState.startAt) {
        setError('結束時間必須晚於開始時間')
        return
    }

    const payload: TodoFormPayload = {
      title: formState.title.trim(),
      description: formState.description.trim() ? formState.description : undefined,
      status: formState.status,
      startAt: formState.startAt.toISOString(),
      endAt: formState.endAt.toISOString(),
    }
    
    await onSubmit(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-6 overflow-hidden rounded-[32px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.15),transparent_55%)]" />
      </div>

      <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-tech uppercase tracking-[0.45em] text-white/60">Ritual Console</p>
          <h2 className="text-2xl font-heading">{mode === 'edit' ? '調整任務參數' : '新增任務指令'}</h2>
        </div>
        {onCancel && mode === 'edit' && (
          <button type="button" onClick={onCancel} className="text-xs font-tech uppercase tracking-[0.35em] text-amber-200 hover:text-white">
            取消編輯
          </button>
        )}
      </div>

      <div className="relative space-y-4">
        {/* Title Input */}
        <div className="space-y-1">
            <label className="text-xs font-tech text-aether-cyan/70 uppercase tracking-widest">指令名稱 (TITLE)</label>
            <input
                type="text"
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-aether-dark border border-aether-cyan/30 p-3 text-white placeholder-aether-mint/20 focus:border-aether-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] outline-none transition-all font-heading tracking-wide"
                placeholder="輸入任務名稱..."
            />
        </div>

        {/* Description Input */}
        <div className="space-y-1">
            <label className="text-xs font-tech text-aether-cyan/70 uppercase tracking-widest">詳細資訊 (DETAILS)</label>
            <textarea
                rows={3}
                value={formState.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full bg-aether-dark border border-aether-cyan/30 p-3 text-aether-mint/80 placeholder-aether-mint/20 focus:border-aether-cyan outline-none transition-all font-mono text-sm"
                placeholder="// 額外參數..."
            />
        </div>

        {/* Date Pickers */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-tech text-aether-cyan/70 uppercase tracking-widest">啟動序列 (START)</label>
                <TechCalendar 
                    value={formState.startAt} 
                    onChange={(date) => handleChange('startAt', date)} 
                    minDate={new Date()}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-tech text-aether-cyan/70 uppercase tracking-widest">終止序列 (END)</label>
                <TechCalendar 
                    value={formState.endAt} 
                    onChange={(date) => handleChange('endAt', date)} 
                    minDate={formState.startAt}
                />
            </div>
        </div>

        {/* Status Override */}
        <div className="space-y-1">
            <label className="text-xs font-tech text-aether-cyan/70 uppercase tracking-widest flex justify-between">
                <span>目前狀態 (STATUS)</span>
                {!formState.manualStatus && <span className="text-aether-gold animate-pulse text-[10px]">[自動偵測]</span>}
            </label>
            <div className="flex flex-wrap gap-2">
                {TODO_STATUS_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('status', option.value)}
                        className={clsx(
                            'px-3 py-1 text-xs font-tech border transition-all',
                            formState.status === option.value 
                                ? 'border-aether-cyan bg-aether-cyan/20 text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                                : 'border-aether-cyan/20 text-aether-mint/40 hover:border-aether-cyan/50 hover:text-aether-mint'
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 text-xs font-mono">
          ⚠ 錯誤: {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-aether-cyan/10">
        {onCancel && (
            <TechButton type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
                中止 (ABORT)
            </TechButton>
        )}
        <TechButton type="submit" variant="primary" disabled={submitting} className={clsx(submitting && 'opacity-50')}>
            {submitting ? '處理中...' : (mode === 'edit' ? '更新協定 (UPDATE)' : '啟動任務 (INITIATE)')}
        </TechButton>
      </div>
    </form>
  )
}
