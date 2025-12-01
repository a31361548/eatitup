import type { Todo, TodoStatus } from '@/types/todo'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

type PatchPayload = Partial<{ title: string; description?: string; startAt: string; endAt: string; status: TodoStatus }>

const patchTodo = async (id: string, payload: PatchPayload) => {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '更新失敗')
  }
  const data = await res.json()
  return data.todo as Todo
}

export const updateTodoStatus = (id: string, status: TodoStatus) => {
  return patchTodo(id, { status })
}

export const delayTodo = (todo: Todo, minutes: number) => {
  const delta = minutes * 60 * 1000
  const startAt = new Date(todo.startAt)
  const endAt = new Date(todo.endAt)
  const nextStart = new Date(startAt.getTime() + delta)
  const nextEnd = new Date(endAt.getTime() + delta)
  return patchTodo(todo.id, { startAt: nextStart.toISOString(), endAt: nextEnd.toISOString() })
}

export const restartTodoNow = (todo: Todo, durationMinutes: number) => {
  const startAt = new Date()
  startAt.setSeconds(0, 0)
  const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000)
  return patchTodo(todo.id, { startAt: startAt.toISOString(), endAt: endAt.toISOString(), status: 'NOT_STARTED' })
}

export const extendTodo = (todo: Todo, minutes: number) => {
  const endAt = new Date(todo.endAt)
  const nextEnd = new Date(endAt.getTime() + minutes * 60 * 1000)
  return patchTodo(todo.id, { endAt: nextEnd.toISOString() })
}
