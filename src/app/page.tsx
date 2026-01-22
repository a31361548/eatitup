import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { LoginView } from '@/components/LoginView'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-samurai-dark px-4 py-16 text-samurai-blue">
      {/* Structured Grid Background */}
      <div className="absolute inset-0 depth-base opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-samurai-dark via-transparent to-samurai-dark pointer-events-none" />

      
      {/* Central Axis Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-samurai-red/10 pointer-events-none" />
      
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-12">
        {/* Header Section */}
        <div className="text-center space-y-6 relative">
            <div className="inline-block border border-samurai-blue/30 bg-samurai-blue/5 px-4 py-1 rounded-full backdrop-blur-sm mb-4">
                <span className="font-tech text-xs uppercase tracking-[0.3em] text-samurai-blue animate-pulse">
                    System Initialization
                </span>
            </div>
            
            <div className="relative">
                <h1 className="font-header text-5xl md:text-7xl text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] tracking-wider">
                    SAMURAI
                </h1>
                <p className="font-tech text-xl md:text-2xl text-samurai-red tracking-[0.8em] mt-2 uppercase opacity-80">
                    Command Shell
                </p>
                
                {/* Decorative Brackets */}
                <div className="absolute -left-8 top-0 bottom-0 w-4 border-l-2 border-t-2 border-b-2 border-samurai-blue/30 rounded-l opacity-50" />
                <div className="absolute -right-8 top-0 bottom-0 w-4 border-r-2 border-t-2 border-b-2 border-samurai-blue/30 rounded-r opacity-50" />
            </div>
        </div>

        {/* Login Container - Glass Panel */}
        <div className="w-full max-w-md relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-samurai-red/20 to-samurai-blue/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-samurai-dark/80 border border-samurai-red/30 backdrop-blur-md rounded-lg p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-samurai-red" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-samurai-red" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-samurai-red" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-samurai-red" />
                
                <div className="p-8">
                    <LoginView />
                </div>
            </div>
        </div>

        {/* Footer Status */}
        <div className="flex items-center gap-8 text-samurai-text/40 font-tech text-xs tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-samurai-blue/50 rounded-full animate-pulse" />
            <span>Server: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-samurai-blue/50 rounded-full animate-pulse delay-75" />
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-samurai-blue/50 rounded-full animate-pulse delay-150" />
            <span>Ver: 4.0.1</span>
          </div>
        </div>
      </section>
    </main>
  )
}
