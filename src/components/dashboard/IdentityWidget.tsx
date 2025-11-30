import { User } from '@prisma/client'

interface IdentityWidgetProps {
  user: Pick<User, 'name' | 'email' | 'coins' | 'avatar'>
}

export function IdentityWidget({ user }: IdentityWidgetProps) {
  const displayName = user.name || user.email || 'UNKNOWN AGENT'
  
  return (
    <div className="relative h-full w-full overflow-hidden bg-aether-dark/80 p-6 clip-path-angle-sm border-l-4 border-aether-cyan group">
      {/* Background Tech Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,240,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-aether-cyan/30 rounded-tr-3xl opacity-50" />
      
      <div className="relative z-10 flex items-center gap-6">
        {/* Avatar Frame */}
        <div className="relative">
            <div className="w-24 h-24 relative overflow-hidden clip-path-hexagon border-2 border-aether-cyan/50 group-hover:border-aether-cyan transition-colors">
                {user.avatar ? (
                    <img src={user.avatar} alt="Agent" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-aether-cyan/10 flex items-center justify-center text-3xl">👤</div>
                )}
            </div>
            {/* Rotating Ring */}
            <div className="absolute -inset-2 border border-dashed border-aether-cyan/30 rounded-full animate-spin-slow pointer-events-none" />
        </div>

        <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-tech text-aether-cyan/60 tracking-widest">IDENTITY_VERIFIED</span>
                <span className="text-xs font-tech text-aether-gold tracking-widest animate-pulse">● ONLINE</span>
            </div>
            <h2 className="text-2xl font-heading text-white tracking-wide uppercase">{displayName}</h2>
            
            <div className="flex items-center gap-4 mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-tech text-aether-mint/50 uppercase">CREDITS</span>
                    <span className="text-xl font-mono text-aether-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
                        {String(user.coins ?? 0).padStart(5, '0')}
                    </span>
                </div>
                <div className="h-8 w-[1px] bg-aether-cyan/20" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-tech text-aether-mint/50 uppercase">CLEARANCE</span>
                    <span className="text-xl font-mono text-aether-cyan">LV.05</span>
                </div>
            </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-aether-cyan via-transparent to-transparent opacity-50" />
    </div>
  )
}
