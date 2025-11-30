'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { TodoForm, type TodoFormPayload } from './TodoForm'
import { TechButton } from '@/components/ui/TechButton'

type TodoDetailClientProps = {
  initialTodo: Todo
}

type Feedback = { type: 'success' | 'error'; message: string } | null

export function TodoDetailClient({ initialTodo }: TodoDetailClientProps): React.ReactElement {
  const [todo, setTodo] = useState<Todo>(initialTodo)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const router = useRouter()

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
        </div>
        {feedback && (
          <div
            className={clsx(
              'mt-4 rounded-2xl border px-4 py-3 text-sm font-tech uppercase tracking-[0.35em]',
              feedback.type === 'success' ? 'border-emerald-400/40 text-emerald-200' : 'border-red-400/50 text-red-200'
            )}
          >
            {feedback.message}
          </div>
        )}
        <TechButton variant="danger" onClick={handleDelete} disabled={deleting} className="mt-4 !px-5 !py-3">
          {deleting ? '刪除中...' : '刪除這筆待辦'}
        </TechButton>
      </div>

      <TodoForm mode="edit" initialTodo={todo} submitting={submitting} onSubmit={handleSubmit} />
    </div>
  )
}
