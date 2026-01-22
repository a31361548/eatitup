import { ReactNode } from 'react'
import { BackgroundGrid } from '@/components/ui/BackgroundGrid'
import { TacticalHeader } from '@/components/layout/TacticalHeader'
import { AuxiliaryProvider } from '@/context/AuxiliaryContext'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuxiliaryProvider>
      <div className="relative min-h-screen w-full overflow-hidden text-white">
        <BackgroundGrid />
        <div className="fixed inset-0 -z-30 opacity-70" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_60%)] blur-3xl" />
          <div className="absolute inset-0 mix-blend-screen opacity-70" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <TacticalHeader />
        <main className="min-h-[calc(100vh-3.5rem)] w-full px-4 pb-24 pt-16 sm:px-6">
          <div className="mx-auto w-full max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </AuxiliaryProvider>
  )
}
