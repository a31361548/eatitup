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
    <article className={clsx('group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_0_40px_rgba(15,23,42,0.35)] transition hover:border-white/30 hover:bg-white/10', className)}>
      <div className="absolute inset-0 opacity-0 blur-2xl transition group-hover:opacity-30" aria-hidden style={{ background: 'linear-gradient(125deg, rgba(16, 185, 129, 0.4), rgba(14, 116, 144, 0.4))' }} />
      <div className="relative z-10 flex flex-col gap-4">
        {(title || icon) && (
          <div className="flex items-center gap-3">
            {icon && <div className="rounded-2xl bg-white/10 p-3 text-2xl">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}
              {description && <p className="text-sm text-white/70">{description}</p>}
            </div>
          </div>
        )}
        {children}
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </article>
  )
}
