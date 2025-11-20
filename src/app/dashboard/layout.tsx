import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-12 pt-28 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 text-white md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
