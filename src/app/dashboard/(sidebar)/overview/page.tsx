import { getAuthenticatedUser } from '@/lib/currentUser'
import { CheckInCalendar } from '@/components/CheckInCalendar'
import { HoloWindow } from '@/components/ui/HoloWindow'
import { TechButton } from '@/components/ui/TechButton'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  return (
    <HoloWindow title="SYSTEM OVERVIEW" className="h-full">
      <div className="space-y-8">
        {/* User Profile Section */}
        <div className="flex flex-col gap-6 p-6 border border-aether-cyan/20 bg-aether-cyan/5 rounded lg:flex-row lg:items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          
          <div className="relative h-24 w-24 rounded-full border-2 border-aether-cyan overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl bg-aether-dark text-aether-cyan">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-aether-cyan/50 to-transparent opacity-30" />
          </div>
          
          <div className="space-y-2 font-tech z-10">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs uppercase tracking-widest text-aether-mint/70">OPERATOR ONLINE</p>
            </div>
            <h1 className="font-heading text-2xl text-white tracking-wide drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
              WELCOME BACK, {user.name || 'COMMANDER'}
            </h1>
            <p className="text-sm uppercase tracking-wider text-aether-cyan/80">
              SYSTEM STATUS: NOMINAL | READY FOR INSTRUCTION
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Mission Center */}
          <div className="border border-aether-cyan/20 bg-aether-dark/50 p-6 rounded relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent" />
            
            <h2 className="font-heading text-xl text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.93 4.93 14.14 14.14"/><path d="m19.07 4.93-14.14 14.14"/></svg>
                MISSION CONTROL
            </h2>
            <p className="mb-6 font-tech text-sm uppercase tracking-wide text-aether-mint/60">
              QUICK ACCESS PROTOCOLS
            </p>
            
            <div className="grid gap-4">
              <Link href="/modes/wheel">
                <TechButton variant="primary" className="w-full" icon={<span className="text-xl">🎡</span>}>
                  INITIATE WHEEL PROTOCOL
                </TechButton>
              </Link>
              <Link href="/dashboard/todos">
                <TechButton variant="secondary" className="w-full" icon={<span className="text-xl">💻</span>}>
                  ACCESS TASK DATABASE
                </TechButton>
              </Link>
            </div>
          </div>

          {/* Calendar Wrapper */}
          <div className="border border-aether-cyan/20 bg-aether-dark/50 p-4 rounded relative">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aether-cyan/50 to-transparent" />
             <h3 className="font-tech text-sm uppercase tracking-widest text-aether-cyan mb-4 text-center">TEMPORAL LOG</h3>
             <CheckInCalendar />
          </div>
        </div>
      </div>
    </HoloWindow>
  )
}
