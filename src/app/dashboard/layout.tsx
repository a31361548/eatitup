import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-12 pt-28 sm:px-6 relative">
      {/* Ambient background glow for dashboard */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none"></div>
      
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row relative z-10">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 rounded-none border border-gold-500/20 bg-void-800/50 backdrop-blur-sm p-6 text-mythril-100 md:p-10 shadow-glow-gold">
          {/* Tech corners for main content */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500"></div>
          
          {children}
        </main>
      </div>
    </div>
  )
}
