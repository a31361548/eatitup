import { ReactNode, ReactElement } from 'react'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className="relative px-4 pb-16 pt-24 sm:px-6">
      <div className="absolute inset-0 pixel-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 vignette" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1920px] gap-6 md:grid-cols-[220px_1fr]">
        <DashboardSidebar />
        <main className="min-w-0 border-4 border-aether-teal bg-[#031f1f]/95 p-6 text-aether-mint shadow-pixel-card">
          {children}
        </main>
      </div>
    </div>
  )
}
