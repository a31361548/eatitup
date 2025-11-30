'use client'

import { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { TodoForm, type TodoFormPayload } from './TodoForm'
import { TechButton } from '@/components/ui/TechButton'

type TodosClientProps = {
  initialTodos: Todo[]
}

type Feedback = { type: 'success' | 'error'; message: string } | null

const sortTodos = (items: Todo[]): Todo[] => {
  return [...items].sort((a, b) => {
    const diff = new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    if (diff !== 0) return diff
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

const formatDateTime = (value: string): string => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function TodosClient({ initialTodos }: TodosClientProps): React.ReactElement {
  const [todos, setTodos] = useState<Todo[]>(() => sortTodos(initialTodos))
  const [editing, setEditing] = useState<Todo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const hasTodos = todos.length > 0

  const handleSubmit = async (payload: TodoFormPayload) => {
    setSubmitting(true)
    setFeedback(null)
    try {
      const target = editing ? `/api/todos/${editing.id}` : '/api/todos'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(target, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '儲存失敗')
      }
      const data = await res.json()
      const nextTodo: Todo = data.todo
      setTodos((prev) => sortTodos([...prev.filter((item) => item.id !== nextTodo.id), nextTodo]))
      setFeedback({ type: 'success', message: editing ? '已更新待辦' : '已建立待辦' })
      setEditing(null)
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '儲存失敗' })
    } finally {
      setSubmitting(false)
    }
  }

  const refresh = useCallback(async () => {
    setRefreshing(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/todos')
      if (!res.ok) throw new Error('無法取得待辦清單')
      const data = await res.json()
      setTodos(sortTodos(data.todos))
      setFeedback({ type: 'success', message: '已更新列表' })
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '刷新失敗' })
    } finally {
      setRefreshing(false)
    }
  }, [])

  const handleDelete = async (todo: Todo) => {
    const confirmed = window.confirm(`確定刪除「${todo.title}」嗎？`)
    if (!confirmed) return
    setDeletingId(todo.id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('刪除失敗')
      setTodos((prev) => prev.filter((item) => item.id !== todo.id))
      setFeedback({ type: 'success', message: '已刪除待辦' })
      if (editing?.id === todo.id) setEditing(null)
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : '刪除失敗' })
    } finally {
      setDeletingId(null)
    }
  }

  const activeTodoCount = useMemo(() => todos.filter((todo) => todo.status !== 'COMPLETED').length, [todos])

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section>
        <TodoForm
          mode={editing ? 'edit' : 'create'}
          initialTodo={editing ?? undefined}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-white/10 bg-black/30 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-tech uppercase tracking-[0.45em] text-white/60">Task Overview</p>
              <p className="text-lg font-pixel uppercase tracking-[0.3em]">總計 {todos.length} 筆 | 未完成 {activeTodoCount}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <TechButton variant="secondary" className="!px-4 !py-2" onClick={() => setEditing(null)}>
                新任務
              </TechButton>
              <TechButton
                variant="primary"
                className={clsx('!px-4 !py-2', refreshing && 'opacity-60')}
                onClick={refresh}
                disabled={refreshing}
              >
                {refreshing ? '更新中' : '刷新'}
              </TechButton>
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
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/5 to-black/20 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="max-h-[600px] space-y-4 overflow-auto pr-1">
            {hasTodos ? (
              todos.map((todo) => (
                <article key={todo.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white transition hover:border-cyan-200/60">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">ID: {todo.id.slice(0, 6)}</p>
                      <h3 className="text-2xl font-heading">{todo.title}</h3>
                      {todo.description && <p className="text-sm text-white/70">{todo.description}</p>}
                    </div>
                    <span className={clsx('rounded-full border px-4 py-1 text-xs font-tech uppercase tracking-[0.35em]', TODO_STATUS_TONE[todo.status])}>
                      {TODO_STATUS_LABEL[todo.status]}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                      <dt className="text-xs uppercase tracking-[0.4em] text-white/50">開始</dt>
                      <dd className="font-mono text-white">{formatDateTime(todo.startAt)}</dd>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                      <dt className="text-xs uppercase tracking-[0.4em] text-white/50">結束</dt>
                      <dd className="font-mono text-white">{formatDateTime(todo.endAt)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs font-tech uppercase tracking-[0.35em]">
                    <TechButton variant="secondary" className="!px-4 !py-2" onClick={() => setEditing(todo)}>
                      編輯
                    </TechButton>
                    <TechButton
                      variant="danger"
                      className="!px-4 !py-2"
                      onClick={() => handleDelete(todo)}
                      disabled={deletingId === todo.id}
                    >
                      {deletingId === todo.id ? '刪除中' : '刪除'}
                    </TechButton>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/60">
                目前沒有任務，請在左側建立第一筆。
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
