'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import clsx from 'clsx'
import type { Todo, TodoStatus } from '@/types/todo'
import { TODO_STATUS_OPTIONS } from '@/types/todo'
import { TechButton } from '@/components/ui/TechButton'
import { TechCalendar } from '@/components/ui/TechCalendar'
import { MIN_DURATION_MS } from '@/lib/todoTime'

const DEFAULT_DURATION_MINUTES = 30
const MIN_DURATION_MINUTES = Math.ceil(MIN_DURATION_MS / 60000)

type PresetOption = {
  id: string
  label: string
  helper?: string
  minutes?: number
  custom?: boolean
}

const START_PRESETS: PresetOption[] = [
  { id: 'now', label: '立即啟動', helper: '現在開始' },
  { id: 'plus10', label: '+10 分鐘', helper: '短暫緩衝' },
  { id: 'plus30', label: '+30 分鐘', helper: '半小時後' },
  { id: 'nextHour', label: '下一整點', helper: '同步整點節奏' },
]

const DURATION_PRESETS: PresetOption[] = [
  { id: 'pomodoro', label: '25 分', helper: '番茄標準', minutes: 25 },
  { id: 'deep50', label: '50 分', helper: '雙倍番茄', minutes: 50 },
  { id: 'focus90', label: '90 分', helper: '深度專注', minutes: 90 },
  { id: 'custom', label: '自訂時長', helper: '輸入分鐘', custom: true },
]

const CYCLE_PRESETS: PresetOption[] = [
  { id: 'cycle25', label: '番茄 25/5', helper: '標準節奏', minutes: 25 },
  { id: 'cycle50', label: '雙番茄 50/10', helper: '延長巡航', minutes: 50 },
  { id: 'cycle90', label: '超頻 90/20', helper: '超長專注', minutes: 90 },
]

export type TodoFormPayload = {
  title: string
  description?: string
  startAt: string
  endAt: string
  status: TodoStatus
}

export type TodoFormCommand = {
  type: 'restart'
  targetId: string
  issuedAt: number
}

type TodoFormProps = {
  mode: 'create' | 'edit'
  initialTodo?: Todo
  submitting?: boolean
  onSubmit: (payload: TodoFormPayload) => Promise<void> | void
  onCancel?: () => void
  command?: TodoFormCommand | null
  onCommandHandled?: () => void
}

type TodoFormState = {
  title: string
  description: string
  startAt: Date
  endAt: Date
  status: TodoStatus
  manualStatus: boolean // Track if user manually changed status
  durationMinutes: number
  startPresetId?: string
  durationPresetId?: string
  cyclePresetId?: string
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

const roundToNextQuarter = (value: Date): Date => {
  const result = new Date(value)
  result.setMilliseconds(0)
  result.setSeconds(0)
  const minutes = result.getMinutes()
  const remainder = minutes % 15
  if (remainder !== 0) {
    result.setMinutes(minutes + (15 - remainder))
  }
  return result
}

const calculateDurationMinutes = (start: Date, end: Date): number => {
  const diff = Math.max(MIN_DURATION_MS, end.getTime() - start.getTime())
  return Math.max(MIN_DURATION_MINUTES, Math.round(diff / 60000))
}

const computeStartFromPreset = (presetId: string): Date => {
  const now = new Date()
  switch (presetId) {
    case 'now':
      return now
    case 'plus10':
      return addMinutes(now, 10)
    case 'plus30':
      return addMinutes(now, 30)
    case 'nextHour': {
      const aligned = new Date(now)
      aligned.setMinutes(0, 0, 0)
      aligned.setHours(aligned.getHours() + 1)
      return aligned
    }
    default:
      return roundToNextQuarter(now)
  }
}

const deriveInitialState = (todo?: Todo): TodoFormState => {
  if (todo) {
    const startAt = new Date(todo.startAt)
    const endAt = new Date(todo.endAt)
    return {
      title: todo.title,
      description: todo.description ?? '',
      startAt,
      endAt,
      status: todo.status,
      manualStatus: true, // Existing todos preserve their status
      durationMinutes: calculateDurationMinutes(startAt, endAt),
    }
  }
  const now = new Date()
  // Round up to next 15 min
  const start = roundToNextQuarter(now)
  const end = addMinutes(start, DEFAULT_DURATION_MINUTES)
  
  return {
    title: '',
    description: '',
    startAt: start,
    endAt: end,
    status: 'NOT_STARTED',
    manualStatus: false,
    durationMinutes: DEFAULT_DURATION_MINUTES,
  }
}

type ClickRef = RefObject<HTMLDivElement>

function useOutsideClick(ref: ClickRef, handler: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler, active, ref])
}

