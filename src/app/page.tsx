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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with overlaid textures */}
      <div className="absolute inset-0 bg-login-hero bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/80 to-transparent"></div>
      
      {/* Floating Particles/Butterflies Effect (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-400 rounded-full animate-float opacity-50 shadow-[0_0_10px_#fbbf24]"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-30 shadow-[0_0_10px_#22d3ee]" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-mythril-100 rounded-full animate-float opacity-20 blur-sm" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-6xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-600 drop-shadow-[0_0_15px_rgba(217,119,6,0.5)]">
            AETHER
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500/50"></div>
            <span className="text-cyan-400 font-tech tracking-[0.5em] text-sm uppercase">Chronicles</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500/50"></div>
          </div>
        </div>

        <LoginView />
      </div>
    </div>
  )
}
