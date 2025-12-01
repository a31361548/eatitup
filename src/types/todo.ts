export type TodoStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
export type TodoPhase = 'UPCOMING' | 'ACTIVE' | 'OVERDUE' | 'DONE'

export type Todo = {
  id: string
  title: string
  description: string | null
  status: TodoStatus
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
}

export const TODO_STATUS_LABEL: Record<TodoStatus, string> = {
  NOT_STARTED: '尚未開始',
  IN_PROGRESS: '進行中',
  COMPLETED: '已完成',
  FAILED: '未完成',
}

export const TODO_STATUS_TONE: Record<TodoStatus, string> = {
  NOT_STARTED: 'border-aether-dim text-aether-mint/70',
  IN_PROGRESS: 'border-aether-cyan text-aether-cyan',
  COMPLETED: 'border-aether-teal text-aether-teal',
  FAILED: 'border-aether-alert text-aether-alert',
}

export const TODO_STATUS_OPTIONS = (Object.keys(TODO_STATUS_LABEL) as TodoStatus[]).map((value) => ({
  value,
  label: TODO_STATUS_LABEL[value],
}))

export const TODO_PHASE_LABEL: Record<TodoPhase, string> = {
  UPCOMING: '待啟動',
  ACTIVE: '進行中',
  OVERDUE: '超時',
  DONE: '已結束',
}
