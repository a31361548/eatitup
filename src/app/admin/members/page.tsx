import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/authOptions'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'
import MembersClient from './ui/MembersClient'

export default async function AdminMembersPage(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return (
    <HoloWindow
      title="COMMAND CREW REGISTRY"
      className="h-full"
      controls={
        <Link href="/dashboard">
          <TechButton variant="ghost" className="!px-4 !py-2 text-[11px]">
            返回儀表板
          </TechButton>
        </Link>
      }
    >
      <div className="space-y-8">
        <section className="rounded-[34px] border border-white/10 bg-black/25 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-tech uppercase tracking-[0.4em] text-white/60">權限提醒</p>
          <h1 className="font-pixel text-pixel-xl uppercase tracking-[0.35em]">成員管理</h1>
          <p className="text-sm text-white/70">僅限管理員新增或編輯帳號，所有變更會立即同步。</p>
        </section>
        <MembersClient />
      </div>
    </HoloWindow>
  )
}
