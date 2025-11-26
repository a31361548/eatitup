'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { TodoForm, type TodoFormPayload } from './TodoForm'
import { PixelButton } from '@/components/PixelComponents'

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
      <div className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
        <p className="font-pixel text-pixel-xs uppercase tracking-pixel-wider text-aether-cyan">目前狀態</p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-header text-2xl text-white">{todo.title}</h2>
            <p className="font-pixel text-pixel-sm text-aether-mint/70">{TODO_STATUS_LABEL[todo.status]}</p>
          </div>
          <span className={clsx('border-2 px-4 py-1 font-pixel text-pixel-xs uppercase tracking-pixel-wide', TODO_STATUS_TONE[todo.status])}>
            {TODO_STATUS_LABEL[todo.status]}
          </span>
        </div>
        {feedback && (
          <div
            className={clsx(
              'mt-4 border-2 px-4 py-2 font-pixel text-pixel-sm uppercase tracking-pixel-wide',
              feedback.type === 'success' ? 'border-aether-teal text-aether-teal' : 'border-aether-alert text-aether-alert'
            )}
          >
            {feedback.message}
          </div>
        )}
        <PixelButton variant="danger" onClick={handleDelete} disabled={deleting} className="mt-4">
          {deleting ? '刪除中...' : '刪除這筆待辦'}
        </PixelButton>
      </div>

      <TodoForm mode="edit" initialTodo={todo} submitting={submitting} onSubmit={handleSubmit} />
    </div>
  )
}
