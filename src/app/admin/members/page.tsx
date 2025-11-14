import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'
import { PageShell } from '@/components/ui/PageShell'
import { GlowCard } from '@/components/ui/GlowCard'
import MembersClient from './ui/MembersClient'

export default async function AdminMembersPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return (
    <PageShell className="space-y-10">
      <header className="space-y-3 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Member Management</p>
        <h1 className="text-3xl font-semibold">成員管理</h1>
        <p className="text-white/70">僅限管理員新增或編輯帳號，所有操作會立即同步到資料庫。</p>
      </header>
      <GlowCard
        title="安全提醒"
        description="密碼會以雜湊形式儲存，管理員無法查看原文密碼。如需重設，請直接輸入新密碼。"
        icon="🔐"
      />
      <MembersClient />
    </PageShell>
  )
}
