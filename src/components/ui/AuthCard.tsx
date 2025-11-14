import { ReactNode } from 'react'
import clsx from 'clsx'

type AuthCardProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps): React.ReactElement {
  return (
    <div className={clsx('w-full max-w-md space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_0_60px_rgba(15,23,42,0.5)]', className)}>
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="text-white/70">{subtitle}</p>}
      </header>
      <div className="space-y-4">{children}</div>
      {footer && <div className="text-center text-sm text-white/70">{footer}</div>}
    </div>
  )
}
