import type { TodoStatus } from '@/types/todo'

export const MIN_DURATION_MS = 5 * 60 * 1000
export const DEFAULT_DURATION_MS = 25 * 60 * 1000

export type TimeRange = {
  startAt: Date
  endAt: Date
}

export const toDate = (value?: string | number | Date | null): Date | null => {
  if (!value) return null
  const parsed = value instanceof Date ? value : new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const clampToFuture = (candidate: Date, now = new Date()): Date => {
  return candidate.getTime() < now.getTime() ? now : candidate
}

export const ensureMinimumDuration = (startAt: Date, endAt: Date, minDuration = MIN_DURATION_MS): Date => {
  const minimumEnd = startAt.getTime() + minDuration
  if (endAt.getTime() <= startAt.getTime()) {
    return new Date(minimumEnd)
  }
  if (endAt.getTime() < minimumEnd) {
    return new Date(minimumEnd)
  }
  return endAt
}

export const resolveAutoStatus = (
  requestedStatus: TodoStatus | undefined,
  startAt: Date,
  endAt: Date,
  now = new Date()
): TodoStatus => {
  if (requestedStatus === 'COMPLETED' || requestedStatus === 'FAILED') {
    return requestedStatus
  }
  if (requestedStatus === 'IN_PROGRESS') {
    return now > endAt ? 'FAILED' : 'IN_PROGRESS'
  }
  if (now >= startAt && now <= endAt) {
    return 'IN_PROGRESS'
  }
  return requestedStatus ?? 'NOT_STARTED'
}

export type CountdownPhase = 'UPCOMING' | 'ACTIVE' | 'OVERDUE' | 'DONE'

export type CountdownMetrics = {
  phase: CountdownPhase
  startsIn: number
  endsIn: number
}

export const getCountdownMetrics = (status: TodoStatus, startAt: Date, endAt: Date, now = new Date()): CountdownMetrics => {
  if (status === 'COMPLETED' || status === 'FAILED') {
    return { phase: 'DONE', startsIn: 0, endsIn: 0 }
  }
  const startsIn = startAt.getTime() - now.getTime()
  const endsIn = endAt.getTime() - now.getTime()
  if (startsIn > 0) {
    return { phase: 'UPCOMING', startsIn, endsIn }
  }
  if (endsIn > 0) {
    return { phase: 'ACTIVE', startsIn, endsIn }
  }
  return { phase: 'OVERDUE', startsIn, endsIn }
}

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const segments = [hours, minutes, seconds].map((segment) => segment.toString().padStart(2, '0'))
  return segments.join(':')
}
