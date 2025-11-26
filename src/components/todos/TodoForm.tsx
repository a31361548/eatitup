'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { Todo, TodoStatus } from '@/types/todo'
import { TODO_STATUS_OPTIONS } from '@/types/todo'
import { PixelButton } from '@/components/PixelComponents'

const MIN_OFFSET_MINUTES = 5
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
  startAt: string
  endAt: string
  status: TodoStatus
}

const clampMinutes = (date: Date): Date => {
  const result = new Date(date)
  result.setSeconds(0, 0)
  return result
}

const toInputValue = (date: Date): string => {
  const target = clampMinutes(date)
  const y = target.getFullYear()
  const m = `${target.getMonth() + 1}`.padStart(2, '0')
  const d = `${target.getDate()}`.padStart(2, '0')
  const h = `${target.getHours()}`.padStart(2, '0')
  const min = `${target.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

const addMinutes = (base: Date, minutes: number): Date => {
  return new Date(base.getTime() + minutes * 60 * 1000)
}

const deriveInitialState = (todo?: Todo): TodoFormState => {
  if (todo) {
    return {
      title: todo.title,
      description: todo.description ?? '',
      startAt: toInputValue(new Date(todo.startAt)),
      endAt: toInputValue(new Date(todo.endAt)),
      status: todo.status,
    }
  }
  const now = new Date()
  const start = toInputValue(now)
  const end = toInputValue(addMinutes(now, DEFAULT_DURATION_MINUTES))
  return {
    title: '',
    description: '',
    startAt: start,
    endAt: end,
    status: 'NOT_STARTED',
  }
}

const toIsoString = (value: string): string | null => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

export function TodoForm({ mode, initialTodo, submitting, onSubmit, onCancel }: TodoFormProps): React.ReactElement {
  const initialSnapshot = useMemo(() => deriveInitialState(initialTodo), [initialTodo])
  const [formState, setFormState] = useState<TodoFormState>(initialSnapshot)
  const [error, setError] = useState<string | null>(null)
  const initialStartValueRef = useRef(initialSnapshot.startAt)

  useEffect(() => {
    setFormState(initialSnapshot)
    initialStartValueRef.current = initialSnapshot.startAt
    setError(null)
  }, [initialSnapshot])

  const handleChange = (field: keyof TodoFormState, value: string) => {
    setFormState((prev) => {
      if (field === 'startAt') {
        const adjustedEnd = adjustEndIfNeeded(value, prev.endAt)
        return { ...prev, startAt: value, endAt: adjustedEnd }
      }
      if (field === 'endAt') {
        return { ...prev, endAt: value }
      }
      if (field === 'status') {
        return { ...prev, status: value as TodoStatus }
      }
      return { ...prev, [field]: value }
    })
  }

  const adjustEndIfNeeded = (startValue: string, endValue: string): string => {
    const start = new Date(startValue)
    const end = new Date(endValue)
    if (Number.isNaN(start.getTime())) return endValue
    const minEnd = start.getTime() + MIN_OFFSET_MINUTES * 60 * 1000
    if (Number.isNaN(end.getTime()) || end.getTime() < minEnd) {
      return toInputValue(new Date(minEnd))
    }
    return endValue
  }

  const validate = (): { startAt: string; endAt: string } | null => {
    const startIso = toIsoString(formState.startAt)
    const endIso = toIsoString(formState.endAt)
    if (!startIso || !endIso) {
      setError('請輸入正確的日期與時間')
      return null
    }
    const startDate = new Date(startIso)
    const endDate = new Date(endIso)
    const now = Date.now()
    const isEditing = Boolean(initialTodo)
    const startChanged = formState.startAt !== initialStartValueRef.current
    if (!isEditing || startChanged) {
      if (startDate.getTime() < now) {
        setError('開始時間不能早於現在')
        return null
      }
    }
    if (endDate.getTime() - startDate.getTime() < MIN_OFFSET_MINUTES * 60 * 1000) {
      setError(`結束時間需至少晚於開始時間 ${MIN_OFFSET_MINUTES} 分鐘`)
      return null
    }
    return { startAt: startIso, endAt: endIso }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const range = validate()
    if (!range) return
    const payload: TodoFormPayload = {
      title: formState.title.trim(),
      description: formState.description.trim() ? formState.description : undefined,
      status: formState.status,
      startAt: range.startAt,
      endAt: range.endAt,
    }
    if (!payload.title) {
      setError('請輸入待辦標題')
      return
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
      <div className="flex flex-wrap items-center justify-between gap-3 font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan">
        <span>{mode === 'edit' ? '編輯待辦' : '新增待辦'}</span>
        {onCancel && mode === 'edit' && (
          <button type="button" onClick={onCancel} className="text-aether-gold hover:text-white">
            返回新增模式
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/60 md:col-span-2">
          標題
          <input
            type="text"
            value={formState.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="mt-2 w-full border-2 border-aether-dim bg-[#011111] px-4 py-3 text-aether-cyan focus:border-aether-cyan focus:outline-none"
            placeholder="輸入待辦事項"
            required
          />
        </label>

        <label className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/60 md:col-span-2">
          描述
          <textarea
            rows={3}
            value={formState.description}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="補充內容（選填）"
            className="mt-2 w-full border-2 border-aether-dim bg-[#011111] px-4 py-3 text-aether-cyan focus:border-aether-cyan focus:outline-none"
          />
        </label>

        <label className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/60">
          開始時間
          <input
            type="datetime-local"
            value={formState.startAt}
            min={toInputValue(new Date())}
            onChange={(event) => handleChange('startAt', event.target.value)}
            className="mt-2 w-full border-2 border-aether-dim bg-[#011111] px-4 py-3 text-aether-cyan focus:border-aether-cyan focus:outline-none"
            required
          />
        </label>

        <label className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/60">
          結束時間
          <input
            type="datetime-local"
            value={formState.endAt}
            min={formState.startAt}
            onChange={(event) => handleChange('endAt', event.target.value)}
            className="mt-2 w-full border-2 border-aether-dim bg-[#011111] px-4 py-3 text-aether-cyan focus:border-aether-cyan focus:outline-none"
            required
          />
        </label>

        <label className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-mint/60">
          狀態
          <select
            value={formState.status}
            onChange={(event) => handleChange('status', event.target.value)}
            className="mt-2 w-full border-2 border-aether-dim bg-[#011111] px-4 py-3 text-aether-cyan focus:border-aether-cyan focus:outline-none"
          >
            {TODO_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="border-2 border-aether-alert bg-aether-alert/10 px-4 py-2 font-pixel text-pixel-sm uppercase tracking-pixel-wide text-aether-alert">
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <PixelButton type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            取消
          </PixelButton>
        )}
        <PixelButton type="submit" variant="primary" disabled={submitting} className={clsx(submitting && 'opacity-60')}>
          {mode === 'edit' ? '儲存變更' : '建立待辦'}
        </PixelButton>
      </div>
    </form>
  )
}
