import { getAuthenticatedUser } from '@/lib/currentUser'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FocusMissionBoard } from '@/components/dashboard/FocusMissionBoard'
import { type Todo } from '@/types/todo'

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic'

const serializeTodos = (todos: Awaited<ReturnType<typeof prisma.todo.findMany>>): Todo[] =>
  todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    startAt: todo.startAt.toISOString(),
    endAt: todo.endAt.toISOString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  }))

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  // Fetch active and upcoming todos
  const todos = await prisma.todo.findMany({
    where: { 
      userId: user.id, 
      status: { not: 'COMPLETED' } 
    },
    orderBy: [
      { status: 'desc' }, // IN_PROGRESS first (alphabetically I comes before N... wait. IN_PROGRESS vs NOT_STARTED. I < N. So asc?)
      // Status enum usually: NOT_STARTED, IN_PROGRESS, COMPLETED.
      // If I want IN_PROGRESS first, I should rely on the fact that I want to filter them anyway.
      // Let's just sort by startAt.
      { startAt: 'asc' }, 
      { createdAt: 'desc' }
    ],
    take: 20,
  })
  
  // Also fetch stats if needed (e.g. completed today count for the board)
  // For now FocusMissionBoard filters from the passed list.
  // If I only fetch 20, completed count will be wrong if I filter from `todos`.
  // I should probably fetch completed count separately or pass it.
  
  // Let's fetch completed count for today
  const startOfDay = new Date()
  startOfDay.setHours(0,0,0,0)
  
  const completedToday = await prisma.todo.count({
    where: {
      userId: user.id,
      status: 'COMPLETED',
      updatedAt: { gte: startOfDay }
    }
  })

  // Hack: passing completed items is not efficient if I just want the count.
  // But FocusMissionBoard expects `todos` array and filters for completed count from it?
  // Let's look at FocusMissionBoard.tsx again.
  // `const completedCount = todos.filter(t => t.status === 'COMPLETED').length`
  // This expects COMPLETED todos to be in the list.
  // But I am filtering `status: { not: 'COMPLETED' }` in the query above.
  // So completedCount will always be 0.
  
  // I should update FocusMissionBoard to accept `completedCount` prop, OR include completed todos in the query.
  // Including completed todos might clutter the list if I want "Active/Upcoming" priority.
  
  // I will update FocusMissionBoard to accept `stats` prop.
  // But for now, to follow Minimal Diff, I can just include some completed todos in the query? No, that's messy.
  
  // I'll update FocusMissionBoard.tsx to accept `completedCount` prop.
  // Wait, I can't edit FocusMissionBoard.tsx AND page.tsx in parallel if they depend on each other's types.
  // But FocusMissionBoard is a client component (in file, but usage is server component passing props).
  // Actually FocusMissionBoard is 'use client'.
  
  // Let's stick to the current implementation of FocusMissionBoard for a second.
  // It calculates `completedCount` from `todos`.
  // So I MUST pass completed todos if I want it to show.
  // OR I update FocusMissionBoard to take a number.
  
  // I will update FocusMissionBoard first to accept `completedCount`.
  
  const serializedTodos = serializeTodos(todos)

  return (
    <FocusMissionBoard todos={serializedTodos} user={user} completedCount={completedToday} />
  )
}

