'use client'

import { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Todo } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE } from '@/types/todo'
import { TodoForm, type TodoFormPayload } from './TodoForm'

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
    <div className="space-y-8">
      <TodoForm
        mode={editing ? 'edit' : 'create'}
        initialTodo={editing ?? undefined}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={editing ? () => setEditing(null) : undefined}
      />

      <div className="border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-pixel text-pixel-sm uppercase tracking-pixel-wider text-aether-cyan">
            <p>Tasks Overview</p>
            <p className="mt-2 text-base tracking-pixel-wide text-white">
              總計 {todos.length} 筆 | 未完成 {activeTodoCount}
            </p>
          </div>
          <div className="flex gap-3 font-pixel text-pixel-xs uppercase tracking-pixel-wide">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="border-2 border-aether-teal px-3 py-2 text-aether-teal hover:bg-aether-teal hover:text-aether-dark transition"
            >
              新增
            </button>
            <button
              type="button"
              onClick={refresh}
              className={clsx(
                'border-2 border-aether-cyan px-3 py-2 text-aether-cyan hover:bg-aether-cyan hover:text-aether-dark transition',
                refreshing && 'opacity-60'
              )}
              disabled={refreshing}
            >
              {refreshing ? '更新中' : '刷新'}
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className={clsx(
              'mt-4 border-2 px-4 py-2 font-pixel text-pixel-sm uppercase tracking-pixel-wide',
              feedback.type === 'success'
                ? 'border-aether-teal text-aether-teal'
                : 'border-aether-alert text-aether-alert'
            )}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {hasTodos ? (
            todos.map((todo) => (
              <article key={todo.id} className="border-2 border-aether-dim px-4 py-4 hover:border-aether-cyan transition">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-header text-xl text-white">{todo.title}</h3>
                    {todo.description && <p className="font-pixel text-pixel-sm text-aether-mint/70">{todo.description}</p>}
                  </div>
                  <span
                    className={clsx(
                      'border-2 px-3 py-1 font-pixel text-pixel-xs uppercase tracking-pixel-wide',
                      TODO_STATUS_TONE[todo.status]
                    )}
                  >
                    {TODO_STATUS_LABEL[todo.status]}
                  </span>
                </div>
                <dl className="mt-4 grid gap-4 font-pixel text-pixel-sm text-aether-mint/70 sm:grid-cols-2">
                  <div className="border border-aether-dim px-3 py-2">
                    <dt>開始</dt>
                    <dd className="text-white">{formatDateTime(todo.startAt)}</dd>
                  </div>
                  <div className="border border-aether-dim px-3 py-2">
                    <dt>結束</dt>
                    <dd className="text-white">{formatDateTime(todo.endAt)}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-3 font-pixel text-pixel-xs uppercase tracking-pixel-wide">
                  <button
                    type="button"
                    onClick={() => setEditing(todo)}
                    className="border-2 border-aether-teal px-3 py-2 text-aether-teal hover:bg-aether-teal hover:text-aether-dark transition"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo)}
                    className="border-2 border-aether-alert px-3 py-2 text-aether-alert hover:bg-aether-alert hover:text-aether-dark transition"
                    disabled={deletingId === todo.id}
                  >
                    {deletingId === todo.id ? '刪除中' : '刪除'}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="border-2 border-dashed border-aether-dim px-4 py-6 text-center font-pixel text-pixel-sm text-aether-mint/60">
              目前沒有待辦事項，先在上方建立第一筆吧！
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
