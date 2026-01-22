import React from 'react'
import clsx from 'clsx'

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  children: React.ReactNode
  icon?: React.ReactNode
}

export function TechButton({
  variant = 'primary',
  children,
  className = '',
  icon,
  as: Component = 'button',
  ...props
}: TechButtonProps & { as?: React.ElementType }) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl border-2 px-4 py-2 sm:px-6 sm:py-3 font-pixel text-pixel-xs sm:text-pixel-sm uppercase tracking-[0.35em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30'


  const variants: Record<Required<TechButtonProps>['variant'], string> = {
    primary:
      'border-samurai-blue/80 bg-gradient-to-br from-samurai-blue/30 to-samurai-blue/10 text-white shadow-[0_10px_40px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_15px_45px_rgba(59,130,246,0.4)]',
    secondary:
      'border-samurai-success/60 bg-gradient-to-br from-samurai-success/10 to-samurai-blue/5 text-samurai-success hover:text-white hover:border-samurai-success/90',
    danger:
      'border-samurai-red/70 bg-gradient-to-br from-samurai-red/20 to-samurai-red/10 text-samurai-red hover:-translate-y-0.5 hover:border-samurai-red hover:text-white',
    ghost:
      'border-transparent bg-transparent text-samurai-text/60 hover:border-samurai-blue/60 hover:bg-samurai-blue/5 hover:text-white',
  }

  return (
    <Component className={clsx(baseStyles, variants[variant], 'group', className)} {...props}>
      <span className="absolute inset-0 -z-10 border border-white/10 opacity-0 transition group-hover:opacity-40" />
      <span
        className="absolute inset-0 -z-20 mix-blend-screen opacity-0 group-hover:opacity-70"
        style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.15), transparent 60%)' }}
      />
      {icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </Component>
  )
}