type DropdownProps = {
  label: string
  displayValue: string
  options: PresetOption[]
  activeId?: string
  onSelect: (option: PresetOption) => void
}

function PresetDropdown({ label, displayValue, options, activeId, onSelect }: DropdownProps): React.ReactElement {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, () => setOpen(false), open)

  return (
    <div className="space-y-1" ref={containerRef as React.RefObject<HTMLDivElement>}>
      <label className="text-xs font-tech uppercase tracking-[0.4em] text-samurai-blue/70">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-left text-sm text-white/80"
        >
          <span>{displayValue}</span>
          <span className="text-xs text-samurai-blue/60">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-samurai-blue/30 bg-samurai-dark p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            {options.map((option) => (
              <div
                key={option.id}
                className={clsx(
                  'cursor-pointer rounded-xl px-3 py-2 text-sm transition hover:bg-samurai-blue/10',
                  activeId === option.id ? 'bg-samurai-blue/15 text-white' : 'text-samurai-text/70'
                )}
                onClick={() => {
                  setOpen(false)
                  onSelect(option)
                }}
              >
                <p className="font-semibold">{option.label}</p>
                {option.helper && <p className="text-xs text-white/50">{option.helper}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function TodoForm({
  mode,
  initialTodo,
  submitting,
  onSubmit,
  onCancel,
  command,
  onCommandHandled,
}: TodoFormProps): React.ReactElement {
  const initialSnapshot = useMemo(() => deriveInitialState(initialTodo), [initialTodo])
  const [formState, setFormState] = useState<TodoFormState>(initialSnapshot)
  const [error, setError] = useState<string | null>(null)
  const [customDurationInput, setCustomDurationInput] = useState('')
  const [awaitingCustomDuration, setAwaitingCustomDuration] = useState(false)

  // Sync form state when initialTodo changes
  useEffect(() => {
    setFormState(initialSnapshot)
    setError(null)
    setAwaitingCustomDuration(false)
  }, [initialSnapshot])

  const handleRestart = useCallback(() => {
    setFormState((prev) => {
      const base = roundToNextQuarter(new Date())
      const newEnd = addMinutes(base, prev.durationMinutes || DEFAULT_DURATION_MINUTES)
      return {
        ...prev,
        startAt: base,
        endAt: newEnd,
        status: 'NOT_STARTED',
        manualStatus: false,
        startPresetId: 'now',
      }
    })
  }, [])

  // Auto-update status when dates change, unless manually overridden
  useEffect(() => {
    if (!formState.manualStatus) {
        const newStatus = determineStatus(formState.startAt, formState.endAt)
        if (newStatus !== formState.status) {
            setFormState(prev => ({ ...prev, status: newStatus }))
        }
    }
  }, [formState.startAt, formState.endAt, formState.manualStatus, formState.status])

  useEffect(() => {
    if (!command || mode !== 'edit' || !initialTodo) return
    if (command.type !== 'restart' || command.targetId !== initialTodo.id) return
    handleRestart()
    onCommandHandled?.()
  }, [command, handleRestart, initialTodo, mode, onCommandHandled])

  const handleChange = (field: keyof TodoFormState, value: string | Date | TodoStatus) => {
    setFormState((prev) => {
      if (field === 'startAt') {
        const newStart = value as Date
        // Auto-adjust end if start moves past it
        let newEnd = prev.endAt
        if (newEnd <= newStart) {
            newEnd = addMinutes(newStart, DEFAULT_DURATION_MINUTES)
        }
        return {
          ...prev,
          startAt: newStart,
          endAt: newEnd,
          durationMinutes: calculateDurationMinutes(newStart, newEnd),
          startPresetId: undefined,
        }
      }
      if (field === 'endAt') {
        const newEnd = value as Date
        return {
          ...prev,
          endAt: newEnd,
          durationMinutes: calculateDurationMinutes(prev.startAt, newEnd),
          durationPresetId: undefined,
        }
      }
      if (field === 'status') {
        return { ...prev, status: value as TodoStatus, manualStatus: true }
      }
      return { ...prev, [field]: value }
    })
  }

  const applyStartPreset = useCallback((option: PresetOption) => {
    const newStart = computeStartFromPreset(option.id)
    setFormState((prev) => {
      const alignedStart = roundToNextQuarter(newStart)
      const newEnd = addMinutes(alignedStart, prev.durationMinutes || DEFAULT_DURATION_MINUTES)
      return {
        ...prev,
        startAt: alignedStart,
        endAt: newEnd,
        startPresetId: option.id,
        manualStatus: false,
      }
    })
  }, [])

  const applyDurationPreset = useCallback((option: PresetOption) => {
    if (!option.minutes) {
      setAwaitingCustomDuration(true)
      return
    }
    setFormState((prev) => {
      const minutes = Math.max(MIN_DURATION_MINUTES, option.minutes ?? DEFAULT_DURATION_MINUTES)
      const newEnd = addMinutes(prev.startAt, minutes)
      return {
        ...prev,
        endAt: newEnd,
        durationMinutes: minutes,
        durationPresetId: option.id,
        manualStatus: false,
        cyclePresetId: undefined,
      }
    })
    setAwaitingCustomDuration(false)
    setCustomDurationInput('')
  }, [])

  const applyCyclePreset = useCallback((option: PresetOption) => {
    if (!option.minutes) return
    const minutes = Math.max(MIN_DURATION_MINUTES, option.minutes)
    setFormState((prev) => ({
      ...prev,
      endAt: addMinutes(prev.startAt, minutes),
      durationMinutes: minutes,
      cyclePresetId: option.id,
      durationPresetId: undefined,
    }))
  }, [])

  const applyCustomDuration = () => {
    const parsed = Number(customDurationInput)
    if (!Number.isFinite(parsed) || parsed < MIN_DURATION_MINUTES) {
      setError(`請輸入至少 ${MIN_DURATION_MINUTES} 分鐘的時長`)
      return
    }
    setError(null)
    setFormState((prev) => ({
      ...prev,
      endAt: addMinutes(prev.startAt, parsed),
      durationMinutes: parsed,
      durationPresetId: 'custom',
      cyclePresetId: undefined,
    }))
    setAwaitingCustomDuration(false)
    setCustomDurationInput('')
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

  const startDisplay = formState.startPresetId
    ? START_PRESETS.find((preset) => preset.id === formState.startPresetId)?.label ?? '自訂'
    : `${formState.startAt.toLocaleDateString('zh-TW')} ${formState.startAt.toLocaleTimeString('zh-TW', { hour12: false })}`

  const durationDisplay =
    formState.durationPresetId && formState.durationPresetId !== 'custom'
      ? DURATION_PRESETS.find((preset) => preset.id === formState.durationPresetId)?.label ?? `${formState.durationMinutes} 分`
      : `${formState.durationMinutes} 分`

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-6 overflow-hidden rounded-[32px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_55%)]" />
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
            <label className="text-xs font-tech text-samurai-blue/70 uppercase tracking-widest">指令名稱 (TITLE)</label>
            <input
                type="text"
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full bg-samurai-dark border border-samurai-blue/30 p-3 text-white placeholder-samurai-text/20 focus:border-samurai-blue focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition-all font-heading tracking-wide"
                placeholder="輸入任務名稱..."
            />
        </div>

        {/* Description Input */}
        <div className="space-y-1">
            <label className="text-xs font-tech text-samurai-blue/70 uppercase tracking-widest">詳細資訊 (DETAILS)</label>
            <textarea
                rows={3}
                value={formState.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full bg-samurai-dark border border-samurai-blue/30 p-3 text-samurai-text/80 placeholder-samurai-text/20 focus:border-samurai-blue outline-none transition-all font-mono text-sm"
                placeholder="// 額外參數..."
            />
        </div>

        {/* Date Pickers */}
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <label className="text-xs font-tech text-samurai-blue/70 uppercase tracking-widest">啟動序列 (START)</label>
                <TechCalendar 
                    value={formState.startAt} 
                    onChange={(date) => handleChange('startAt', date)} 
                    minDate={new Date()}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-tech text-samurai-blue/70 uppercase tracking-widest">終止序列 (END)</label>
                <TechCalendar 
                    value={formState.endAt} 
                    onChange={(date) => handleChange('endAt', date)} 
                    minDate={formState.startAt}
                />
            </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <PresetDropdown label="快速啟動" displayValue={startDisplay} options={START_PRESETS} activeId={formState.startPresetId} onSelect={applyStartPreset} />
            <PresetDropdown label="持續時間" displayValue={durationDisplay} options={DURATION_PRESETS} activeId={formState.durationPresetId} onSelect={applyDurationPreset} />
          </div>
          {awaitingCustomDuration && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl border border-samurai-blue/30 bg-black/30 p-3 text-sm">
              <span className="text-xs text-samurai-blue/70 tracking-[0.3em]">自訂分鐘</span>
              <input
                type="number"
                min={MIN_DURATION_MINUTES}
                value={customDurationInput}
                onChange={(e) => setCustomDurationInput(e.target.value)}
                className="w-24 rounded-lg border border-white/20 bg-black/50 px-2 py-1 text-white focus:border-samurai-blue outline-none"
                placeholder="30"
              />
              <TechButton type="button" variant="secondary" className="!px-3 !py-1 text-xs" onClick={applyCustomDuration}>
                套用
              </TechButton>
              <TechButton
                type="button"
                variant="ghost"
                className="!px-3 !py-1 text-xs text-samurai-red"
                onClick={() => {
                  setAwaitingCustomDuration(false)
                  setCustomDurationInput('')
                }}
              >
                取消
              </TechButton>
            </div>
          )}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">循環設定</p>
            <div className="flex flex-wrap gap-3">
              {CYCLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyCyclePreset(preset)}
                  className={clsx(
                    'rounded-2xl border px-4 py-2 text-xs uppercase tracking-[0.3em] transition',
                    formState.cyclePresetId === preset.id ? 'border-samurai-blue bg-samurai-blue/20 text-white' : 'border-white/15 text-white/70 hover:border-samurai-blue/40'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <TechButton type="button" variant="ghost" className="!px-4 !py-2 text-[11px]" onClick={handleRestart}>
              立即重啟
            </TechButton>
          </div>
        </div>

        {/* Status Override */}
        <div className="space-y-1">
            <label className="text-xs font-tech text-samurai-blue/70 uppercase tracking-widest flex justify-between">
                <span>目前狀態 (STATUS)</span>
                {!formState.manualStatus && <span className="text-samurai-yellow animate-pulse text-[10px]">[自動偵測]</span>}
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
                                ? 'border-samurai-blue bg-samurai-blue/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                                : 'border-samurai-blue/20 text-samurai-text/40 hover:border-samurai-blue/50 hover:text-samurai-text'
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-samurai-red/50 bg-samurai-red/10 text-samurai-red text-xs font-mono">
          ⚠ 錯誤: {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t border-samurai-blue/10">
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
