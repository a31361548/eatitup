export type TodoStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

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
