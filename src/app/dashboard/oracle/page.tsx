import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { OracleClient } from '@/components/oracle/OracleClient'

export const dynamic = 'force-dynamic'

export default async function OraclePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')
  
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email }, 
    select: { id: true } 
  })
  
  if (!user) redirect('/login')

  const lists = await prisma.list.findMany({
    where: { ownerId: user.id },
    include: { items: true },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="h-full">
      <OracleClient initialLists={lists} />
    </div>
  )
}
