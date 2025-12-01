'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Todo, TodoStatus } from '@/types/todo'
import { TODO_STATUS_LABEL, TODO_STATUS_TONE, TODO_PHASE_LABEL } from '@/types/todo'
import { TodoForm, type TodoFormCommand, type TodoFormPayload } from './TodoForm'
import { TechButton } from '@/components/ui/TechButton'
import { useTodosCountdown } from '@/hooks/useTodosCountdown'
import { formatDuration, type CountdownPhase } from '@/lib/todoTime'
import { delayTodo, updateTodoStatus } from '@/lib/todoActions'

type TodosClientProps = {
  initialTodos: Todo[]
}

type Feedback = { type: 'success' | 'error'; message: string } | null
const DELAY_OPTIONS = [5, 10, 25] as const

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
  const [formCommand, setFormCommand] = useState<TodoFormCommand | null>(null)
  const [mutatingId, setMutatingId] = useState<string | null>(null)
  useEffect(() => {
    if (!editing) {
      setFormCommand(null)
    }
  }, [editing])

  const hasTodos = todos.length > 0

  const updateLocalTodo = useCallback((nextTodo: Todo) => {
    setTodos((prev) => sortTodos([...prev.filter((item) => item.id !== nextTodo.id), nextTodo]))
  }, [])

  const handleQuickStatus = useCallback(
    async (todo: Todo, status: TodoStatus, successMessage: string) => {
      setMutatingId(todo.id)
      setFeedback(null)
      try {
        const updated = await updateTodoStatus(todo.id, status)
        updateLocalTodo(updated)
        setFeedback({ type: 'success', message: successMessage })
      } catch (error) {
        setFeedback({ type: 'error', message: error instanceof Error ? error.message : '更新失敗' })
      } finally {
        setMutatingId(null)
      }
    },
    [updateLocalTodo]
  )

  const handleDelay = useCallback(
    async (todo: Todo, minutes: number) => {
      setMutatingId(todo.id)
      setFeedback(null)
      try {
        const updated = await delayTodo(todo, minutes)
        updateLocalTodo(updated)
        setFeedback({ type: 'success', message: `已延後 ${minutes} 分鐘` })
      } catch (error) {
        setFeedback({ type: 'error', message: error instanceof Error ? error.message : '延後失敗' })
      } finally {
        setMutatingId(null)
      }
    },
    [updateLocalTodo]
  )

  const handleCustomDelay = useCallback(
    async (todo: Todo) => {
      const value = window.prompt('延後幾分鐘？', '15')
      if (!value) return
      const minutes = Number(value)
      if (!Number.isFinite(minutes) || minutes <= 0) {
        setFeedback({ type: 'error', message: '請輸入有效的分鐘數' })
        return
      }
      await handleDelay(todo, minutes)
    },
    [handleDelay]
  )

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

  const handlePhaseChange = useCallback((todo: Todo, phase: CountdownPhase) => {
    if (phase === 'ACTIVE' && todo.status === 'NOT_STARTED') {
      updateTodoStatus(todo.id, 'IN_PROGRESS')
        .then((next) => {
          updateLocalTodo(next)
          setFeedback({ type: 'success', message: `「${next.title}」已自動啟動` })
        })
        .catch((error) => {
          setFeedback({ type: 'error', message: error instanceof Error ? error.message : '自動啟動失敗' })
        })
    }
  }, [updateLocalTodo])

  const countdownEntries = useTodosCountdown(todos, { onPhaseChange: handlePhaseChange })
  const countdownMap = useMemo(() => new Map(countdownEntries.map((entry) => [entry.todo.id, entry])), [countdownEntries])

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
          command={formCommand}
          onCommandHandled={() => setFormCommand(null)}
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
              todos.map((todo) => {
                const countdown = countdownMap.get(todo.id)
                const countdownText = countdown
                  ? countdown.phase === 'UPCOMING'
                    ? `距開始 ${formatDuration(countdown.startsIn)}`
                    : countdown.phase === 'ACTIVE'
                      ? `距結束 ${formatDuration(countdown.endsIn)}`
                      : countdown.phase === 'OVERDUE'
                        ? `超時 ${formatDuration(Math.abs(countdown.endsIn))}`
                        : null
                  : null
                const isMutating = mutatingId === todo.id
                return (
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
                    {countdownText && (
                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-3">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">{TODO_PHASE_LABEL[countdown?.phase ?? 'UPCOMING']}</p>
                        <p className={clsx('font-mono text-xl', countdown?.phase === 'OVERDUE' ? 'text-red-300' : 'text-aether-cyan')}>
                          {countdownText}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-tech uppercase tracking-[0.35em]">
                      <div className="flex flex-wrap gap-2">
                        <TechButton variant="secondary" className="!px-4 !py-2" onClick={() => setEditing(todo)}>
                          編輯
                        </TechButton>
                        <TechButton
                          variant="ghost"
                          className="!px-4 !py-2 text-[11px]"
                          onClick={() => {
                            setEditing(todo)
                            setFormCommand({ type: 'restart', targetId: todo.id, issuedAt: Date.now() })
                          }}
                        >
                          重啟
                        </TechButton>
                      </div>
                      <TechButton
                        variant="danger"
                        className="!px-4 !py-2"
                        onClick={() => handleDelete(todo)}
                        disabled={deletingId === todo.id}
                      >
                        {deletingId === todo.id ? '刪除中' : '刪除'}
                      </TechButton>
                      <TechButton
                        variant="primary"
                        className="!px-4 !py-2"
                        onClick={() => handleQuickStatus(todo, 'COMPLETED', `「${todo.title}」已完成`)}
                        disabled={isMutating}
                      >
                        {isMutating ? '處理中' : '完成'}
                      </TechButton>
                      <div className="flex flex-wrap gap-2">
                        {DELAY_OPTIONS.map((minutes) => (
                          <button
                            key={minutes}
                            type="button"
                            className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/70 transition hover:border-aether-cyan"
                            onClick={() => handleDelay(todo, minutes)}
                            disabled={isMutating}
                          >
                            +{minutes} 分
                          </button>
                        ))}
                        <button
                          type="button"
                          className="rounded-full border border-dashed border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/60"
                          onClick={() => handleCustomDelay(todo)}
                          disabled={isMutating}
                        >
                          自訂延後
                        </button>
                      </div>
                      <TechButton
                        variant="ghost"
                        className="!px-4 !py-2 text-red-300"
                        onClick={() => handleQuickStatus(todo, 'FAILED', `「${todo.title}」標記為未完成`)}
                        disabled={isMutating}
                      >
                        未完成
                      </TechButton>
                    </div>
                  </article>
                )
              })
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
