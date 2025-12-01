import { ReactNode } from 'react'
import clsx from 'clsx'

type GlowCardProps = {
  title?: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function GlowCard({ title, description, icon, actions, children, className }: GlowCardProps): React.ReactElement {
  return (
    <article className={clsx('group relative overflow-hidden rounded-[26px] border-4 border-white/10 bg-gradient-to-br from-white/5 via-cyan-500/5 to-transparent p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.35)] backdrop-blur', className)}>
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-50" aria-hidden style={{ backgroundImage: 'linear-gradient(130deg, rgba(103,232,249,0.22), transparent 65%)' }} />
      <div className="absolute -top-6 left-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden />
      <div className="relative z-10 flex flex-col gap-4">
        {(title || icon) && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {icon && <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-2xl">{icon}</div>}
              <div>
                {title && <h3 className="font-pixel text-pixel-base uppercase tracking-[0.35em] text-white">{title}</h3>}
                {description && <p className="mt-1 text-sm text-white/70">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        )}
        {children}
        {!title && !icon && actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </article>
  )
}
