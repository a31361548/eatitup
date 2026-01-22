'use client'

import { ReactNode } from 'react'
import { JarvisSidebar } from '@/components/layout/JarvisSidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full pt-14">
      {/* Left Sidebar - Fixed */}
      <JarvisSidebar />
      
      {/* Right Sidebar - Fixed (Desktop Only) */}
      <RightSidebar />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-3.5rem)] w-full px-4 pb-24 pt-6 sm:px-6 lg:pl-20 xl:pr-[300px] transition-all duration-300">
         <div className="mx-auto w-full h-full max-w-[1440px]">
           {children}
         </div>
      </main>
    </div>
  )
}
