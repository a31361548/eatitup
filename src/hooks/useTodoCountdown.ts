import { useEffect, useMemo, useState } from 'react'
import type { Todo } from '@/types/todo'
import { getCountdownMetrics, type CountdownMetrics } from '@/lib/todoTime'

export type CountdownState = CountdownMetrics & {
  todoId: string
  startAt: Date
  endAt: Date
}

const REFRESH_INTERVAL = 1000

export const useTodoCountdown = (todo: Todo | null): CountdownState | null => {
  const [tick, setTick] = useState(() => Date.now())

  useEffect(() => {
    if (!todo) return
    const interval = setInterval(() => setTick(Date.now()), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [todo])

  const state = useMemo(() => {
    if (!todo) return null
    const startAt = new Date(todo.startAt)
    const endAt = new Date(todo.endAt)
    const metrics = getCountdownMetrics(todo.status, startAt, endAt, new Date(tick))
    return { ...metrics, todoId: todo.id, startAt, endAt }
  }, [todo, tick])

  return state
}
