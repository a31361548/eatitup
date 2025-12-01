import { ReactNode } from 'react'
import { BackgroundGrid } from '@/components/ui/BackgroundGrid'
import { JarvisSidebar } from '@/components/layout/JarvisSidebar'
import { TacticalHeader } from '@/components/layout/TacticalHeader'

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <BackgroundGrid />
      <div className="fixed inset-0 -z-30 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 mix-blend-screen opacity-70" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>
      <TacticalHeader />
      <JarvisSidebar />
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 pb-16 pt-28 sm:px-6 md:px-8 lg:pt-32 lg:pl-40 lg:pr-12">
        {children}
      </div>
    </div>
  )
}
