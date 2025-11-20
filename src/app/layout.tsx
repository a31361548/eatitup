import { ReactNode } from 'react'
import './globals.css'
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs'
import { Navbar } from '@/components/ui/Navbar'
import { Providers } from '@/components/Providers'

export default function RootLayout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Providers>
          <BackgroundOrbs />
          <Navbar />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
