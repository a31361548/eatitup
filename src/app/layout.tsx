import { ReactNode } from 'react'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Providers } from '@/components/Providers'

export default function RootLayout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-aether-dark text-aether-cyan font-pixel overflow-x-hidden relative">
        <div className="scanlines" />
        <div className="crt-flicker" />
        <Providers>
          <Navbar />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
