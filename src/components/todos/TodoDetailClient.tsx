'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { TodoForm, type TodoFormPayload } from './TodoForm'
import { TechButton } from '@/components/ui/TechButton'
import { useTodoCountdown } from '@/hooks/useTodoCountdown'
import { formatDuration } from '@/lib/todoTime'
import { delayTodo, updateTodoStatus } from '@/lib/todoActions'

type TodoDetailClientProps = {
  initialTodo: Todo
}

type Feedback = { type: 'success' | 'error'; message: string } | null

export function TodoDetailClient({ initialTodo }: TodoDetailClientProps): React.ReactElement {
  const [todo, setTodo] = useState<Todo>(initialTodo)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actioning, setActioning] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const router = useRouter()
  const countdown = useTodoCountdown(todo)
  const countdownDisplay = useMemo(() => {
    if (!countdown) return null
    if (countdown.phase === 'DONE') return null
    const label = countdown.phase === 'UPCOMING' ? '距離啟動' : countdown.phase === 'ACTIVE' ? '距離結束' : '已超時'
    const value = countdown.phase === 'OVERDUE' ? formatDuration(Math.abs(countdown.endsIn)) : formatDuration(countdown.phase === 'UPCOMING' ? countdown.startsIn : countdown.endsIn)
    return { label, value, phase: countdown.phase }
  }, [countdown])

  const handleSubmit = async (payload: TodoFormPayload) => {
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '更新失敗')
      }
      const data = await res.json()
      setTodo(data.todo)
      setFeedback({ type: 'success', message: '待辦已更新' })
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '更新失敗' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(`確定要刪除「${todo.title}」嗎？`)
    if (!confirmed) return
    setDeleting(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('刪除失敗')
      router.push('/dashboard/todos')
      router.refresh()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '刪除失敗' })
      setDeleting(false)
    }
  }

  const handleQuickStatus = async (status: 'COMPLETED' | 'FAILED', successMessage: string) => {
    setActioning(true)
    setFeedback(null)
    try {
      const updated = await updateTodoStatus(todo.id, status)
      setTodo(updated)
      setFeedback({ type: 'success', message: successMessage })
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '操作失敗' })
    } finally {
      setActioning(false)
    }
  }

  const handleDelay = async (minutes: number) => {
    setActioning(true)
    setFeedback(null)
    try {
      const updated = await delayTodo(todo, minutes)
      setTodo(updated)
      setFeedback({ type: 'success', message: `已延後 ${minutes} 分鐘` })
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '延後失敗' })
    } finally {
      setActioning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">Current Status</p>
            <h2 className="text-2xl font-heading">{todo.title}</h2>
          </div>
          <span className={clsx('rounded-full border px-4 py-1 text-xs font-tech uppercase tracking-[0.35em]', TODO_STATUS_TONE[todo.status])}>
            {TODO_STATUS_LABEL[todo.status]}
          </span>
        </div>
        <div className="mt-4 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">開始</p>
            <p className="font-mono text-white">{new Date(todo.startAt).toLocaleString('zh-TW')}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">結束</p>
            <p className="font-mono text-white">{new Date(todo.endAt).toLocaleString('zh-TW')}</p>
          </div>
          {countdownDisplay && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">{countdownDisplay.label}</p>
              <p className={clsx('font-mono text-2xl', countdownDisplay.phase === 'OVERDUE' ? 'text-samurai-red' : 'text-samurai-blue')}>
                {countdownDisplay.value}
              </p>
            </div>
          )}
        </div>
        {feedback && (
          <div
            className={clsx(
              'mt-4 rounded-2xl border px-4 py-3 text-sm font-tech uppercase tracking-[0.35em]',
              feedback.type === 'success' ? 'border-samurai-success/40 text-samurai-success' : 'border-samurai-red/50 text-samurai-red'
            )}
          >
            {feedback.message}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-tech uppercase tracking-[0.35em]">
          <TechButton variant="primary" onClick={() => handleQuickStatus('COMPLETED', '已標記完成')} disabled={actioning}>
            {actioning ? '處理中' : '完成'}
          </TechButton>
          <div className="flex gap-2">
            {[5, 10, 25].map((minutes) => (
              <button
                key={minutes}
                type="button"
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/70"
                onClick={() => handleDelay(minutes)}
                disabled={actioning}
              >
                +{minutes} 分
              </button>
            ))}
          </div>
          <TechButton variant="ghost" className="text-samurai-red" onClick={() => handleQuickStatus('FAILED', '已標記未完成')} disabled={actioning}>
            未完成
          </TechButton>
          <TechButton variant="danger" onClick={handleDelete} disabled={deleting} className="!px-5 !py-3">
            {deleting ? '刪除中...' : '刪除'}
          </TechButton>
        </div>
      </div>

      <TodoForm mode="edit" initialTodo={todo} submitting={submitting} onSubmit={handleSubmit} />
    </div>
  )
}
