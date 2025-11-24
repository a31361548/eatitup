import { ReactNode } from 'react'
import './globals.css'
// import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs'
import { Navbar } from '@/components/ui/Navbar'
import { Providers } from '@/components/Providers'

export default function RootLayout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Rajdhani:wght@300;500;700&family=Noto+Sans+TC:wght@300;400;700&family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-void-900 text-mythril-100 antialiased font-tech overflow-x-hidden">
        <Providers>
          {/* <BackgroundOrbs /> Removed for Pixel Realm style */}
          <Navbar />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
