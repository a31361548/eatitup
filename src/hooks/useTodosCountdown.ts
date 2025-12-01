import { useEffect, useMemo, useRef, useState } from 'react'
import type { Todo } from '@/types/todo'
import { getCountdownMetrics, type CountdownMetrics, type CountdownPhase } from '@/lib/todoTime'

export type CountdownEntry = CountdownMetrics & {
  todo: Todo
  startAt: Date
  endAt: Date
}

type CountdownOptions = {
  onPhaseChange?: (todo: Todo, phase: CountdownPhase) => void
}

const INTERVAL = 1000

export const useTodosCountdown = (todos: Todo[], options?: CountdownOptions): CountdownEntry[] => {
  const [tick, setTick] = useState(() => Date.now())
  const phaseRef = useRef<Record<string, CountdownPhase>>({})

  useEffect(() => {
    const nextMap: Record<string, CountdownPhase> = {}
    for (const todo of todos) {
      const prevPhase = phaseRef.current[todo.id]
      if (prevPhase) {
        nextMap[todo.id] = prevPhase
      }
    }
    phaseRef.current = nextMap
  }, [todos])

  useEffect(() => {
    if (todos.length === 0) return
    setTick(Date.now())
    const interval = setInterval(() => setTick(Date.now()), INTERVAL)
    return () => clearInterval(interval)
  }, [todos])

  return useMemo(() => {
    if (todos.length === 0) return []
    const now = new Date(tick)
    return todos.map((todo) => {
      const startAt = new Date(todo.startAt)
      const endAt = new Date(todo.endAt)
      const metrics = getCountdownMetrics(todo.status, startAt, endAt, now)
      const prevPhase = phaseRef.current[todo.id]
      if (options?.onPhaseChange && prevPhase !== metrics.phase) {
        phaseRef.current[todo.id] = metrics.phase
        options.onPhaseChange(todo, metrics.phase)
      } else if (prevPhase === undefined) {
        phaseRef.current[todo.id] = metrics.phase
      }
      return { ...metrics, todo, startAt, endAt }
    })
  }, [todos, tick, options])
}
